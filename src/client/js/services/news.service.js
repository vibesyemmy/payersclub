/*jshint esversion: 6 */
class News {
	constructor($q, $http, AppConstants){
		"ngInject";
		this._$q = $q;
		this._$http = $http;
    this._AppConstants = AppConstants;
	}

	getNews() {
		return this._$http({}).then((res) =>{
			method: "GET",
			url: this._AppConstants.api +"/classes/News",
			headers:this.header()
		}).then((res) =>{
			return res.data.results;
		}).catch((err) =>{
			return err;
		});
	}
}