#!/usr/bin/env node
var		app				 = require('./app');
var ParseServer = require('parse-server').ParseServer;
var debug = require('debug')('fxchange:server');
var env = process.env.NODE_ENV || "dev";

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/1';
var port = app.get('port');

var h = require('./service/service-helper.js');

var databaseUri = 'mongodb://localhost:27017/fxchangeclub';

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

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
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
  masterKey: process.env.MASTER_KEY || '2h7bu8iPlLZ43Vt80rB97X2CDFmY087P', //Add your master key here. Keep it secret!
  serverURL: serverUri,  // Don't forget to change to https if needed
  // Enable email verification
  appName: 'FxChangeClub',
  publicServerURL: publicServerURL,
  liveQuery: {
    classNames: ['_User', 'Pairing']
  }
});

app.use(mountPath, api);

app.post('/referral', (req, res) => {
  var user = req.body;
  var options = {
    url: serverUri+'/users',
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
      'X-Parse-Revocable-Session': 1,
      'Content-Type': 'application/json'
    },
    form: user
  };

  return h.post(options).then((s) =>{
    res.redirect('/#!/login');
  }).catch((err) =>{
    res.render("register", { ref : user.ref, errors: err});
  });
});

// app.get('/*', function(req, res){
//     res.sendFile(__dirname + '/dist/index.html');
// });

let httpServer = require('http').createServer(app);

var io = require('socket.io').listen(httpServer);

var users = [];
var count = 0;

io.sockets.on('connection', (s) =>{

  s.on('room', (room) =>{
    console.log("Joining "+room+" room.");
    s.join(room);
  });

  s.on('new_user', (user) =>{
    console.log(user.username+ " is ready to chat.");
    user.sid = s.id;
    var userIndex;
    for (var i = 0; i < users.length; i++) {
      if (users[i].objectId === user.objectId) {
        userIndex = i;
      }
    }

    if (userIndex) {
      users[userIndex] = user;
    } else {
      users.push(user);
    }

    io.sockets.emit('new_connection', {
      user: user,
      sender:"system",
      created_at: new Date().toISOString(),
      users: users,
    });
    // console.log(users);
  });
  
  s.on('disconnect', function () {
    var user;
    for (var i = 0; i < users.length; i++) {
      if (users[i].sid === s.id) {
        user = users[i];
        console.log(user.username+" has disconnected");
        users.splice(i, 1);
      }
    }
    io.sockets.emit('bye', {
      user: user,
      sender:"system",
      created_at: new Date().toISOString(),
      users: users,
    });
  });

});

app.use('/socket', require('./routes/socket.route')(io));

httpServer.listen(port);


// httpServer.createServer(app).listen(port);

httpServer.on('error', onError);
httpServer.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// var parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);
