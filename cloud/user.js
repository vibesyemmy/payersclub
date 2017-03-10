/*jshint esversion: 6 */
var client = require(__dirname + '/modules/nodemailer.js');

Parse.Cloud.afterSave(Parse.User, (req, res) =>{
	var Pairing = Parse.Object.extend("Pairing"); 
	var user = req.object;
	var mailOptions = {
    from: '"FxChange Admin" <fxchange.club@gmail.com>', // sender address
    // to: user.get("email"), // list of receivers
    subject: 'Welcome ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
	};
	if (!user.existed()) {
		user.set("isPaired", false);
		user.set("isRecycled", false);
		return user.save(null,{useMasterKey: true}).then((u) =>{
			// Create pairings for donors
			var pairing = new Pairing();
			pairing.set("to", u); 
			pairing.set("eligible", false);
			return pairing.save(null,{useMasterKey: true});
		}).then((p) =>{
			// Pair to other account to donate
			/*
			 * Check first pair query
			 */
		 	var q1 = new Parse.Query("Pairing");
		 	q1.doesNotExist("p1");
		 	q1.equalTo("eligible", true);

		 	/*
			 * Check second pair query
			 */

		 	var q2 = new Parse.Query("Pairing");
		 	q2.doesNotExist("p2");
		 	q2.equalTo("eligible", true);

		 	/*
			 * Check third pair query
			 */

		 	var q3 = new Parse.Query("Pairing");
		 	q3.doesNotExist("p3");
		 	q3.equalTo("eligible", true);

		 	var mainQuery = Parse.Query.or(q1, q2, q3);
		 	mainQuery.ascending("createdAt");

		 	return mainQuery.first();
		}).then((p) =>{
			if (!p) {
				return sendEmail(user, mailOptions);
			}

			if (!p.get("p1")) {
				p.set("p1", user);
				return sendEmail(user, mailOptions);
			} else if (!p.get("p1")){
				p.set("p2", user);
				return sendEmail(user, mailOptions);
			} 
			p.set("p3", user);
			return sendEmail(user, mailOptions);
		}).then((info) =>{
			return res.success(info);
		}).catch((err) =>{
			return res.error(err);
		});
	}
});

Parse.Cloud.job('purgeInactive', (req, stat) =>{
	// the params passed through the start request
  var params = request.params;
  // Headers from the request that triggered the job
  var headers = request.headers;

  // get the parse-server logger
  var log = request.log;

  // Update the Job status message
  status.message("I just started");

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
	return client.send(opts);
}