var express = require('express');
var path = require('path');
var ParseServer = require('parse-server').ParseServer;
var bodyParser = require('body-parser');

var port = process.env.PORT || 3070;

var app = express();

app.set('port', port);

if ('production' == app.settings.env) app.disable('verbose errors');

// Use Middleware
app.use(bodyParser.urlencoded({
  extended: true
}));
// parse application/json 
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, './dist')));

module.exports = app;