function AdminConfig($stateProvider) {
  'ngInject';

  $stateProvider
  .state('app.admin', {
    url: '/admin',
    abstract: true,
    templateUrl: 'admin/admin.html',
    title: 'Admin',
    resolve: {
      users : (User) =>{
        return User.getUsers();
      },
      auth: (User) => {
        return User.verifyAdmin();
      }
    }
  })
  .state('app.admin.dash', {
    url: '/dashboard',
    controller: 'AdminCtrl',
    controllerAs: '$ctrl',
    templateUrl: 'admin/dashboard.html',
    title: 'Dashboard',
  }).state('app.admin.dash.users',{
    url: '/users',
    templateUrl: 'admin/users.html',
    title: 'Users',
    controller: 'AdminCtrl',
    controllerAs: '$ctrl'
  }).state('app.admin.dash.users.user', {
    url: '/:id',
    templateUrl: 'admin/user.html',
    resolve: {
      user: (users, $stateParams, $filter) =>{
        var user = $filter('filter')(users, (d) =>{ return d.objectId === $stateParams.id; })[0];
        return user;
      },
      ph: (users, $stateParams, $filter, Pair) => {
        var user = $filter('filter')(users, (d) =>{ return d.objectId === $stateParams.id; })[0];
        return Pair.getProvideHelp(user);
      },
      gh: (users, $stateParams, $filter, Pair) => {
        var user = $filter('filter')(users, (d) =>{ return d.objectId === $stateParams.id; })[0];
        return Pair.getGetHelp(user);
      }
    },
    controller: 'AdminUserCtrl as $ctrl'
  }).state('app.admin.dash.pairs',{
    url: '/pairs',
    templateUrl: 'admin/pairs.html',
    title: 'Pair'
  }).state('app.admin.dash.chat',{
    url: '/chat',
    templateUrl: 'admin/chat.html',
    abstract: true,
    title: 'Chat'
  }).state('app.admin.dash.mail',{
    url: '/mail',
    templateUrl: 'admin/mail.html',
    abstract: true,
    title: 'Mail'
  }).state('app.admin.dash.mail.compose', {
    url: '/compose',
    templateUrl: 'admin/mail-compose.html'
  }).state('app.admin.dash.mail.inbox',{
    url: '/inbox',
    templateUrl: 'admin/mail-list.html'
  })
  .state('app.admin.dash.mail.inbox.message',{
    url: '/:id',
    templateUrl: 'admin/mail-item.html'
  });

};
export default AdminConfig;
