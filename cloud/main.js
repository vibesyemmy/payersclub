require(__dirname + '/user.js');
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
})