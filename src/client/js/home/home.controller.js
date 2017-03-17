class HomeCtrl {
  constructor(Pair, User, AppConstants, $scope, $state, SocketIO) {
    'ngInject';

    this.appName = AppConstants.appName;
    this._$scope = $scope;

    // Set current list to either feed or all, depending on auth status.
    this.listConfig = {
      type: User.current ? 'feed' : 'all'
    };

    if (User.current.role == 0) {
      $state.go('app.dash');
    }

    

  }

  changeList(newList) {
    this._$scope.$broadcast('setListTo', newList);
  }


}

export default HomeCtrl;
