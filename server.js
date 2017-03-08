#!/usr/bin/env node
var httpServer = require('http'),
		app				 = require('./src/server/app');

var port = app.get('port');

httpServer.createServer(app).listen(port, () => {});