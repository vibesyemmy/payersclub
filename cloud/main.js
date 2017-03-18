require(__dirname + '/user.js');
require(__dirname + '/jobs.js');
require(__dirname + '/box.js');
var client = require(__dirname + '/modules/nodemailer.js');

Parse.Cloud.define('test', (req, res) => {
	// setup email data with unicode symbols
	var mailOptions = {
	    from: '"FxChange Admin" <fxchange.club@gmail.com>', // sender address
	    to: 'verygreenboi@gmail.com', // list of receivers
	    subject: 'Welcome ✔', // Subject line
	    text: 'Hello world ?', // plain text body
	    html: '<b>Hello world ?</b>' // html body
	};
	return client.send(mailOptions).then((info) =>{
		return res.success(info);
	}).catch((err) => {
		return res.error(err);
	});
});

Parse.Cloud.define('mail', (req, res) =>{
	var m = req.params;
	var mailOptions = {
    from: '"FxChange Admin" <support@fxchange.club>', // sender address
    to: m.to, // list of receivers
    subject: m.subject, // Subject line
    text: m.text, // plain text body
    html: m.html // html body
	};
	return client.send(mailOptions).then((info) =>{
		return res.success(info);
	}).catch((err) => {
		return res.error(err);
	});
})