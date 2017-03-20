/*jshint esversion: 6 */
function AppRun(AppConstants, $rootScope, Token, User, $state, $window) {
  'ngInject';


  // Helper method for setting the page's title
  $rootScope.setPageTitle = (title) => {
    $rootScope.pageTitle = '';
    if (title) {
      $rootScope.pageTitle += title;
      $rootScope.pageTitle += ' \u2014 ';
    }
    $rootScope.pageTitle += AppConstants.appName;
  };

  $rootScope.getStyle = (style) => {
    $rootScope.style = '/vendor.min.css';
    if (style) {
      $rootScope.style = style;
    }
  }

  $rootScope.goBack = () => {
    $window.history.back();
  };

  $rootScope.logout = ()=> {
    User.logout.bind(User);
  }

  $rootScope.$on('$stateChangeStart', function(e, toState  , toParams, fromState, fromParams) {
      $rootScope.stateLoading = true;
      var isLogin     = toState.name === "app.login";
      var isRegister  = toState.name === "app.register";
      var isHome      = toState.name === "app.home";
      var isFAQ       = toState.name === "app.faq";
      var is404       = toState.name === "app.404";
      var dash        = toState.name === "dash";
      var dashMain    = toState.name === "dash.main";

      if (isLogin || isRegister || isHome || isFAQ || is404) {
        $rootScope.theme = 'site';
        return;
      }

      if (!Token.get() || !User.current) {
        e.preventDefault();
        $state.go('app.login');
      }

      if (dash || dashMain) {
        $rootScope.theme = 'dash';
      } else {
        $rootScope.theme = 'site';
      }
  });

  // change page title based on state
  $rootScope.$on('$stateChangeSuccess', (event, toState) => {
    $rootScope.setPageTitle(toState.title);
    $rootScope.stateLoading = false;
    $rootScope.getStyle(toState.style);
  });
}

export default AppRun;