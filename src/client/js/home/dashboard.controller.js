/*jshint esversion: 6 */
class DashCtrl{
	constructor(benex, donors, history, $scope, SocketIO, UploadService, toaster, $state, Alert, User, $interval, Box, $uibModal, $document){
		'ngInject';

		this.benex      = benex;
		this.donors 		= donors;
		this.user				= User.current;
		this._$scope 		= $scope;
		this.up 				= UploadService;
		this.io 				= SocketIO;
		this.news 			= [];
		this.toastr 		= toaster;
		this.state 			= $state;
		this.a 					= Alert;
		this.alert 			= {};
		this.alert.show	= false;
		this.history 		= history;
		this.i 					= $interval;
		this.box 				= Box;
		this.init();
		this.count 			= 0;
		this.uibModal		= $uibModal;

		// console.log(this.benex, this.donor);

		// $interval(this.refresh(), 20000);

		if (this.user.plan === '-1') {
			this.state.go('dash.change');
		}

	}

	refresh() {
		// this.box.getDonors(this.user.objectId).then((val) =>{
		// 	this.donors = val;
		// 	return this.box.getBenex(this.user.objectId);
		// }).then((val) =>{
		// 	this.benex = val;
		// 	return this.box.getHistory();
		// }).then((val) =>{
		// 	this.history = val;
		// 	console.log(val);
		// });
		console.log(this.count);
		if (this.count > 0) {
			this.state.reload();	
		}
		this.count++;
	}

	closeAlert() {
		this.state.reload();
	}

	setPlan(p) {
		var ppp;
		if (p === "1") {
			ppp =  "10,000";
		} else if (p === "2") {
			ppp =  "20,000";
		} else if (p === "3") {
			ppp =  "50,000";
		} else if (p === "4") {
			ppp =  "100,000";
		}
		return ppp;
	}

	init() {
		let u = {
			id: this.user.objectId,
			username: this.user.username,
			plan: this.user.plan
		};

		console.log(u);

		this.io.on('connect', (s)=> {
			this.io.emit('new_user', u);

			this.io.on('global_reset', () =>{
				this.box.getDonors(this.user.objectId).then((val) =>{
					this.donors = val;
					return this.box.getBenex(this.user.objectId);
				}).then((val) =>{
					this.benex = val;
					return this.box.getHistory();
				}).then((val) =>{
					this.history = val;
				});
			});

			this.io.on('incoming_news', (news) =>{
				if (this.news.length == 4) {
					this.news.splice(0, 1);
				}
				this.news.push(news);
			});
			this.io.on('incoming_merge_alert', (alert) =>{
				if (alert.to === this.user.objectId || alert.from === this.user.objectId) {
					this.alert.type = "warning";
					this.alert.msg 	= "You have an incoming transaction. Close this message to refresh you page";
					this.alert.show	= true;
				}
			});
			this.io.on('incoming_tx_confirm', (confirm) =>{

				// Be smarter!!!!!!!
				// Get the transaction id and perform an update on local instance of box 
				// IN THE BOX SERVICE

				if (confirm.fromUserId == this.user.objectId) {
					this.alert.type = "success";
					this.alert.msg 	= "Your transaction has been confirmed.";
					this.alert.show	= true;
				}

			});
		});

		this.io.on('disconnect', ()=>{
			this.io.emit('bye', u);
		});
	}
}

export default DashCtrl;