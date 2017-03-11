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
// Configure app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 

app.use('/', express.static(path.join(__dirname, './dist')));

app.get('/referral', (req, res) =>{
	res.render("register", { ref : req.query.ref});
});

module.exports = app;