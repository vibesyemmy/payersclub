/*jshint esversion: 6 */
var _ = require("underscore");

Parse.Cloud.beforeSave("Pairing", (req, res)=>{
	var p = req.object;

	if (p.get("to") == p.get("p1") || p.get("to") == p.get("p2") || p.get("to") == p.get("p3") || p.get("to") == p.get("p4")) {
		return res.error("Can't match to self");
	}

	return res.success();

});

Parse.Cloud.afterSave("Pairing", (req, res) =>{
	var p = req.object;
	var p1, p2, p3, p4;
	var users = [];
	var promises = [];

	if (p.get("p1") && !p.get("p1").get("isPaired")) {
		p1 = p.get("p1");
		p1.set("position", "p1")
		users.push(p1);
	}

	if (p.get("p2") && !p.get("p2").get("isPaired")) {
		p2 = p.get("p2");
		p2.set("position", "p2")
		users.push(p2);
	}

	if (p.get("p3") && !p.get("p3").get("isPaired")) {
		p3 = p.get("p3");
		p3.set("position", "p3")
		users.push(p3);
	}

	if (p.get("p4") && !p.get("p4").get("isPaired")) {
		p4 = p.get("p4");
		p4.set("position", "p4")
		users.push(p4);
	}

	_.each(users, (user) =>{
		user.set("isPaired", true);
		promises.push(user.save(null, {useMasterKey: true}));
	});

	Parse.Promise.when(promises).then(() =>{
		return res.success();
	}).catch((err) =>{
		return res.err(err);
	});
});