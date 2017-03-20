/*jshint esversion: 6 */
class TxCTRL {
	constructor(User, Box) {
		'ngInject';
		this.user = User.current;
		this.txs = [];
		this.box = Box;
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

	setStatus(status) {
		var status;
		if (status == 0) {
			status = "Awaiting donation";
		} else if (status == 1) {
			status = "Awaiting confirmation";
		} else if (status == 2) {
			status = "Confirmed";
		} else {
			status = "Declined";
		}
		 return status;
	}

	getName(tx) {
		if (tx.donor.objectId === this.user.objectId) {
			return tx.beneficiary.bkaccount_name;
		} else {
			return tx.donor.bkaccount_name;
		}
	}
}

let TxHistory = {
	controller: TxCTRL,
	templateUrl : 'components/card/tx.history.html',
	bindings : {
		history: '='
	}
}

export default TxHistory;