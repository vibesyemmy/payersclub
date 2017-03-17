/*jshint esversion: 6 */

class GHCtrl {
	constructor(Pair, Alert, $rootScope, UploadService, User, Token){
		'ngInject';
		this.plan;
		this.alert = Alert;
		this.pair  = Pair;
		this.rs = $rootScope;
		this.up = UploadService;
		this.current = User.current;
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

	confirm(){
		// console.log(this.current.objectId, this.user.objectId, this.txid);
		this.alert.confirmTx(this.current.objectId, this.user.objectId, this.txid).then((res) =>{
			console.log(res);
			window.location = "/";
		});
	}

	purge(){

	}
}

let GH = {
	bindings : {
		user: '=',
		type: '=',
		txid: '=',
		position: '=',
		plan: '='
	},
	controller: GHCtrl,
	templateUrl: 'components/card/card.html'
}
export default GH;