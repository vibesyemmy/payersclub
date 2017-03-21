class LogoutCtrl {
	constructor(User) {
		'ngInject';
		this.user = User;
	}

	logout() {
		this.user.logout.bind(this.user.current);
	}
}

let Logout = {
	controller: LogoutCtrl,
	template : '<a ng-click="$ctrl.logout()">Logout</a>'
}

export default Logout;