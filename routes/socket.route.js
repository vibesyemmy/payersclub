var express = require('express');

var router = express.Router();
var sio;

let returnRouter = (io) =>{
	sio = io;

	router.get('/', get);
	router.post('/', post);
	router.put('/', put);
	router.delete('/', destroy);

	return router;
}

module.exports = returnRouter;

function get(req, res) {
	sio.sockets.emit("incoming_message", { message: "message", user: "user", created_at: "created_at" });
	res.status(200).json({ message: "Message received" });
}

function post(req, res) {
	sio.sockets.emit("incoming_message", { message: "message", user: "user", created_at: "created_at" });
	res.status(200).json({ message: "Message received" });
}

function put(req, res) {
	sio.sockets.emit("incoming_message", { message: "message", user: "user", created_at: "created_at" });
	res.status(200).json({ message: "Message received" });
}

function destroy(req, res) {
	sio.sockets.emit("incoming_message", { message: "message", user: "user", created_at: "created_at" });
	res.status(200).json({ message: "Message received" });
}