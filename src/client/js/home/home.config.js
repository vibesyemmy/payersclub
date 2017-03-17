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
      ph: function(Pair) {
        return Pair.provideHelp().then((val) =>{
          return val;
        });
      },
      gh: function(Pair) {
        return Pair.getHelp().then((val) =>{
          return val;
        });
      },
      user: function(User){
        return User.current;
      }
    }
  }).state('app.faq',{
    url: '/faq',
    templateUrl: 'home/faq.html'
  });

};
export default HomeConfig;
