class User {
  constructor(Token, AppConstants, $http, $state, $q) {
    'ngInject';

    this._Token = Token;
    this._AppConstants = AppConstants;
    this._$http = $http;
    this._$state = $state;
    this._$q = $q;

    this.current = null;

  }


  attemptAuth(type, credentials) {
    if (type ==='login') {
      
      return this._$http({
        url: this._AppConstants.api +"/login?username="+credentials.username+"&password="+credentials.password,
        method: 'GET',
        headers:{
          'X-Parse-Application-Id': this._AppConstants.appId
        }
      }).then((res) =>{
        this._Token.save(res.data.sessionToken);
        this.current = res.data
        return res;
      });

    } else {
      return this._$http({
        url: this._AppConstants.api+"/users",
        method: 'POST',
        headers:{
          'X-Parse-Application-Id': this._AppConstants.appId
        },
        data: credentials
      }).then((res) =>{
        return this.saveUser(res);
      }).then((res) =>{
        this._Token.save(res.data.sessionToken);
        this.current = res.data
        return res;
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  saveUser(res){
    return this._$http({
      url: this._AppConstants.api +"/users/me?include=profile",
      method: 'GET',
      headers:{
        'X-Parse-Application-Id': this._AppConstants.appId,
        'X-Parse-Session-Token': res.data.sessionToken
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  update(fields) {
    return this._$http({
      url:  this._AppConstants.api + '/user',
      method: 'PUT',
      data: { user: fields }
    }).then(
      (res) => {
        this.current = res.data;
        return res.data;
      }
    )
  }

  logout() {
    this.current = null;
    this._Token.destroy();
    this._$state.go(this._$state.$current, null, { reload: true });
  }

  verifyAuth() {
    let deferred = this._$q.defer();

    // check for Token
    if (!this._Token.get()) {
      deferred.resolve(false);
      return deferred.promise;
    }

    if (this.current) {
      deferred.resolve(true);

    } else {
      this._$http({
        url: this._AppConstants.api + '/users/me?include=profile',
        method: 'GET',
        headers: {
          'X-Parse-Application-Id': this._AppConstants.appId,
          'X-Parse-Session-Token': this._Token.get()
        }
      }).then(
        (res) => {
          this.current = res.data;
          deferred.resolve(true);
        },

        (err) => {
          this._Token.destroy();
          deferred.resolve(false);
        }
      )
    }

    return deferred.promise;
  }


  ensureAuthIs(bool) {
    let deferred = this._$q.defer();

    this.verifyAuth().then((authValid) => {
      if (authValid !== bool) {
        this._$state.go('app.home')
        deferred.resolve(false);
      } else {
        deferred.resolve(true);
      }

    });

    return deferred.promise;
  }

}

export default User;
