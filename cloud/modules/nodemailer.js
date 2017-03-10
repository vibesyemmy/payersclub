var nodemailer 	= require('nodemailer');
var q 					= require('q');
var config 			= require('./config.json');

var service = {};

service.send = SendMessage;

module.exports = service;


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    		user: 'fxchange.club@gmail.com',
        pass: 'admin2017'
    }
});

function SendMessage (mailOptions) {
	console.log(config.private_key, config.client_id);
	var defer = q.defer();
	transporter.sendMail(mailOptions, function(err, info) {
		if (err) {
			defer.reject(err);
		} else {
			defer.resolve(info);
		}
	});
	return defer.promise;
}