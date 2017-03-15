/*jshint esversion: 6 */
function Wysiwyg() {
	'ngInject';
	return {
		restrict : "A",
    require : 'ngModel',
    transclude : true,
    link : function(scope, element, attrs, ctrl){

    	var textarea = element.wysihtml5({"html": true});
    	var editor = textarea.data('wysihtml5').editor;

    	// view -> model
      editor.on('change', function() {
        if(editor.getValue())
        scope.$apply(function() {
          ctrl.$setViewValue(editor.getValue());
        });
      });

      ctrl.$render = function() {
        textarea.html(ctrl.$viewValue);
        editor.setValue(ctrl.$viewValue);
      };

      ctrl.$render();
    
    }
	}
}

export default Wysiwyg;