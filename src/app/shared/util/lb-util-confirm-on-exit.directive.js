(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('lbUtilConfirmOnExit', lbUtilConfirmOnExit);

  /** @ngInject */
  function lbUtilConfirmOnExit($window) {
    var directive = {
      restrict: 'A',
      scope: {
        formState: '='
      },
      link: linker
    };
    return directive;

    function linker(scope) {
      //Check if URL Change
      $window.onbeforeunload = function() {
        if (scope.formState.$dirty) {
          return "You have unsaved changes, please save or these changes will be discarded";
        }
      }

      // Check browser events
      function locationChangeStart(event) {
        if (scope.formState.$dirty) {
          if (!confirm("You have unsaved changes, please save or these changes will be discarded")) {
            event.preventDefault();
          }
        }
      }

      // Cleaning the binding
      function cleanup() {
        $window.onbeforeunload = function() {
          return;
        }
        locationChangeEvent();
        locationChangeEvent = null;
      }

      // Check on Event Trigger (Back/Next/Close)
      var locationChangeEvent = scope.$on('$locationChangeStart', locationChangeStart);
      scope.$on('$destroy', cleanup);
    }
  }
})();
