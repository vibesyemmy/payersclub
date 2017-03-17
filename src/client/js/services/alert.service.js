class AlertService {
	constructor($http, AppConstants){
		'ngInject';

		this.http = $http;
		this._AppConstants = AppConstants;
	}

	updatePair(txId, fromUserId, toUserId, pos) {
		return this.http({
			method: 'POST',
			url: this._AppConstants.api + '/functions/updatePair',
      headers:{
        'X-Parse-Application-Id': this._AppConstants.appId
      },
      data: {
      	pos: pos,
      	toUserId: toUserId,
      	fromUserId: fromUserId,
      	txId: txId
      }
		}).then((res) =>{
			return res.data;
		}).catch((err) =>{
			return err;
		})
	}

	alertMerge(toId, fromId) {
		return this.http({
			method: 'POST',
			url: '/socket/merge',
			data: {
				to: toId,
				from: fromId
			}
		}).then((res) =>{
			return res.data;
		}).catch((err) =>{
			return err;
		})
	}

	createConfirmation(toUserId, fromUserId, file, txId) {
		// console.log(file);
		return this.http({
			method: 'POST',
			url: this._AppConstants.api + '/classes/Confirmation',
      headers:{
        'X-Parse-Application-Id': this._AppConstants.appId
      },
      data: {
      	pop: file,
      	toUser: this.getUser(toUserId),
      	fromUser: this.getUser(fromUserId),
      	txId: txId
      }
		}).then((res) =>{
			return res.data;
		}).catch((err) =>{
			return err;
		});
	}

	confirmTx(toUserId, fromUserId, txId) {
		return this.http({
			method: 'POST',
			url: this._AppConstants.api + '/functions/confirmation',
      headers:{
        'X-Parse-Application-Id': this._AppConstants.appId
      },
      data: {
      	confirm: true,
      	toUserId: toUserId,
      	fromUserId: fromUserId,
      	txId: txId
      }
		}).then((res) =>{
			return this.http({
				method: 'POST',
				url: '/socket/confirm',
				data: {
					toUserId: toUserId,
					fromUserId: fromUserId,
					txId: txId,
					confirm: true
				}
			});
		}).then((res) =>{
			return res.data;
		}).catch((err) =>{
			return err;
		});
	}

	getUser(id) {
		return {
			"__type": "Pointer",
      "className": "_User",
      "objectId": id
		};
	}
}

export default AlertService;