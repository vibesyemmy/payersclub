/*jshint esversion: 6 */
var _ = require("underscore");

Parse.Cloud.job('match-10k', (req, stat) =>{
  // the params passed through the start request
  var params = req.params;
  // Headers from the request that triggered the job
  var headers = req.headers;

  // get the parse-server logger
  var log = req.log;

  // Users
  var usrs = [];
  // Pairings
  var prs = [];

  // Update the Job status message
  stat.message("I just started");
  var users = new Parse.Query(Parse.User);
  users.equalTo("isPaired", false);
  users.equalTo("plan", "1");

  users.find().then((u) =>{
    usrs = u;
    var p = new Parse.Query("Pairing");
    p.equalTo("plan", "1");
    p.include("to");
    return p.find();
  }).then((ps) =>{
    for (var i = 0; i < ps.length; i++) {
      var ppp = ps[i];
      if (!ppp.get("p1") || !ppp.get("p2") || !ppp.get("p3") || !ppp.get("p4")) {
        prs.push(ppp);
      }
    }
    return match(usrs , prs);
  }).then((users) =>{
    stat.success("Done");
  }).catch((err) =>{
    stat.error(err);
  });
});

Parse.Cloud.job('match-20k', (req, stat) =>{
  // the params passed through the start request
  var params = req.params;
  // Headers from the request that triggered the job
  var headers = req.headers;

  // get the parse-server logger
  var log = req.log;

  // Users
  var usrs = [];
  // Pairings
  var prs = [];

  // Update the Job status message
  stat.message("I just started");
  var users = new Parse.Query(Parse.User);
  users.equalTo("isPaired", false);
  users.equalTo("plan", "2");

  users.find().then((u) =>{
    usrs = u;
    var p = new Parse.Query("Pairing");
    p.equalTo("plan", "2");
    p.include("to");
    return p.find();
  }).then((ps) =>{
    for (var i = 0; i < ps.length; i++) {
      var ppp = ps[i];
      if (!ppp.get("p1") || !ppp.get("p2") || !ppp.get("p3") || !ppp.get("p4")) {
        prs.push(ppp);
      }
    }
    return match(usrs , prs);
  }).then((users) =>{
    stat.success("Done");
  }).catch((err) =>{
    stat.error(err);
  });
});

Parse.Cloud.job('match-50k', (req, stat) =>{
  // the params passed through the start request
  var params = req.params;
  // Headers from the request that triggered the job
  var headers = req.headers;

  // get the parse-server logger
  var log = req.log;

  // Users
  var usrs = [];
  // Pairings
  var prs = [];

  // Update the Job status message
  stat.message("I just started");
  var users = new Parse.Query(Parse.User);
  users.equalTo("isPaired", false);
  users.equalTo("plan", "3");

  users.find().then((u) =>{
    usrs = u;
    var p = new Parse.Query("Pairing");
    p.equalTo("plan", "3");
    p.include("to");
    return p.find();
  }).then((ps) =>{
    for (var i = 0; i < ps.length; i++) {
      var ppp = ps[i];
      if (!ppp.get("p1") || !ppp.get("p2") || !ppp.get("p3") || !ppp.get("p4")) {
        prs.push(ppp);
      }
    }
    return match(usrs , prs);
  }).then((users) =>{
    stat.success("Done");
  }).catch((err) =>{
    stat.error(err);
  });
});

Parse.Cloud.job('match-100k', (req, stat) =>{
	// the params passed through the start request
  var params = req.params;
  // Headers from the request that triggered the job
  var headers = req.headers;

  // get the parse-server logger
  var log = req.log;

  // Users
  var usrs = [];
  // Pairings
  var prs = [];

  // Update the Job status message
  stat.message("I just started");
  var users = new Parse.Query(Parse.User);
  users.equalTo("isPaired", false);
  users.equalTo("plan", "4");

  users.find().then((u) =>{
  	usrs = u;
  	var p = new Parse.Query("Pairing");
  	p.equalTo("plan", "4");
  	p.include("to");
  	return p.find();
  }).then((ps) =>{
  	for (var i = 0; i < ps.length; i++) {
  		var ppp = ps[i];
  		if (!ppp.get("p1") || !ppp.get("p2") || !ppp.get("p3") || !ppp.get("p4")) {
  			prs.push(ppp);
  		}
  	}
  	return match(usrs , prs);
  }).then((users) =>{
  	stat.success("Done");
  }).catch((err) =>{
  	stat.error(err);
  });
});

function match(us, ps) {
  var pairx = [];
  for (var i = 0; i < us.length; i++) {
    var user = us[i];
    for (var i = 0; i < ps.length; i++) {
      var pair = ps[i];

      if (pair.get("to").id === user.id && !user.get("isPaired")) { continue;}
      user.set("isPaired", true);

      pairx.push(user.save(null, {useMasterKey:true}).then((user) =>{
        return getUserPair(user, pair);
      }).then((pair)=>{
        return pair.save(null, {useMasterKey:true});
      }));
    }
  }
  var promise = Parse.Promise.as();
  _.each(pairx, (pair) =>{
    promise = promise.then(function(){
      return pair.save(null, {useMasterKey:true});
    });
  })
  return promise;
}

function getUserPair(user, pair) {
  if (!pair.get("p1")) {
    pair.set("p1", user);
  } else 

  if (!pair.get("p2") && pair.get("p1").id != user.id && pair.get("p3").id != user.id && pair.get("p4").id != user.id) {
    pair.set("p2", user);
  } else 

  if (!pair.get("p3") && pair.get("p1").id != user.id && pair.get("p2").id != user.id && pair.get("p4").id != user.id) {
    pair.set("p3", user);
  } else if (!pair.get("p4") && pair.get("p1").id != user.id && pair.get("p2").id != user.id && pair.get("p3").id != user.id) { 
    pair.set("p4", user);
  }

  return pair;
}

Parse.Cloud.job("pair", (req, stat) =>{
  var plan = req.params.plan;

  // Get Users in plan
  var users = new Parse.Query(Parse.User);
  users.equalTo("isPaired", false);
  users.find().then((users) =>{
    _.each(users, (user) =>{
      for (var i = 0; i < 2; i++) {
        console.log(user.get("username"));
      }
    });
  });
  stat.success("Done");

});