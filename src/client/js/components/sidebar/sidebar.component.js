/*jshint esversion: 6 */
class SideBarCtrl {
	contructor(AppConstants){
		'ngInject';

		this.appName = AppConstants.appName;
	}
}

let SideBar = {
	controller: SideBarCtrl,
	templateUrl: 'components/sidebar/sidebar.html'
}

export default SideBar;