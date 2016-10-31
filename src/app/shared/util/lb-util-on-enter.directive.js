(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('lbUtilOnEnter', lbUtilOnEnter);

  /** @ngInject */
  function lbUtilOnEnter() {
    var directive = {
      restrict: 'A',
      link: linker
    };
    return directive;

    function linker(scope, el, attrs) {
      var KEYCODE_ENTER = 13;

      el.on("keyup", checkOnType);

      function checkOnType(event){
        if(event.which === KEYCODE_ENTER) {
            //Check if ENTER pressed with SHIFT KEY
            if(!event.shiftKey) {
              scope.$apply(function(){
                scope.$eval(attrs.lbUtilOnEnter, {'event': event});
              });
              event.preventDefault();
            }
        }
      }

      // Clear all bindings
      function cleanup(){
        el.off('keyup', checkOnType);
      }

      scope.$on('$destroy', cleanup);
    }
  }
})();
