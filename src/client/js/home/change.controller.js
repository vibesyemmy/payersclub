class Change {
	constructor(User, Box, $state){
		'ngInject';
		this.u = User;
		this._$state = $state;
		this.box = Box;
		// console.log(this.u);
	}

	submit(plan) {
		this.box.updatePlan(this.u.current.objectId, plan).then((user) =>{
			this.u.current = user;
			console.log(user);
			window.location = "/";
		});
	}
}

export default Change;