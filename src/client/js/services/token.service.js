class Token {
  constructor(AppConstants, $window) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$window = $window;
  }

  save(token) {
    this._$window.localStorage[this._AppConstants.sessionToken] = token;
  }

  get() {
    return this._$window.localStorage[this._AppConstants.sessionToken];
  }

  destroy() {
    this._$window.localStorage.removeItem(this._AppConstants.sessionToken);
  }

}

export default Token;
