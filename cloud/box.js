var _ = require("underscore");

var client = require(__dirname + '/modules/nodemailer.js');

// Parse.Cloud.beforeSave("Box", (req, res) =>{
// 	var box = req.object;
// 	if (!box.get("beneficiary") || !box.get("donor") ) {
// 		res.error("Can't save box without a beneficiary");
// 	}
// 	res.success();
// });

// Parse.Cloud.afterSave("Box", (req, res) =>{
// 	var box = req.object;
// 	var promises = [];
// 	var benex = box.get("beneficiary");
// 	var donor = box.get("donor");

// 	if (!box.existed()) {
// 		benex.set("in_box", true);
// 		donor.set("in_box", true);
// 	}

// 	if (box.get("confirmation_status") == 2) {
// 		benex.increment("benefit_count");
// 		benex.set("in_box", false);
// 		donor.set("in_box", false);
// 		if (!donor.get("can_benefit")) {
// 			donor.set("can_benefit", true);
// 		} else if (donor.get("benefit_count") < 4) {
// 			donor.increment("benefit_count");
// 		} else if (donor.get("benefit_count") == 4) {
// 			donor.set("plan_pending", true);
// 			donor.set("can_recycle", false);
// 			donor.set("benefit_count", 0);
// 			donor.unset("plan");
// 		}
// 		promises.push(benex.save(null, {useMasterKey:true}));
// 		promises.push(donor.save(null, {useMasterKey:true}));
// 	}

// 	return Parse.Promise.when(promises).then(() =>{
// 		return res.success();
// 	}).catch((err) =>{
// 		return res.error(err);
// 	});
// });

Parse.Cloud.define('decline', (req, res) =>{
	var boxId = req.params.boxId;
	var promises = [];
	var benex;
	var donor;

	var boxQ = new Parse.Query("Box");
	boxQ.equalTo("objectId", boxId);
	boxQ.first().then((box) =>{

		// Break box

		benex = box.get("beneficiary");
		donor = box.get("donor");
		donor.set("plan_pending", true);
		donor.set("plan_pending_time", new Date());
		promises.push(donor.save(null, {useMasterKey:true}));
		box.set("confirmation_status", 3);
		promises.push(box.save());
		return Parse.Promise.when(promises);
	}).then(() =>{

		// New donor query
		var dq = new Parse.Query(Parse.User);
		dq.equalTo("plan", benex.get("plan"));
		dq.equalTo("plan_pending", false);
		dq.equalTo("can_benefit", false);
		dq.descending("createdAt");

		return dq.first();
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