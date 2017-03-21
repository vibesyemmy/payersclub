function PlanBlock ($parse) {
	'ngInject';
	return {
		restrict : 'A',
		scope: {
      modalVisible: "="
    },
		link: (scope, el, attrs) => {
			scope.planBlock = (visible) => {
				if (visible) {
					el.model({
						backdrop:'static',
						keyboard: false
					});
				} else {
					el.modal("hide");
				}

				if (!attrs.modalVisible) {
					//The attribute isn't defined, show the modal by default
          scope.planBlock(true);
				} else {
					//Watch for changes to the modal-visible attribute
          scope.$watch("modalVisible", function (newValue, oldValue) {
            scope.planBlock(newValue);
          });
          //Update the visible value when the dialog is closed through UI actions (Ok, cancel, etc.)
          el.bind("hide.bs.modal", function () {
            scope.modalVisible = false;
            if (!scope.$$phase && !scope.$root.$$phase)
              scope.$apply();
          });
				}
			}
		}
	}
}

export default PlanBlock;