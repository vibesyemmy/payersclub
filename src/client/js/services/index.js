import angular from 'angular';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []);

import TokenService from './token.service'
servicesModule.service('Token', TokenService);

import PairService from './pair.service';
servicesModule.service('Pair', PairService);

import UserService from './user.service';
servicesModule.service('User', UserService);

import Referral from './referral.service';
servicesModule.service('Referral', Referral);

import SocketFactory from './socket-io.service';
servicesModule.factory('SocketIO', ['$rootScope', SocketFactory]);

export default servicesModule;