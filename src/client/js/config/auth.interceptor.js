function authInterceptor(Token, AppConstants, $window, $q) {
  'ngInject'

  return {
    // automatically attach Authorization header
    request: function(config) {
      if(config.url.indexOf(AppConstants.api) === 0 && Token.get()) {
        config.headers["X-Parse-Session-Token"] = Token.get();
      }
      return config;
    },

    // Handle 401
    responseError: function(rejection) {
      if (rejection.status === 401) {
        // clear any Token token being stored
        Token.destroy();
        // do a hard page refresh
        $window.location.reload();
      }
      return $q.reject(rejection);
    }

  }
}
export default authInterceptor;