import angular from 'angular';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []);

import TokenService from './token.service'
servicesModule.service('Token', TokenService);

// import CoinbaseService from './coinbase.service';
// servicesModule.service('Coinbase', CoinbaseService);

import UserService from './user.service';
servicesModule.service('User', UserService);

export default servicesModule;