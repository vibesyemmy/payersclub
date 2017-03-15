/*jshint esversion: 6 */
var client = require(__dirname + '/modules/nodemailer.js');

Parse.Cloud.beforeSave(Parse.User, (req, res) =>{
	var user = req.object;
	var pUsername = user.get("username");
	user.set("username", pUsername.toLowerCase());
	user.set("pUsername", pUsername);

	res.success();
})

Parse.Cloud.afterSave(Parse.User, (req, res) =>{
	var Pairing = Parse.Object.extend("Pairing"); 
	var user = req.object;
	var mailOptions = {
    from: '"FxChange Admin" <no-reply@fxchange.club>', // sender address
    // to: user.get("email"), // list of receivers
    subject: 'Welcome ✔', // Subject line
    text: createTextEmail(user), // plain text body
    html: createHTMLEmail(user) // html body
	};
	if (!user.existed()) {
		user.set("isPaired", false);
		user.set("isRecycled", false);
		return user.save(null,{useMasterKey: true}).then((p) =>{
			return sendEmail(user, mailOptions);
		}).then((info) =>{
			return res.success(info);
		}).catch((err) =>{
			return res.error(err);
		});
	}
});

Parse.Cloud.job('purgePairs', (req, stat) =>{
	// the params passed through the start request
  var params = req.params;
  // Headers from the request that triggered the job
  var headers = req.headers;

  // get the parse-server logger
  var log = req.log;

  // Update the Job status message
  stat.message("I just started");

  var p = new Parse.Query("Pairing");

  p.find().then((px) =>{
  	var promises = [];

  	for (var i = 0; i < px.length; i++) {
  		promises.push(px[i].destroy());
  	}

  	return Parse.Promise.when(promises);
  }).then(() =>{
  	stat.success("Done!");
  }).catch((err) =>{
  	stat.error(err);
  });

  // doSomethingVeryLong().then(function(result) {
  //   // Mark the job as successful
  //   // success and error only support string as parameters
  //   status.success("I just finished");
  // }, function(error) {
  //   // Mark the job as errored
  //   status.error("There was an error");
  // })

})

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