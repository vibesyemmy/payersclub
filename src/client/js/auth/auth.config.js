/**
 * 
 * 
 * @param {any} $stateProvider
 * @param {any} $httpProvider
 */
function AuthConfig($stateProvider, $httpProvider) {
  'ngInject';

  $stateProvider

  .state('app.login', {
    url: '/login',
    controller: 'AuthCtrl as $ctrl',
    templateUrl: 'auth/auth.html',
    title: 'Sign in',
    resolve: {
      /**
       * 
       * 
       * @param {any} User
       * @returns
       */
      auth: function(User) {
        return User.ensureAuthIs(false);
      }
    }
  })

  .state('app.register', {
    url: '/register',
    controller: 'AuthCtrl as $ctrl',
    templateUrl: 'auth/auth.html',
    title: 'Sign up',
    resolve: {
      /**
       * 
       * 
       * @param {any} User
       * @returns
       */
      auth: function(User) {
        return User.ensureAuthIs(false);
      }
    }
  });

};

export default AuthConfig;
