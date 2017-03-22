/*jshint esversion: 6 */

class PHCtrl {
	constructor($rootScope, UploadService, Box, User, Alert){
		'ngInject';
		this.rs = $rootScope;
		this.up = UploadService;
		this.boxService = Box;
		this.user = User.current;
		this.a = Alert;

		this.rs.has_donors = false;
		this.rs.has_benex = true;
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

	upload(){
		var file = this.myFile;
		this.rs.stateLoading = true;
		this.up.init(file).then((file) =>{
			var f = {
        "__type" : "File",
        "name"   : file.name,
        "url"    : file.url
      };
      return this.boxService.updatePop(this.box.objectId, f);
		}).then((res) =>{
			this.box.confirmation_status = 1;
			this.rs.stateLoading = false;
			let b = {
				boxId: this.box.objectId,
				benexId: this.box.beneficiary.objectId,
				donorId: this.donor.objectId,
				status: 1
			}
			this.a.boxConfirm(b).then((res) =>{

			});
		});
	}

	decline() {
		this.boxService.decline(this.box.objectId).then((res) =>{
			this.user.plan = "-1";
			window.location = "/";
		});
	}
}

let PH = {
	bindings : {
		box: '=',
		type: '=',
		file: '&'
	},
	controller: PHCtrl,
	templateUrl: 'components/card/card.html'
}
export default PH;