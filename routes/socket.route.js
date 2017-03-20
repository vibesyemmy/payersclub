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
	router.post('/merge',merge);
	router.post('/confirm',confirmTx);

	router.post('/box/confirm', boxConfirmationRequest);

	return router;
}

module.exports = returnRouter;

function boxConfirmationRequest(req, res) {
	// After POP is uploaded
	var box = req.body.box;
	sio.sockets.emit("incoming_tx_confirmation_request", box);
	console.log(box);
	res.status(200).json({ message: "Tx Confirmation received" });
}

function confirmTx(req, res) {
	sio.sockets.emit("incoming_tx_confirm", {});
	res.status(200).json({ message: "Tx Confirmation received" });
}

function postNews(req, res) {
	var news = req.body.news;

	news.createdAt = new Date().toISOString();

	sio.sockets.emit("incoming_news", news);
	res.status(200).json({ message: "News received" });
}

function merge(req, res) {
	var to = req.body.to;
	var from = req.body.from;

	let mergeAlert = {
		to : to,
		from: from,
		createdAt: new Date().toISOString()
	}

	sio.sockets.emit('incoming_merge_alert', mergeAlert);
	res.status(200).json({ message: "Message received" });
}

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
	sio.sockets.emit("global_reset", { message: "message", user: "user", created_at: "created_at" });
	res.status(200).json({ message: "Message received" });
}
