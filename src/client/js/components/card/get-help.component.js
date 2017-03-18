/*jshint esversion: 6 */

class GHCtrl {
	constructor($rootScope, UploadService, Box){
		'ngInject';
		this.rs = $rootScope;
		this.up = UploadService;
		this.boxService = Box;

		console.log(this.box);
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
		this.boxService.confirmTx(this.box.objectId).then((res) =>{
			this.box.confirmation_status = 2;
		});
	}

	purge(){

	}
}

let GH = {
	bindings : {
		box: '=',
		type: '=',
	},
	controller: GHCtrl,
	templateUrl: 'components/card/card.html'
}
export default GH;