/*jshint esversion: 6 */
class DashCtrl{
	constructor(ph, gh, user, $scope, SocketIO){
		'ngInject';

		this.ph 			= ph;
		this.pair 		= gh;
		this.user			= user;
		this._$scope 	= $scope;

		// console.log("Provide Help", this.ph);
		// console.log("Get Help", this.pair);
	}
}

export default DashCtrl;