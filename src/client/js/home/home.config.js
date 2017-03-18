function HomeConfig($stateProvider) {
  'ngInject';

  $stateProvider
  .state('app.home', {
    url: '/',
    controller: 'HomeCtrl',
    controllerAs: '$ctrl',
    templateUrl: 'home/home.html',
    title: 'Home',
  })
  .state('app.dash', {
    url: '/dashboard',
    controller: 'DashCtrl',
    controllerAs: '$ctrl',
    templateUrl: 'home/dashboard.html',
    title: 'Dashboard',
    resolve: {
      donor: (Box, User) => {
        return Box.getBenex(User.current.objectId).then((val) =>{
          return val;
        });
      },
      benex: (Box, User) => {
        return Box.getDonors(User.current.objectId).then((val) =>{
          return val;
        });
      }
    }
  }).state('app.faq',{
    url: '/faq',
    templateUrl: 'home/faq.html'
  }).state('app.change',{
    url: '/change',
    controller: 'ChangePlan',
    controllerAs: '$ctrl',
    templateUrl: 'components/modal/modal.html'
  });

};
export default HomeConfig;
