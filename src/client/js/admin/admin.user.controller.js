class AdminUserCtrl {

	constructor(user, ph, gh, User, $scope, $rootScope, SocketIO) {
		'ngInject';

		this.user = user;
		this.userService = User;
		this.scope = $scope;
		this.rs = $rootScope;
		this.io = SocketIO;
		this.ph = ph;
		this.gh = gh;

		console.log(this.ph, this.gh);
	}

	plan(p) {
		var ppp;
		if (p === "1") {
			ppp =  "10,000";
		} else if (p === "2") {
			ppp =  "20,000";
		} else if (p === "3") {
			ppp =  "50,000";
		} else if (p === "4") {
			ppp =  "100,000";
		}
		return ppp;
	}
	
}

export default AdminUserCtrl;