/*jshint esversion: 6 */
var _ = require("underscore");
var r = require('../service/service-helper.js');
var env = process.env.NODE_ENV || "dev";



Parse.Cloud.job('eligible',(req, stat) =>{
  var promises = [];
  var q = new Parse.Query("Pairing");
  q.find().then((p) =>{
    _.each(p, (pair) =>{
      promises.push(pair.destroy());
    });
    return Parse.Promise.when(promises)
  }).then(() =>{
    return stat.success("Done");
  }).catch((err) =>{
    return stat.error(err);
  });
});

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
    var promise       = Parse.Promise.as();
    var innerPromise  = Parse.Promise.as();
    _.each(users, (user) =>{
      promise = promise.then(() =>{
        var ux = new Parse.Query("Pairing");
        ux.notEqualTo("to", user);
        ux.equalTo("plan", user.get("plan"));
        ux.include(["to", "p1", "p2", "p3", "p4"]);
        return ux.find().then((ps) =>{
          _.each(ps, (pp) =>{
            if (checkP1(user, pp)) {
              console.log("=======================");
              console.log("=       Save p1       =");
              console.log("=======================");
              pp.set("p1", user);
            } else if (checkP2(user, pp)) {
              console.log("=======================");
              console.log("=       Save p2       =");
              console.log("=======================");
              pp.set("p2", user);
            } else if (checkP3(user, pp)) {
              console.log("=======================");
              console.log("=       Save p3       =");
              console.log("=======================");
              pp.set("p3", user);
            } else if (checkP4(user, pp)) {
              console.log("=======================");
              console.log("=       Save p4       =");
              console.log("=======================");
              pp.set("p4", user);
            }
            return pp.save(null, {useMasterKey:true})
          });
        });
      });
    });
    return promise;
  }).then(() =>{
    stat.success("Done");  
  }).catch((err) =>{
    stat.error(err);
  });

});

Parse.Cloud.job('pair-3', (req, stat) =>{
  var users = new Parse.Query(Parse.User);
  users.equalTo("isPaired", false);
  users.find().then((users) =>{
    var promise = Parse.Promise.as();
    var url = env === "dev" ? 'http://localhost:3070/1/functions/pair' : 'https://fxchange.club/1/functions/pair';
    _.each(users, (user) =>{
      promise = promise.then(() =>{
        var opt = {
          url: url,
          headers: {
            'X-Parse-Application-Id': process.env.APP_ID || '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
            'Content-Type': 'application/json'
          },
          json: {
            uid: user.id
          }
        }
        return r.post(opt);
      })
    });
    return promise;
  }).then((res) =>{
    var pz = res;
    console.log(res.result);
    stat.success("Done");
  }).catch((err) =>{
    stat.error(err);
  });
});

Parse.Cloud.job('pair-2', (req, stat) =>{
  var u = [];
  var p = [];
  var promise = [];

  var users = new Parse.Query(Parse.User);
  users.equalTo("isPaired", false);
  users.find().then((us) =>{
    u = us;
    var ux = new Parse.Query("Pairing");
    ux.include(["to", "p1", "p2", "p3", "p4"]);
    return ux.find();
  }).then((ps) =>{
    var i = u.length;
    p = ps;
    while (i--) {
      console.log(u[i].get("username"));
      promise.push(pair(u[i]));
      u.splice(i, 1);
    };
    return promise;
  }).then((prs) =>{
    var promise = Parse.Promise.as();
    _.each(prs, (p) =>{
      promise = promise.then(() =>{
        p.save();
      });
    });
    return promise;
  }).then(() =>{
    stat.success();
  }).catch((err) =>{
    console.log(err);
    stat.error(err);
  });
});

function pair(user) {
  var p = new Parse.Query("Pairing");
  p.notEqualTo("to", user);
  p.notEqualTo("p1", user);
  p.notEqualTo("p2", user);
  p.notEqualTo("p3", user);
  p.notEqualTo("p4", user);
  p.equalTo("plan", user.get("plan"));

  return p.first().then((px)=>{
    if(!px.has("p1")) {
      console.log("=======================");
      console.log("=       Save p1       =");
      console.log("=======================");
      px.set("p1", user);
    } else if(px.has("p1") && !px.has("p2")){
      console.log("=======================");
      console.log("=       Save p2       =");
      console.log("=======================");
      px.set("p2", user);
    } else if(px.has("p1") && px.has("p2") && !px.has("p3") && user.get("isRecycled")){
      console.log("=======================");
      console.log("=       Save p3       =");
      console.log("=======================");
      px.set("p3", user);
    } else if(px.has("p1") && px.has("p2") && px.has("p3") && !px.has("p4") && user.get("isRecycled")) {
      console.log("=======================");
      console.log("=       Save p4       =");
      console.log("=======================");
      px.set("p3", user);
    }

    return px.save();
  });
}

Parse.Cloud.job('wipe', (req, stat) =>{
  // Clean Users
  var u = [];
  var p = [];
  var uq = new Parse.Query(Parse.User);
  uq.limit(100);
  var pq = new Parse.Query("Pairing");
  uq.find().then((users) =>{
    _.each(users, (user) =>{
      console.log(user.get("username"));
      user.set("isPaired", false);
      user.unset("position");
      user.unset("pair");
      u.push(user.save(null, {useMasterKey:true}))
    });
    return Parse.Promise.when(u);
  }).then(() =>{
    return pq.find();
  }).then((pairs) =>{
    _.each(pairs, (pair) =>{
      pair.unset("p1");
      pair.unset("p2");
      pair.unset("p3");
      pair.unset("p4");
      p.push(pair.save());
    });
    return Parse.Promise.when(p);
  }).then(() =>{
    stat.success();
  }).catch((err) =>{
    stat.error(err);
  });
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