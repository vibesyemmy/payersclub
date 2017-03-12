/*jshint esversion: 6 */

class AppHeaderCtrl {
  constructor(AppConstants, User, $scope, $state, $rootScope) {
    'ngInject';

    this.appName = AppConstants.appName;
    this.currentUser = User.current;
    this.logout = User.logout.bind(User);

    $scope.$watch('User.current', (newUser)=> {
      this.currentUser = newUser;
    });

    $rootScope.$on('$stateChangeSuccess', (e, toState  , toParams, fromState, fromParams)=>{
      this.isHome      = toState.name !== "app.login" || toState.name !== "app.register";
    });
  }
}

let AppHeader = {
  controller: AppHeaderCtrl,
  templateUrl: 'layout/header.html'
};

export default AppHeader;
