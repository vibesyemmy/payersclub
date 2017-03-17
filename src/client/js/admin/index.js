import angular from 'angular';

// Create the module where our functionality can attach to
let adminModule = angular.module('app.admin', []);

// Include our UI-Router config settings
import AdminConfig from './admin.config';
adminModule.config(AdminConfig);


// Controllers
import AdminCtrl from './admin.controller';
adminModule.controller('AdminCtrl', AdminCtrl);

import AdminUserCtrl from './admin.user.controller';
adminModule.controller('AdminUserCtrl', AdminUserCtrl);

import Pairs from './admin.pair.controller';
adminModule.controller('AdminPairsCtrl', Pairs.pairs);

import Pair from './admin.pair.controller';
adminModule.controller('AdminPairCtrl', Pair.pair);


export default adminModule;
