/*jshint esversion: 6 */
class Referral {
	constructor($window, $q, $state) {
		'ngInject';

		this._$window = $window;
    this._$state = $state;
    this._$q = $q;
	}

	save(ref) {
		let deferred = this._$q.defer();
    this._$window.localStorage[this._AppConstants.ref] = ref;
    this._$state.go('app.register');
    deferred.resolve(true);
    return deferred.promise;
  }

  get() {
    return this._$window.localStorage[this._AppConstants.ref];
  }

  destroy() {
    this._$window.localStorage.removeItem(this._AppConstants.ref);
  }
}

export default Referral;