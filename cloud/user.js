/*jshint esversion: 6 */

// Admin 0
// fe 1
// nu 2

var _ = require("underscore");

var client = require(__dirname + '/modules/nodemailer.js');

var env = process.env.NODE_ENV || "dev";

Parse.Cloud.beforeSave(Parse.User, (req, res) =>{
	var user = req.object;

	if(!user.has("role")) {
		user.set("role", 2);
	}

	if (!user.has("can_benefit")) {
		user.set("can_benefit", false);
	}

	if (!user.has("can_recycle")) {
		user.set("can_recycle", false);
	}

	if (!user.has("benefit_count")) {
		user.set("benefit_count", 0);
	}

	if (!user.has("plan_pending")) {
		user.set("plan_pending", false);
	}

	res.success();

});

Parse.Cloud.afterSave(Parse.User, (req, res) => {
	var user = req.object;
	var Box = Parse.Object.extend("Box");
	if (!user.existed()) {
		if (env === "dev") {
			return res.success();
		}
		sendEmail(user, getMailOptions(user)).then((info) =>{
			return res.success(info);
		});

	}

	// Match after donating
	if (user.get("can_benefit")) {
		// Donor query
		var dq = new Parse.Query(Parse.User);
		dq.equalTo("plan_pending", false);
		dq.equalTo("can_benefit", false);
		dq.equalTo("plan", user.get("plan"));

		// Recycle Query
		var rq1 = new Parse.Query(Parse.User);
		rq1.greaterThanOrEqualTo("benefit_count", 2);
		rq1.notEqualTo("objectId", user.id);
		rq1.equalTo("plan", user.get("plan"));

		var mainQ = Parse.Query.or(dq, rq1);
		mainQ.descending("createdAt");
		mainQ.limit(2);

		return mainQ.find().then((dq) =>{
			var promises = [];
			donors = dq;
			for (var i = 0; i < 2; i++) {
				var box = new Box();

				box.set("beneficiary", user);
				box.set("donor", donors[i]);
				box.set("confirmation_status", 0);
				box.set("timer_status", 0);
				promises.push(box.save());
			}
			return Parse.Promise.when(promises);
		}).then(() =>{
			return res.success();
		}).catch((err) =>{
			return res.error(err);
		});
	}
});

Parse.Cloud.job('doPairLoop10k', (req, stat) =>{
	var beneficiaries = [];
	var donors = [];
	var dc = 0;
	var promises = [];

	var Box = Parse.Object.extend("Box");

	// Beneficiary query
	var bq = new Parse.Query(Parse.User);
	bq.lessThanOrEqualTo("benefit_count", 2);
	bq.equalTo("plan_pending", false);
	bq.equalTo("can_benefit", true);
	bq.descending("createdAt");
	bq.equalTo("plan", "1");

	// Donor query
	var dq = new Parse.Query(Parse.User);
	dq.equalTo("plan_pending", false);
	dq.equalTo("can_benefit", false);
	dq.descending("createdAt");
	dq.equalTo("plan", "1");

	bq.find().then((users) =>{
		beneficiaries = users;
		var donor_count = beneficiaries.length * 2;
		dq.limit(donor_count);
		dq.descending("createdAt");
		return dq.find();
	}).then((dq) =>{
		donors = dq;

		// Loop through benx 
		// Confirmation Status
		// 0 = unconfirmed
		// 1 = has proof of payment
		// 2 = transaction complete
		// 3 = Box discarded

		// Timer Status
		// 
		// 0 = Donor timer
		// 1 = Benex timer
		// 
		// Max time for whole transaction 5 hours
		// Donor 2 hours
		// Benex 3 hours
		// Check with cron job hourly  
		var c = 0;
		for (var i = 0; i < beneficiaries.length; i++) {
			for (var i2 = 0; i2 < 2; i2++) {
				console.log(i, c);
				var benex = beneficiaries[i];
				var donor = donors[c];



				var box = new Box();

				box.set("beneficiary", benex);
				box.set("donor", donor);
				box.set("confirmation_status", 0);
				box.set("timer_status", 0);

				promises.push(box.save());
				c++;
			}
		}

		return Parse.Promise.when(promises);
	}).then(() =>{
		return stat.success();
	}).catch((err) =>{
		return stat.error(err);
	});
});

// Parse.Cloud.afterSave(Parse.User, (req, res) =>{
// 	var Pairing = Parse.Object.extend("Pairing"); 
// 	var user = req.object;
// 	var mailOptions = {
    
// 	if (!user.existed()) {
// 		user.set("isPaired", false);
// 		user.set("isRecycled", false);

// 		return user.save(null,{useMasterKey: true}).then((u) =>{
// 		}).then((p) =>{
// 			var env = process.env.NODE_ENV || "dev";
// 			return sendEmail(user, mailOptions);
// 		}).then((info) =>{
// 			return res.success(info);
// 		}).catch((err) =>{
// 			return res.error(err);
// 		});
// 	}
// });



function getMailOptions(user) {
	let opt = {
		from: '"FxChange Admin" <no-reply@fxchange.club>', // sender address
    // to: user.get("email"), // list of receivers
    subject: 'Welcome ✔', // Subject line
    text: createTextEmail(user), // plain text body
    html: createHTMLEmail(user) // html body
	};

	return opt;
}


function sendEmail(user, opts) {
	opts.to = user.get("email");
	return client.send(opts).then((info) =>{
		return;
	});
}

function createTextEmail(user) {
	var text = "Hello, "+user.get("username")+"\n";
	text += "Thank you for your interest in becoming a member of FXCHANGE CLUB. We are pleased to welcome you into our community. We assure you that your decision to be part of us, is one you will always live to celebrate. \n";
	text += "FXCHANGE CLUB is not just an added number to the already existing donation platforms, rather we are here with an ideology that is resilient and represents who we are and what we stand for. \n";
	text += "FXCHANGE CLUB peer to peer donation platform have improved on the flaws of other platforms. In other words, our principle, ideology and structure is one that will withstand the deluge of challenges that has led to the cessation of other platforms. \n";
	text += "Take a step in achieving your dreams. Feel free to contact us and ensure to like us on Facebook so as to get updated with new developments on FXCHANGE CLUB. \n \n";
	text += "Regards, \n";
	text += "TEAM FXCHANGE CLUB \n";
	text += "NOTE:  In this platform, recycling is the cornerstone, thus, hit and run is clipped, you either hit and stay or hit but while running away, you leave something behind for other members. \n";
	text += "Endeavour to invite friends and family with the link below\n";
	text += " https://fxchange.club/referral?ref="+user.id+"\n";
	text += "support@fxchange.club\n";
	text += "https://facebook.com/fxchangeclub \n";
	text += "FXCHANGE CLUB copyright 2017";
	text += "Follow this link to join our WhatsApp group: https://chat.whatsapp.com/ECufYC9rdEG1jATrMTELXP";

	return text;
}

function createHTMLEmail(user) {
	var html = "<p>Hello, <b>"+user.get("username")+"</b></p>";
	html += "<p>Thank you for your interest in becoming a member of <b>FXCHANGE CLUB</b>. We are pleased to welcome you into our community. We assure you that your decision to be part of us, is one you will always live to celebrate.</p>";
	html += "<p><b>FXCHANGE CLUB</b> is not just an added number to the already existing donation platforms, rather we are here with an ideology that is resilient and represents who we are and what we stand for.</p>";
	html += "<p><b>FXCHANGE CLUB</b> peer to peer donation platform have improved on the flaws of other platforms. In other words, our principle, ideology and structure is one that will withstand the deluge of challenges that has led to the cessation of other platforms.</p>";
	html += "<p>Take a step in achieving your dreams. Feel free to contact us and ensure to like us on Facebook so as to get updated with new developments on FXCHANGE CLUB.</p>";
	html += "<p>Regards,</p>";
	html += "<p><b>TEAM FXCHANGE CLUB</b></p>";
	html += "<br/>";
	html += "<p><b>NOTE:</b> In this platform, recycling is the cornerstone, thus, hit and run is clipped, you either hit and stay or hit but while running away, you leave something behind for other members.</p>";
	html += "<p>Endeavour to invite friends and family with the link below</p>";
	html += "<p><a href=\"https://fxchange.club/referral?ref="+user.id+"\">https://fxchange.club/referral?ref="+user.id+"</a></p>";
	html += "<p><a mailto=\"fxchange.club@gmail.com\">support@fxchange.club</a> </p>";
	html += "<p><a href=\"https://facebook.com/fxchangeclub\">https://facebook.com/fxchangeclub</a></p>";
	html += "<p><b>FXCHANGE CLUB</b> copyright 2017</p>";
	html += "<p>Follow this link to join our WhatsApp group: <a href=\"https://chat.whatsapp.com/ECufYC9rdEG1jATrMTELXP\">https://chat.whatsapp.com/ECufYC9rdEG1jATrMTELXP</a><p>";

	return html;
}