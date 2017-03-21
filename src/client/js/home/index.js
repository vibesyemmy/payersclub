import angular from 'angular';

// Create the module where our functionality can attach to
let homeModule = angular.module('app.home', []);

// Include our UI-Router config settings
import HomeConfig from './home.config';
homeModule.config(HomeConfig);


// Controllers
import HomeCtrl from './home.controller';
homeModule.controller('HomeCtrl', HomeCtrl);

import DashCtrl from './dashboard.controller';
homeModule.controller('DashCtrl', DashCtrl);

import ProfileCtrl from './profile.controller';
homeModule.controller('ProfileCtrl', ProfileCtrl);

import ChangePlan from './change.controller';
homeModule.controller('ChangePlan', ChangePlan);


export default homeModule;
