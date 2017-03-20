/*jshint esversion: 6 */

class DashNavCtrl {
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

let DashNav = {
  controller: DashNavCtrl,
  templateUrl: 'components/dashnav/dashnav.html'
};

export default DashNav;