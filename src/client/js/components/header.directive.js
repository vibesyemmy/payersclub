/*jshint esversion: 6 */
function Header() {
	'ngInject';
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			element.affix({
        offset: {
            top: 100
        }
    	});
		}
	};
}

export default Header;