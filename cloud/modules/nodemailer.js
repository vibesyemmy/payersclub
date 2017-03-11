var nodemailer 	= require('nodemailer');
var q 					= require('q');
var config 			= require('./config.json');
var handlebars 	= require('handlebars');
var mg 					= require('nodemailer-mailgun-transport');

var service = {};

service.send = SendMessage;

module.exports = service;

var auth = {
	auth: {
		api_key: 'key-9vmhz-shoqd2qm8votyipmtnh-m9xjg6',
  	domain: 'fxchange.club'
  }
}

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(mg(auth));

function SendMessage (mailOptions) {
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