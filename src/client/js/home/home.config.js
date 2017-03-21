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
  .state('dash', {
    url: '/dashboard',
    controller: 'DashCtrl',
    controllerAs: '$ctrl',
    abstract: true,
    templateUrl: 'home/dash.html',
    title: 'Dashboard',
    style: '/dashboard/style.min.css',
    resolve: {
      donors: (Box, User) => {
        return Box.getDonors(User.current.objectId).then((val) =>{
          return val;
        });
      },
      benex: (Box, User) => {
        return Box.getBenex(User.current.objectId).then((val) =>{
          return val;
        });
      },
      history: (Box) => {
        return Box.getHistory().then((val) =>{
          return val;
        });
      },
      auth: function(User) {
        return User.verifyAuth();
      }
    }
  }).state('dash.main', {
    url: '/main',
    templateUrl: 'home/dash.main.html'
  }).state('dash.user', {
    url: '/user',
    templateUrl: 'home/dash.user.html',
    controller: 'ProfileCtrl as $ctrl'
  }).state('app.faq',{
    url: '/faq',
    templateUrl: 'home/faq.html'
  }).state('dash.change',{
    url: '/change',
    controller: 'ChangePlan',
    controllerAs: '$ctrl',
    templateUrl: 'components/modal/modal.html'
  }).state('app.logout',{
    url: '/logout',
    controller: (User) =>{
      User.logout.bind(User);
    },
    controllerAs: '$ctrl'
  });

};
export default HomeConfig;
