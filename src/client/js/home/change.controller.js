class Change {
	constructor(User, $state){
		'ngInject';
		this.u = User;
		this._$state = $state;
	}

	submit() {
		this.u.update(this.formData).then((u) =>{
			// this._$state.go('dash.main');
			window.location = "/";
		});
	}
}

export default Change;