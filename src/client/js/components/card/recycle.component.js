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
    console.log("Recycler", this.b, this.d);
    if (!this.b && this.d.length == 0) {
      return "Your account is being matched with another member. Please wait.";
    }
  }
}

let Recycle = {
	bindings:{
		type: '=',
    b: '=',
    d: '='
	},
	controller: RecycleCTRL,
	templateUrl : 'components/card/recycle.html'
}

export default Recycle; 