import angular from 'angular';

let componentsModule = angular.module('app.components', []);

import ShowAuthed from './show-authed.directive';
componentsModule.directive('showAuthed', ShowAuthed);

import ListErrors from './list-errors.component'
componentsModule.component('listErrors', ListErrors);

import Home from './home/home.component';
componentsModule.component('homeComp', Home);

import Override from './overide.directive';
componentsModule.directive('override', Override);

import Header from './header.directive';
componentsModule.directive('headerSlide', Header);

export default componentsModule;