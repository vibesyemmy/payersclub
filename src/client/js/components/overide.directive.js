function Override() {
	'ngInject';
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var body    = element.closest('body');

			body.scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    	});

		}
	}
}

export default Override;