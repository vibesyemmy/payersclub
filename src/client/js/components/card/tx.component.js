/*jshint esversion: 6 */
let TxHistory = {
	controller: TxCTRL,
	templateUrl : 'components/card/tx.history.html'
}

class TxCTRL {
	constructor(User) {
		'ngInject';
		this.user = User.current;
		this.txs = [];
	}
}

export default TxHistory;