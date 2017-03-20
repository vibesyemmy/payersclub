/*jshint esversion: 6 */
class BoxService {
	constructor($q, $http, AppConstants, User) {
		"ngInject";

		this._$q = $q;
		this._$http = $http;
    this._AppConstants = AppConstants;
    this.user = User.current;
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
				"pop": file,
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
		return this._$http({
			method: 'PUT',
			url: this._AppConstants.api +"/classes/Box/"+id,
			headers:this.header(),
			data: {
				"confirmation_status": 2
			}
		}).then((res) =>{
			return res.data;
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
}

export default BoxService;