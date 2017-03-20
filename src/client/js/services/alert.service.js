class AlertService {
	constructor($http, AppConstants){
		'ngInject';

		this.http = $http;
		this._AppConstants = AppConstants;
	}

	boxConfirm(box) {
		return this.http({
			method: 'POST',
			url: '/socket/box/confirm',
			data: {
				box: box
			}
		}).then((res) =>{
			return res.data;
		}).catch((err) =>{
			return err;
		});
	}
}

export default AlertService;