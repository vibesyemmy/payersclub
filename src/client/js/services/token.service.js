class Token {
  constructor(AppConstants, $window) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$window = $window;
  }

  save(token) {
    this._$window.localStorage[this._AppConstants.sessionToken] = token;
  }

  saveAwaitingPH(bool) {
    this._$window.localStorage['awaitingPh'] = 1;
  }

  getAwaitingPH() {
    return this._$window.localStorage['awaitingPh'] == 1 ? true : false; 
  }

  get() {
    return this._$window.localStorage[this._AppConstants.sessionToken];
  }

  destroy() {
    this._$window.localStorage.removeItem(this._AppConstants.sessionToken);
  }

}

export default Token;
