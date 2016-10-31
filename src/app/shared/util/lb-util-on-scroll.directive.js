(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('lbUtilOnScroll', lbUtilOnScroll);

  /** @ngInject */
  function lbUtilOnScroll($window) {
    var directive = {
      restrict: 'A',
      scope: {
        onScroll: '&',
        isScrollDown: '='
      },
      link: linker
    };
    return directive;

    function linker(scope) {
      function checkScrollPos() {
        if (!scope.scrollPosition) {
          scope.scrollPosition = 0
        }
        if (this.pageYOffset > scope.scrollPosition && scope.scrollPosition > 36) {
          scope.isScrollDown = true;
        } else {
          scope.isScrollDown = false;
        }
        scope.scrollPosition = this.pageYOffset;
        scope.$apply();
      }

      angular.element($window).on("scroll", checkScrollPos);
      scope.$on("$destroy", function(){
        angular.element($window).off("scroll", checkScrollPos);
      });
    }
  }
})();
