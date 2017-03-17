class AdminPairsCtrl {
	constructor(users, Pair, $rootScope, $state){
		'ngInject';

		this.users = users;
		this.pair = Pair;
		this.plans = "1";
		this.itemsByPage = 10;
		this.rs = $rootScope;
		this.predicates = ['objectId', 'lastName'];
		this.state = $state;
	}

	getUsers(){
		this.rs.stateLoading = true;
		this.pair.getUsersByPlan(this.plans).then((users) =>{
			this.users = users;
			this.rs.stateLoading = false;
		}).catch((err) =>{
			this.rs.stateLoading = false;
			console.log(err);
		});
	}
}

class AdminPairCtrl {
	constructor(user, Pair, $rootScope, $state, Alert){
		'ngInject';
		this.rs = $rootScope;
		this.user = user;
		this.users = [];
		this.pair = Pair;
		this.state = $state;
		this.alert = Alert;
		this.init();
	}

	attach(p) {
		var to = JSON.parse(this.phTo);	
		this.rs.stateLoading = true;
		this.pair.attach(to.objectId, this.user.objectId, p).then((pair) =>{
			console.log(pair);
			for (var i = 0; i < this.users.length; i++) {
				var u = this.users[i];
				console.log(u, pair.to);
				if (p == "1") {
					u.p1 = pair.to;
				} else if (p == "2") {
					u.p2 = pair.to;
				} else if (p == "3") {
					u.p3 = pair.to;
				} else {
					u.p4 = pair.to;
				}
			}
			return this.alert.alertMerge(to.objectId, this.user.objectId);
		}).then((res) =>{
			this.rs.stateLoading = false;
			window.location = "/";
		});
		

		// this
	}

	init() {
		this.rs.stateLoading = true;
		this.pair.usersByPlan(this.user.objectId, this.user.plan).then((users) =>{
			for (var i = 0; i < users.length; i++) {
				var p = users[i];
				var user = p.to;
				user.p1 = p.p1;
				user.p2 = p.p2;
				user.p3 = p.p3;
				user.p4 = p.p4;
				if (user.isPaired && user.plan === this.user.plan) {
					this.users.push(user);
				}
			}
			this.rs.stateLoading = false;
		}).catch((err) =>{
			console.log(err);
			this.rs.stateLoading = false;
		});
	}
}

let $ctrl = {
	pairs : AdminPairsCtrl,
	pair  : AdminPairCtrl
}

export default $ctrl;