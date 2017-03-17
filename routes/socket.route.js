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

	return router;
}

module.exports = returnRouter;

function confirmTx(req, res) {
	var txId = req.body.txId;
	var fromUserId = req.body.fromUserId;
	var toUserId = req.body.toUserId;
	var confirm = req.body.confirm;

	let tx = {
		txId: txId,
		fromUserId: fromUserId,
		toUserId: toUserId,
		confirm: confirm
	}

	console.log(tx);

	sio.sockets.emit("incoming_tx_confirm", tx);
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
	sio.sockets.emit("incoming_message", { message: "message", user: "user", created_at: "created_at" });
	res.status(200).json({ message: "Message received" });
}
