/*jshint esversion: 6 */
var _ = require("underscore");
var r = require('../service/service-helper.js');
var env = process.env.NODE_ENV || "dev";

Parse.Cloud.job('Sanitize-Users', (req, stat) =>{
  var promises = [];
  var userQuery = new Parse.Query(Parse.User);
  userQuery.limit(999);
  userQuery.find().then((users) => {
    _.each(users, (u) => {
      promises.push(u.save(null, {useMasterKey: true}));
    });
  });
});

Parse.Cloud.job("Revert Users", (req, stat) =>{
  var promises = [];
  var userQuery = new Parse.Query(Parse.User);
  userQuery.limit(999);
  userQuery.find().then((users) =>{
    _.each(users, (user) =>{
      user.set("in_box_count", 0);
      user.set("benefit_count", 0);
      user.set("plan_pending", false);
      user.set("can_recycle", false);
      user.set("can_benefit", false);
      user.set("in_box", false);
      promises.push(user.save(null, {useMasterKey:true}));
    });
    return Parse.Promise.when(promises);
  }).then(() =>{
    var boxes = new Parse.Query("Box");
    boxes.limit(999);
    return boxes.find();
  }).then((boxes) =>{
    promises = [];
    _.each(boxes, (box) => {
      promises.push(box.destroy());
    });

    return Parse.Promise.when(promises);
  }).then(() =>{
    return stat.success("Done sanitizing.");
  }).catch((err) =>{
    return stat.error(err);
  });
});

Parse.Cloud.job('Recycler', (req, stat) =>{
  var beneficiaries = [];
  var donors = [];
  var dc = 0;
  var promises = [];

  var Box = Parse.Object.extend("Box");

  var r = new Parse.Query(Parse.User);
  r.equalTo("can_recycle", true);
  r.lessThanOrEqualTo("in_box_count", 1);
  r.equalTo("plan_pending", false);
  r.equalTo("can_benefit", true);
  r.descending("createdAt");
  r.equalTo("plan", "1");
  r.equalTo("hidden", false);

  // Donor query
  var dq = new Parse.Query(Parse.User);
  dq.equalTo("plan_pending", false);
  dq.equalTo("can_benefit", false);
  dq.equalTo("in_box_count", 0);
  dq.equalTo("benefit_count", 0);
  dq.descending("createdAt");
  dq.equalTo("plan", "1");
  dq.equalTo("hidden", false);

  // Recycler query
  var rq = new Parse.Query(Parse.User);
  rq.equalTo("benefit_count", 2);
  rq.equalTo("can_benefit", true);
  rq.equalTo("plan_pending", false);
  rq.equalTo("can_recycle", false);
  rq.equalTo("in_box_count", 0);
  rq.equalTo("hidden", false);

  r.find().then((users) =>{
    beneficiaries = users;
    var donor_count = beneficiaries.length * 2;

    var mainQ = Parse.Query.or(dq, rq);

    mainQ.limit(donor_count);
    mainQ.descending("updatedAt");
    return mainQ.find();
  }).then((dq) =>{
    donors = dq;

    // Loop through benx 
    // Confirmation Status
    // 0 = unconfirmed
    // 1 = has proof of payment
    // 2 = transaction complete
    // 3 = Box discarded

    // Timer Status
    // 
    // 0 = Donor timer
    // 1 = Benex timer
    // 
    // Max time for whole transaction 5 hours
    // Donor 2 hours
    // Benex 3 hours
    // Check with cron job hourly  
    var c = 0;
    var c2 = 0;
    
    console.log("Got here, ", beneficiaries.length);

    for (var i = 0; i < beneficiaries.length; i++) {
      c2 = c + 1;
      var d1, d2;
      var b1, b2;
      var benex = beneficiaries[i];
      d1 = donors[c];
      d2 = donors[c2];
      
      b1 = new Box();
      b1.set("beneficiary", benex);
      b1.set("donor", d1);
      b1.set("confirmation_status", 0);
      b1.set("timer_status", 0);

      b2 = new Box();
      b2.set("beneficiary", benex);
      b2.set("donor", d2);
      b2.set("confirmation_status", 0);
      b2.set("timer_status", 0);
      console.log(i +" - "+c+" - "+c2);
      c = c + 2;
      promises.push(b1.save());
      promises.push(b2.save());

      if (!c2) {
        return stat.error();
      }
    }

    return Parse.Promise.when(promises);
  }).then(() =>{
    return stat.success();
  }).catch((err) =>{
    return stat.error(err);
  })
})

Parse.Cloud.job('genericRecycler', (req, stat) =>{
  var plan = req.params.plan;
  var beneficiaries = [];
  var donors = [];
  var dc = 0;
  var promises = [];

  var Box = Parse.Object.extend("Box");

  var r = new Parse.Query(Parse.User);
  r.equalTo("can_recycle", true);
  r.lessThanOrEqualTo("in_box_count", 1);
  r.equalTo("plan_pending", false);
  r.equalTo("can_benefit", true);
  r.descending("createdAt");
  r.equalTo("plan", plan);
  r.equalTo("hidden", false);

  // Donor query
  var dq = new Parse.Query(Parse.User);
  dq.equalTo("plan_pending", false);
  dq.equalTo("can_benefit", false);
  dq.equalTo("in_box_count", 0);
  dq.equalTo("benefit_count", 0);
  dq.descending("createdAt");
  dq.equalTo("plan", plan);
  dq.equalTo("hidden", false);

  // Recycler query
  var rq = new Parse.Query(Parse.User);
  rq.equalTo("benefit_count", 2);
  rq.equalTo("can_benefit", true);
  rq.equalTo("plan_pending", false);
  rq.equalTo("can_recycle", false);
  rq.equalTo("in_box_count", 0);
  rq.equalTo("hidden", false);
  rq.equalTo("plan", plan);

  r.find().then((users) =>{
    beneficiaries = users;
    var donor_count = beneficiaries.length * 2;

    var mainQ = Parse.Query.or(dq, rq);

    mainQ.limit(donor_count);
    mainQ.descending("updatedAt");
    return mainQ.find();
  }).then((dq) =>{
    donors = dq;

    // Loop through benx 
    // Confirmation Status
    // 0 = unconfirmed
    // 1 = has proof of payment
    // 2 = transaction complete
    // 3 = Box discarded

    // Timer Status
    // 
    // 0 = Donor timer
    // 1 = Benex timer
    // 
    // Max time for whole transaction 5 hours
    // Donor 2 hours
    // Benex 3 hours
    // Check with cron job hourly  
    var c = 0;
    var c2 = 0;
    
    console.log("Got here, ", beneficiaries.length);

    for (var i = 0; i < beneficiaries.length; i++) {
      c2 = c + 1;
      var d1, d2;
      var b1, b2;
      var benex = beneficiaries[i];
      d1 = donors[c];
      d2 = donors[c2];
      
      b1 = new Box();
      b1.set("beneficiary", benex);
      b1.set("donor", d1);
      b1.set("confirmation_status", 0);
      b1.set("timer_status", 0);

      b2 = new Box();
      b2.set("beneficiary", benex);
      b2.set("donor", d2);
      b2.set("confirmation_status", 0);
      b2.set("timer_status", 0);
      console.log(i +" - "+c+" - "+c2);
      c = c + 2;
      promises.push(b1.save());
      promises.push(b2.save());

      if (!c2) {
        return stat.error();
      }
    }

    return Parse.Promise.when(promises);
  }).then(() =>{
    return stat.success();
  }).catch((err) =>{
    return stat.error(err);
  })
});

Parse.Cloud.job('doPairLoop10k', (req, stat) =>{
  var beneficiaries = [];
  var donors = [];
  var dc = 0;
  var promises = [];

  var Box = Parse.Object.extend("Box");

  // Beneficiary query
  var bq = new Parse.Query(Parse.User);
  bq.equalTo("benefit_count", 0);
  bq.lessThanOrEqualTo("in_box_count", 1);
  bq.equalTo("plan_pending", false);
  bq.equalTo("can_benefit", true);
  bq.descending("createdAt");
  bq.equalTo("plan", "1");
  bq.equalTo("hidden", false);

  // Donor query
  var dq = new Parse.Query(Parse.User);
  dq.equalTo("plan_pending", false);
  dq.equalTo("can_benefit", false);
  dq.equalTo("in_box_count", 0);
  dq.equalTo("benefit_count", 0);
  dq.descending("createdAt");
  dq.equalTo("plan", "1");
  dq.equalTo("hidden", false);

  // Recycler query
  var rq = new Parse.Query(Parse.User);
  rq.equalTo("benefit_count", 2);
  rq.equalTo("can_benefit", true);
  rq.equalTo("plan_pending", false);
  rq.equalTo("in_box_count", 0);
  rq.equalTo("hidden", false);

  bq.find().then((users) =>{
    beneficiaries = users;
    var donor_count = beneficiaries.length * 2;

    var mainQ = Parse.Query.or(dq, rq);

    mainQ.limit(donor_count);
    mainQ.descending("updatedAt");
    return mainQ.find();
  }).then((dq) =>{
    donors = dq;

    // Loop through benx 
    // Confirmation Status
    // 0 = unconfirmed
    // 1 = has proof of payment
    // 2 = transaction complete
    // 3 = Box discarded

    // Timer Status
    // 
    // 0 = Donor timer
    // 1 = Benex timer
    // 
    // Max time for whole transaction 5 hours
    // Donor 2 hours
    // Benex 3 hours
    // Check with cron job hourly  
    var c = 0;
    var c2 = 0;
    
    console.log("Got here, ", beneficiaries.length);

    for (var i = 0; i < beneficiaries.length; i++) {
      c2 = c + 1;
      var d1, d2;
      var b1, b2;
      var benex = beneficiaries[i];
      d1 = donors[c];
      d2 = donors[c2];
      
      b1 = new Box();
      b1.set("beneficiary", benex);
      b1.set("donor", d1);
      b1.set("confirmation_status", 0);
      b1.set("timer_status", 0);

      b2 = new Box();
      b2.set("beneficiary", benex);
      b2.set("donor", d2);
      b2.set("confirmation_status", 0);
      b2.set("timer_status", 0);
      console.log(i +" - "+c+" - "+c2);
      c = c + 2;
      promises.push(b1.save());
      promises.push(b2.save());

      if (!c2) {
        return stat.error();
      }
    }

    return Parse.Promise.when(promises);
  }).then(() =>{
    return stat.success();
  }).catch((err) =>{
    return stat.error(err);
  });
});

Parse.Cloud.job("job", (req, stat) =>{
  var plan = req.params.plan;
  var rQ = new Parse.Query(Parse.User);
  rQ.equalTo("plan", plan)
  rQ.find().then((users) => {
    for (var i = 0; i < users.length; i++) {
      console.log("From job - ",users[i].get("username"),users.length);
    }
    return stat.success();
  });
});

Parse.Cloud.job('genericMatch', (req, stat) =>{
  var plan = req.params.plan;
  var beneficiaries = [];
  var donors = [];
  var dc = 0;
  var promises = [];

  var Box = Parse.Object.extend("Box");

  // Beneficiary query
  var bq = new Parse.Query(Parse.User);
  bq.equalTo("benefit_count", 0);
  bq.lessThanOrEqualTo("in_box_count", 1);
  bq.equalTo("plan_pending", false);
  bq.equalTo("can_benefit", true);
  bq.descending("createdAt");
  bq.equalTo("plan", plan);
  bq.equalTo("hidden", false);

  // Donor query
  var dq = new Parse.Query(Parse.User);
  dq.equalTo("plan_pending", false);
  dq.equalTo("can_benefit", false);
  dq.equalTo("in_box_count", 0);
  dq.equalTo("benefit_count", 0);
  dq.descending("createdAt");
  dq.equalTo("plan", plan);
  dq.equalTo("hidden", false);

  // Recycler query
  var rq = new Parse.Query(Parse.User);
  rq.equalTo("benefit_count", 2);
  rq.equalTo("can_benefit", true);
  rq.equalTo("plan_pending", false);
  rq.equalTo("in_box_count", 0);
  rq.equalTo("plan", plan);
  rq.equalTo("hidden", false);

  bq.find().then((users) =>{
    beneficiaries = users;
    var donor_count = beneficiaries.length * 2;

    var mainQ = Parse.Query.or(dq, rq);

    mainQ.limit(donor_count);
    mainQ.descending("updatedAt");
    return mainQ.find();
  }).then((dq) =>{
    donors = dq;

    // Loop through benx 
    // Confirmation Status
    // 0 = unconfirmed
    // 1 = has proof of payment
    // 2 = transaction complete
    // 3 = Box discarded

    // Timer Status
    // 
    // 0 = Donor timer
    // 1 = Benex timer
    // 
    // Max time for whole transaction 5 hours
    // Donor 2 hours
    // Benex 3 hours
    // Check with cron job hourly  
    var c = 0;
    var c2 = 0;
    
    console.log("Got here, ", beneficiaries.length);

    for (var i = 0; i < beneficiaries.length; i++) {
      c2 = c + 1;
      var d1, d2;
      var b1, b2;
      var benex = beneficiaries[i];
      d1 = donors[c];
      d2 = donors[c2];
      
      b1 = new Box();
      b1.set("beneficiary", benex);
      b1.set("donor", d1);
      b1.set("confirmation_status", 0);
      b1.set("timer_status", 0);

      b2 = new Box();
      b2.set("beneficiary", benex);
      b2.set("donor", d2);
      b2.set("confirmation_status", 0);
      b2.set("timer_status", 0);
      console.log(i +" - "+c+" - "+c2);
      c = c + 2;
      promises.push(b1.save());
      promises.push(b2.save());

      if (!c2) {
        return stat.error();
      }
    }

    return Parse.Promise.when(promises);
  }).then(() =>{
    return stat.success();
  }).catch((err) =>{
    return stat.error(err);
  });
});