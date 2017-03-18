class Change {
	constructor(User){
		'ngInject';
		this.u = User;
	}

	submit() {
		this.u.update(this.formData).then((u) =>{
			this._$state.go('app.home')
		});
	}
}

export default change;