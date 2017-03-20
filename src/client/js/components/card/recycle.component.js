/*jshint esversion: 6 */

class RecycleCTRL {
	constructor(User, $rootScope) {
		'ngInject';
		this.user = User.current;
    this.rs = $rootScope;
    if (this.rs.has_benex) {
      this.type = 1;
    } else if (this.rs.has_donors) {
      this.type = 2;
    } else {
      this.type = 0;
    }
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

  getMessage() {
    if (this.type == 1) {
      return "Your account has been matched to donate."
    } else if (this.type == 2) {
      return "Your account has been matched to receive."
    } else if (this.type == 0) {
      return "Your account is being matched with another member. Please wait.";
    }
  }
}

let Recycle = {
	bindings:{
		type: '='
	},
	controller: RecycleCTRL,
	templateUrl : 'components/card/recycle.html'
}

export default Recycle; 