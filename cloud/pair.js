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
		p1.set("position", "p1");
		p1.set("pair", p);
		users.push(p1);
	}

	if (p.get("p2") && !p.get("p2").get("isPaired")) {
		p2 = p.get("p2");
		p2.set("position", "p2");
		p2.set("pair", p);
		users.push(p2);
	}

	if (p.get("p3") && !p.get("p3").get("isPaired")) {
		p3 = p.get("p3");
		p3.set("position", "p3");
		p3.set("pair", p);
		users.push(p3);
	}

	if (p.get("p4") && !p.get("p4").get("isPaired")) {
		p4 = p.get("p4");
		p4.set("position", "p4");
		p4.set("pair", p);
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

Parse.Cloud.define('pair', (req, res) =>{
	var uid = req.params.uid;
	var user;

	var u = new Parse.Query(Parse.User);
	var p = new Parse.Query("Pairing");
	u.equalTo("objectId", uid);
	u.first().then((ux) =>{
		user = ux;
		p.notEqualTo("to", user);
		p.notEqualTo("p1", user);
	  p.notEqualTo("p2", user);
	  p.notEqualTo("p3", user);
	  p.notEqualTo("p4", user);
	  p.equalTo("plan", user.get("plan"));
	  p.include("to");
	  return p.first();
	}).then((px) =>{
		console.log(checkP1(user, px),checkP2(user, px),checkP3(user, px),checkP4(user, px));
		if (checkP1(user, px)) {
			px.set("p1", user);
		} else if (checkP2(user, px)) {
			px.set("p2", user);
		} else if (checkP3(user, px)) {
			px.set("p3", user);
		} else if (checkP4(user, px)) {
			px.set("p4", user);
		}
		return px.save();
	}).then((p) =>{
		return res.success(p);
	}).catch((err) =>{
		return res.error(err);
	})
});

function checkP1(user, p) {
  var isP1 = false;
  if (!p.has("p1") || (p.has("p2") && p.get("p2").id != user.id) || (p.has("p3") && p.get("p3").id != user.id)  || (p.has("p4") && p.get("p4").id != user.id)) {
    isP1 = true;
  }
  return isP1;
}

function checkP2(user, p) {
  var isP2 = false;
  if (!p.has("p2") || (p.has("p1") && p.get("p1").id != user.id) || (p.has("p3") && p.get("p3").id != user.id)  || (p.has("p4") && p.get("p4").id != user.id)) {
    isP2 = true;
  }
  return isP2;
}

function checkP3(user, p) {
  var isP3 = false;
  if ((!p.has("p3") || (p.has("p1") && p.get("p1").id != user.id) || (p.has("p2") && p.get("p2").id != user.id)  || (p.has("p4") && p.get("p4").id != user.id))&& p.get("to").get("isRecycled")) {
    isP3 = true;
  }
  return isP3;
}

function checkP4(user, p) {
  var isP4 = false;
  if ((!p.has("p4") || (p.has("p1") && p.get("p1").id != user.id) || (p.has("p2") && p.get("p2").id != user.id)  || (p.has("p3") && p.get("p3").id != user.id))&& p.get("to").get("isRecycled")) {
    isP4 = true;
  }
  return isP4;
}