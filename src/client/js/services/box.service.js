/*jshint esversion: 6 */
class BoxService {
	constructor($q, $http, AppConstants, User) {
		"ngInject";

		this._$q = $q;
		this._$http = $http;
    this._AppConstants = AppConstants;
    this.user = User.current;
	}

	getHistory(){
		return this._$http({
			method: 'GET',
			url: this._AppConstants.api +"/classes/Box",
			headers:this.header(),
			params:{
				"where" :{
					"$or" : [
						{"donor": this.u(this.user.objectId)},
						{"beneficiary":this.u(this.user.objectId)}
					]
				},
				limit: 5,
				include: ["beneficiary", "donor"]
			}
		}).then((res) =>{
			return res.data.results;
		}).catch((err) =>{
			return err;
		});
	}

	getDonors(bId) {
		return this._$http({
			method: "GET",
			url: this._AppConstants.api +"/classes/Box",
			headers:this.header(),
			params: {
				"where": {
					"beneficiary" : this.u(bId),
					"confirmation_status" : {
						"$lt": 2
					}
				},
				include: ["beneficiary", "donor"],
				limit:2
			}
		}).then((res) =>{
			this.benex = res.data.results;
			return this.benex;
		}).catch((err) =>{
			return err;
		});
	}

	getBenex(dId) {
		return this._$http({
			method: "GET",
			url: this._AppConstants.api +"/classes/Box",
			headers:this.header(),
			params: {
				"where": {
					"donor" : this.u(dId),
					"confirmation_status" : {
						"$lt": 2
					}
				},
				include: ["beneficiary", "donor"],
				limit:1
			}
		}).then((res) =>{
			console.log(res.data.results[0]);
			this.donors = res.data.results[0];
			return this.donors;
		}).catch((err) =>{
			return err;
		});
	}

	updatePop(id, file) {
		return this._$http({
			method: 'PUT',
			url: this._AppConstants.api +"/classes/Box/"+id,
			headers:this.header(),
			data: {
				"confirmation_status": 1,
				"timer_status": 1
			}
		}).then((res) =>{
			return res.data;
		}).catch((err) =>{
			return err;
		});
	}

	confirmTx(id) {
		var plan;
		return this._$http({
			method: 'PUT',
			url: this._AppConstants.api +"/classes/Box/"+id,
			headers:this.header(),
			data: {
				"confirmation_status": 2
			}
		}).then((res) =>{
			return this.user(this.user.objectId);
		}).then((user) =>{
			plan = this.user.plan;
			var u = user.data;
			if (u.benefit_count == 4) {
				console.log
				plan = "-1";
			}
			return this.updatePlan(u.objectId, plan);
		}).then((res) =>{
			this.user.plan = plan;
			return res.data;
		}).catch((err) =>{
			return err;
		});
	}

	updatePlan(uid, plan){
		var p = {
			plan: plan,
			benefit_count:0,
			can_benefit: false,
			can_recycle: false,
			in_box: false,
			in_box_count: 0
		}
		return this._$http({
			method: 'PUT',
			url: this._AppConstants.api + '/classes/_User/'+uid,
			headers:this.header(),
			data: p
		}).then((res) =>{
			return this.getUser(uid);
		}).then((res) => {
			this.user = res.data;
			return this.user;
		}).catch((err) =>{
			return err;
		});
	}


	getBox(id) {
		return this._$http({
			method: 'GET',
			url: this._AppConstants.api +"/classes/Box/"+id,
			headers:this.header()
		}).then((res) =>{
			return res.data;
		}).catch((err) =>{
			return err; 
		})
	}

	decline(id) {
		return this._$http({
			method: 'POST',
			url: this._AppConstants.api +"/functions/decline",
			headers:this.header(),
			data: {
				boxId: id
			}
		}).then((res) =>{
			return res.data;
		}).catch((err) =>{
			return err;
		})
	}

	header (){
		return {"X-Parse-Application-Id": this._AppConstants.appId};
	}

	u(id){
		return {
			"__type": "Pointer",
      "className": "_User",
      "objectId": id
		};
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

	getUser(id){
		return this._$http({
			method: 'GET',
			url: this._AppConstants.api +"/classes/_User/"+id,
			headers:this.header()
		}).then((res) =>{
			return res;
		}).catch((err) =>{
			return err;
		});
	}
}

export default BoxService;