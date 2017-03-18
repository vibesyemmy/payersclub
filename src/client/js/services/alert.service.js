class AlertService {
	constructor($http, AppConstants){
		'ngInject';

		this.http = $http;
		this._AppConstants = AppConstants;
	}
}

export default AlertService;