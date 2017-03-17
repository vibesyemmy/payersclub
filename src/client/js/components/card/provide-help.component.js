/*jshint esversion: 6 */

class PHCtrl {
	constructor(Pair){
		'ngInject';
		this.plan;
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
}

let PH = {
	bindings : {
		user: '=',
		type: '=',
		txid: '=',
		plan: '='
	},
	controller: PHCtrl,
	templateUrl: 'components/card/card.html'
}
export default PH;