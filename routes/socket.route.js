var express = require('express');

var router = express.Router();
var sio;

let returnRouter = (io) =>{
	sio = io;

	router.get('/', get);
	router.post('/', post);
	router.put('/', put);
	router.delete('/', destroy);

	router.post('/news', postNews);

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

function postNews(req, res) {
	var news = req.body.news;

	news.createdAt = new Date().toISOString();

	sio.sockets.emit("incoming_news", news);
	res.status(200).json({ message: "News received" });
}