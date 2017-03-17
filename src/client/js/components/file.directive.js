function File() {
	'ngInject';
	return {
		bindToController: true,
		controller: Controller,
		controllerAs: 'vm',
		link: link,
		restrict: 'E',
		template: '<input type="file" />',
		replace: true,
		require: 'ngModel',
		scope: {
		}
	};
	function link(scope, element, attrs, ctrl) {
		var listener = function() {
  		scope.$apply(function() {
  			attrs.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
  		});
  	}
  	element.bind('change', listener);
	}
	function Controller() {

  }
}

export default File;