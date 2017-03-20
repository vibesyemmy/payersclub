var _ = require("underscore");

var client = require(__dirname + '/modules/nodemailer.js');

var Box = Parse.Object.extend("Box");

Parse.Cloud.beforeSave("Box", (req, res) =>{
	var box = req.object;
	var donor = box.get("donor");
	var in_box_count = donor.get("in_box_count");
	if (!box.get("beneficiary") || !box.get("donor") ) {
		res.error("Can't save box without a beneficiary or donor");
	}
	res.success();
});

Parse.Cloud.afterSave("Box", (req, res) =>{
	var box = req.object;
	var promises = [];
	var benex = box.get("beneficiary");
	var donor = box.get("donor");

	if (!box.existed()) {
		benex.set("in_box", true);
		donor.set("in_box", true);
		benex.increment("in_box_count");
		donor.increment("in_box_count");
		promises.push(benex.save(null, {useMasterKey:true}));
		promises.push(donor.save(null, {useMasterKey:true}));
		return Parse.Promise.when(promises);
	}

	if (box.get("confirmation_status") == 2) {
		benex.increment("benefit_count");
		benex.set("in_box", false);
		donor.set("in_box", false);
		benex.increment("in_box_count", -1);
		donor.increment("in_box_count", -1);
		
		if (!donor.get("can_benefit")) {
			donor.set("can_benefit", true);
		} 

		// Recycling

		if (donor.get("can_benefit") && donor.get("benefit_count") < 4) {
			donor.increment("benefit_count");
		} 

		if (donor.get("benefit_count") == 4) {
			donor.set("plan", "-1");
			donor.set("plan_pending", true);
			donor.set("plan_pending_time", new Date());
			donor.set("can_recycle", false);
			donor.set("benefit_count", 0);
			donor.set("can_benefit", false);
			donor.set("in_box_count", 0);
		}
	}

	// Break box
	if (box.get("confirmation_status") == 3) {
		donor.set("plan", "-1");
		donor.set("plan_pending", true);
		donor.set("plan_pending_time", new Date());
		donor.set("can_recycle", false);
		donor.set("benefit_count", 0);
		donor.set("can_benefit", false);
		donor.set("in_box_count", 0);
	}
	promises.push(benex.save(null, {useMasterKey:true}));
	promises.push(donor.save(null, {useMasterKey:true}));

	return Parse.Promise.when(promises).then(() =>{
		return res.success();
	}).catch((err) =>{
		return res.error(err);
	});
});

Parse.Cloud.define('decline', (req, res) =>{
	var boxId = req.params.boxId;
	var promises = [];
	var benex;
	var donor;

	var boxQ = new Parse.Query("Box");
	boxQ.equalTo("objectId", boxId);
	boxQ.first().then((box) =>{
		benex = box.get("beneficiary");
		// Break box
		box.set("confirmation_status", 3);
		return box.save();
	}).then(() =>{
		// New donor query
		var dq = new Parse.Query(Parse.User);
		dq.equalTo("plan", benex.get("plan"));
		dq.equalTo("plan_pending", false);
		dq.equalTo("in_box_count", 0);
		dq.descending("createdAt");

		var rq = new Parse.Query(Parse.User);
		rq.equalTo("plan", benex.get("plan"));
		rq.equalTo("plan_pending", false);
		rq.equalTo("in_box_count", 0);
		rq.greaterThanOrEqualTo("benefit_count", 2);
		rq.notEqualTo("benefit_count", 4);

		var mainQ = Parse.Query.or(dq, rq);
		mainQ.descending("createdAt");
		return mainQ.first();
	}).then((d) =>{
		var donor = d;
		var box = new Box();
		box.set("beneficiary", benex);
		box.set("donor", donor);
		box.set("confirmation_status", 0);
		box.set("timer_status", 0);

		return box.save();
	}).then((res) =>{
		return res.success(res);
	}).catch((err) =>{
		return res.error(err);
	});
});