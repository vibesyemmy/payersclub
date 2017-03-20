function Hambuger() {
	'ngInject';
	return {
    link: link,
    restrict: 'A',
    scope: {
    }
	};

	function link(scope, element, attrs) {
		var btn = element;

		btn.click(() =>{
			var html = element.closest('html');
			if (!html.hasClass('nav-open')) {
				html.addClass('nav-open');
			} else {
				html.removeClass('nav-open');
			}
		})
	}
}

export default Hambuger;