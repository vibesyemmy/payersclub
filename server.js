#!/usr/bin/env node
var httpServer = require('http'),
		app				 = require('./app');
var ParseServer = require('parse-server').ParseServer;

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/1';
var port = app.get('port');

var serverUri;
if (process.env.PARSE_SERVER_URI) {
  serverUri = process.env.PARSE_SERVER_URI + process.env.PARSE_MOUNT;
} else {
  serverUri = 'http://localhost:'+port+mountPath;
}
var publicServerURL;
if (process.env.PUB_SERVER_URL) {
  publicServerURL = process.env.PUB_SERVER_URL + mountPath;
} else {
  publicServerURL = 'http://localhost:'+port+mountPath;
}

var api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/fxchangeclub',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
  masterKey: process.env.MASTER_KEY || '2h7bu8iPlLZ43Vt80rB97X2CDFmY087P', //Add your master key here. Keep it secret!
  serverURL: serverUri,  // Don't forget to change to https if needed
  // Enable email verification
  appName: 'FxChangeClub',
  publicServerURL: publicServerURL
});

app.use(mountPath, api);


httpServer.createServer(app).listen(port, () => {});