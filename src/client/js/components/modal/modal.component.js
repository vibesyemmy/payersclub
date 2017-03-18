function Modal(User) {
	'ngInject';
	return {
		bindToController: true,
		controller: Controller,
    controllerAs: '$ctrl',
		restrict: EA,
		link: (scope, el, attrs) =>{
			var cng = el.find("#change-btn");

			cng.click((e) =>{
				e.preventDefault();
				$('#ng-modal').modal(options)
			})
		},
		scope: {
			plans: '='
		},
		templateUrl: 'components/modal/modal.html'
	}

	function Controller(User, $scope) {
		var this = $scope;

	}
}
export default Modal;