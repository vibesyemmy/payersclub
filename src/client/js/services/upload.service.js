class UploadService {
	constructor($http, $q) {
		'ngInject';
		this._$http = $http;
		this._$q = $q;
	}

	init(file){
		return this._$http.post(this._AppConstants.api +"/files/"+file.name,file,{headers:{'X-Parse-Application-Id': this._AppConstants.appId,'Content-Type': file.type}}).then((res) =>{
			return res.data;
		}).catch((err) =>{
			return err.data;
		});
	}
}

export default UploadService;