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

import File from './file.directive';
componentsModule.directive('file', File);

import Header from './header.directive';
componentsModule.directive('headerSlide', Header);

import SideBar from './sidebar/sidebar.component';
componentsModule.component('sideBar', SideBar);

import PH from './card/provide-help.component';
componentsModule.component('provideHelpCard', PH);

import GH from './card/get-help.component';
componentsModule.component('getHelpCard', GH);

import Recycle from './card/recycle.component';
componentsModule.component('recycleCard', Recycle);

import Wysiwyg from './wysiwyg5/wysiwyg.directive.js';
componentsModule.directive('richTextEditor', Wysiwyg);

import Portlet from './portlet.directive.js';
componentsModule.directive('pgPortlet', Portlet);

import DashNav from './dashnav/dashnav.component.js';
componentsModule.component('dashNav', DashNav);

import TxHistory from './card/tx.component.js';
componentsModule.component('txHistory', TxHistory);

import Logout from './logout.component.js';
componentsModule.component('logout', Logout);

import Hambuger from './hambuger.directive';
componentsModule.directive('hambuger', Hambuger);

export default componentsModule;