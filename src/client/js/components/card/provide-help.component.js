/*jshint esversion: 6 */

class PHCtrl {
	constructor(Pair, Alert, $rootScope, UploadService, User, Token){
		'ngInject';
		this.plan;
		this.alert = Alert;
		this.pair  = Pair;
		this.rs = $rootScope;
		this.up = UploadService;
		this.current = User.current;
		this.token = Token;
		this.awaiting = Token.getAwaitingPH();

		console.log(this.awaiting);
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

	// ph(user){
	// 	this.alert.createConfirmation(user.objectId).then((res) =>{
	// 		console.log(res);
	// 	});
	// }

	upload(){
		// return this.myFile;
		// console.log(this.myFile);
		var file = this.myFile;
		this.rs.stateLoading = true;
		this.up.init(file).then((file) =>{
			var f = {
        "__type" : "File",
        "name"   : file.name,
        "url"    : file.url
      };
      return this.alert.createConfirmation(this.user.objectId, this.current.objectId, f, this.txid);
		}).then((res) =>{
			this.awaiting = true;
			this.token.saveAwaitingPH(true);
			this.rs.stateLoading = false;
		});
	}
}

let PH = {
	bindings : {
		user: '=',
		type: '=',
		txid: '=',
		plan: '=',
		file: '&'
	},
	controller: PHCtrl,
	templateUrl: 'components/card/card.html'
}
export default PH;