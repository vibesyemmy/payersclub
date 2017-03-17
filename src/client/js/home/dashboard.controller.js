/*jshint esversion: 6 */
class DashCtrl{
	constructor(ph, gh, user, $scope, SocketIO, UploadService, toaster, $state, Alert){
		'ngInject';

		this.ph 			= ph;
		this.pair 		= gh;
		this.user			= user;
		this._$scope 	= $scope;
		this.up 			= UploadService;
		this.io 			= SocketIO;
		this.news 		= [];
		this.toastr 	= toaster;
		this.state 		= $state;
		this.a = Alert;
		this.alert 		= {};
		this.alert.show	= false;
		this.init();

		console.log(this.ph, this.pair);


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
			username: this.user.username
		};

		this.io.on('connect', (s)=> {
			this.io.emit('new_user', u);

			this.io.on('global_reset', () =>{
				window.location = "/";
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
					console.log(alert);
				}
			});
			this.io.on('incoming_tx_confirm', (confirm) =>{
				if (confirm.fromUserId == this.user.objectId) {
					this.alert.type = "success";
					this.alert.msg 	= "Your transaction has been confirmed.";
					this.alert.show	= true;
				}

				console.log(confirm);

				var pos;

				var to1 = this.pair.p1;
				var to2 = this.pair.p2;
				var to3 = this.pair.p3;
				var to4 = this.pair.p4;

				if (to1 && to1.objectId === confirm.fromUserId) {
					this.pair.confirmedP1 = true;
					pos = 1;
				}

				if (to2 && to2.objectId === confirm.fromUserId) {
					this.pair.confirmedP2 = true;
					pos = 2;
				}

				if (to3 && to3.objectId === confirm.fromUserId) {
					this.pair.confirmedP3 = true;
					pos = 3;
				}
				if (to4 && to4.objectId === confirm.fromUserId) {
					this.pair.confirmedP4 = true;
					pos = 4;
				}
				this.a.updatePair(confirm.txId, confirm.fromUserId, confirm.toUserId, pos).then((res) =>{
					window.location = "/";
				});

			});
		});

		this.io.on('disconnect', ()=>{
			this.io.emit('bye', u);
		});
	}
}

export default DashCtrl;