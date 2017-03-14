/*jshint esversion: 6 */
class Pair {
	
	constructor($q, $http, User, AppConstants) {
		'ngInject';

		this._$q = $q;
		this._$http = $http;
		this._user = User.current;
    this._AppConstants = AppConstants;
    this.ph = null;
    this.gh = null;
	}

	getStarter(){

	}

	getBasic(){

	}

	getUltima(){

	}

	getVIP(){
		
	}

	getHelp() {
		var h = [];
		return this._$http({
			method:'GET',
			url: this._AppConstants.api +"/classes/Pairing",
      headers:this.header(),
      params:{
      	'where': {
      		to: this.u(),
      		eligible: true
      	},
      	include:['p1', 'p2', 'p3', 'p4', 'to'],
      	order:'-createdAt',
      	limit: 1
      }
		}).then((res) =>{
			this.gh = res.data.results[0];
			return res.data.results[0];
		}).catch((err) =>{
			return err;
		});
	}

	provideHelp(){
		var ph = {};
		return this._$http({
			method:'GET',
			url: this._AppConstants.api +"/classes/Pairing",
      headers:this.header(),
      params: {
      	where: {
      		"$or":[{"p1":this.u()}, {"p2": this.u()}, {"p3":this.u()}, {"p4":this.u()}],
      		"plan": this._user.plan
      	},
      	include:['to'],
      	order:'-createdAt',
      	limit: 1
      }
		}).then((res) =>{
			this.ph = res.data.results[0]; 
			return res.data.results[0];
		}).catch((err) =>{
			return err;
		});
	}

	user(id){
		return this._$http({
			method: 'GET',
			url: this._AppConstants.api +"/classes/_User/"+id,
			headers:this.header()
		}).then((res) =>{
			return res.data;
		}).catch((err) =>{
			return err;
		});
	}

	header (){
		return {'X-Parse-Application-Id': this._AppConstants.appId};
	}

	u(){
		return {
			"__type": "Pointer",
      "className": "_User",
      "objectId": this._user.objectId
		};
	}

}

export default Pair;