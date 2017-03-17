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

	/*
   * To: Attach donor to user with this id
   * User: Donor
   * Position: Either p1, 2, p3 or p4
   */
  attach(to, user, position) {
    return this._$http({
    	method: 'POST',
    	url: this._AppConstants.api + '/functions/attach',
      headers:{
        'X-Parse-Application-Id': this._AppConstants.appId
      },
      data : {
        to : to,
        uid: user,
        p: position
      }
    }).then((res) =>{
    	return res.data.result;
    }).catch((err) =>{
    	return err;
    })
  }

	getUsersByPlan(plan) {
		return this._$http({
			method: 'GET',
			url: this._AppConstants.api +"/classes/_User",
			headers:this.header(),
			params: {
				'where' :{
					'plan': plan,
					'isPaired': false
				}
			},
			limit: 999,
			order: '-createdAt'
		}).then((res) =>{
			return res.data.results;
		}).catch((err) =>{
			return res.data
		});
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

	usersByPlan(id, plan) {
		var user = this.otherUser(id);
		var users = [];
		let deferred = this._$q.defer();
		return this._$http({
			method:'GET',
			url: this._AppConstants.api +"/classes/Pairing",
      headers:this.header(),
      params: {
      	'where' : {
      		'to': {
      			"$ne": user
      		},
      		'plan': user.plan
      	},
      	include: ['p1', 'p2', 'p3', 'p4', 'to'],
      	order:'-createdAt'
      },
			limit: 999
		}).then((pairs) =>{
			return pairs.data.results;
		}).catch((err) =>{
			return err;
		});
	}

	getGetHelp(user) {
		return this._$http({
			method:'GET',
			url: this._AppConstants.api +"/classes/Pairing",
      headers:this.header(),
      params:{
      	'where': {
      		to: this.otherUser(user.objectId),
      		eligible: true
      	},
      	include:['p1', 'p2', 'p3', 'p4', 'to'],
      	order:'-createdAt',
      	limit: 1
      }
		}).then((res) =>{
			return res.data.results[0];
		}).catch((err) =>{
			return err;
		});
	}

	getProvideHelp(user){
		return this._$http({
			method:'GET',
			url: this._AppConstants.api +"/classes/Pairing",
      headers:this.header(),
      params: {
      	where: {
      		"$or":[{"p1":this.otherUser(user.objectId)}, {"p2": this.otherUser(user.objectId)}, {"p3":this.otherUser(user.objectId)}, {"p4":this.otherUser(user.objectId)}],
      		"plan": user.plan
      	},
      	include:['to'],
      	order:'-createdAt',
      	limit: 1
      }
		}).then((res) =>{
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

	otherUser(id) {
		return {
			"__type": "Pointer",
      "className": "_User",
      "objectId": id
		};
	}

}

export default Pair;