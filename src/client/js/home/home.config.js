function HomeConfig($stateProvider) {
  'ngInject';

  $stateProvider
  .state('app.home', {
    url: '/',
    controller: 'HomeCtrl',
    controllerAs: '$ctrl',
    templateUrl: 'home/home.html',
    title: 'Home'
  }).state('app.faq',{
    url: '/faq',
    templateUrl: 'home/faq.html'
  });

};
export default HomeConfig;
