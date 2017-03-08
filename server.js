#!/usr/bin/env node
var httpServer = require('http'),
		app				 = require('./app');

var port = app.get('port');

httpServer.createServer(app).listen(port, () => {});