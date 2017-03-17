class AdminCtrl {
	constructor(users, User, $rootScope, $filter, SocketIO){
		'ngInject';
		this.users = users;
		this.userService = User;
		this.rs = $rootScope;
		this.itemsByPage = 10;
		this.filter = $filter;

		console.log(users.length);
	}

	pair(user) {
		this.rs.stateLoading = true;
		var usr = this.filter('filter')(this.users, (d) =>{ return d.objectId === user.objectId; })[0];
		this.userService.pair(usr).then((u) =>{
			if (!u.status) {
				usr.isPaired = true;
			}
			this.rs.stateLoading = false;
		}).catch((err) =>{
			this.rs.stateLoading = false;
			console.log("Error",err);
		});
	}

	bump(user) {
		this.rs.stateLoading = true;
		var usr = this.filter('filter')(this.users, (d) =>{ return d.objectId === user.objectId; })[0];
		this.userService.bump(usr).then((u) =>{
			usr.isPaired = true;
			this.rs.stateLoading = false;
		}).catch((err) =>{
			this.rs.stateLoading = false;
			console.log("Error",err);
		});
	}

	confirm(){

	}
}

export default AdminCtrl;