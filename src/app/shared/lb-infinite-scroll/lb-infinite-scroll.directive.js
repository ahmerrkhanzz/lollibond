(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('lbInfiniteScroll', lbInfiniteScroll);

  /** @ngInject */
  function lbInfiniteScroll($window) {
    var directive = {
      restrict: 'E',
      scope: {
        callOnShow: '&'
      },
      link: linker
    };
    return directive;

    function linker(scope, el) {
      function checkScroll() {
        isScrolledIntoView(el.context) ? scope.callOnShow() : null;
      }

      function isScrolledIntoView(el) {
        var elemTop = el.getBoundingClientRect().top;
        var elemBottom = el.getBoundingClientRect().bottom;

        var isVisible = (elemTop >= 0) && (elemBottom <= $window.innerHeight);
        return isVisible;
      }

      // To be called from parent controller
      var visibleOnView = scope.$on('visibleOnView', checkScroll);

      angular.element($window).on("scroll", checkScroll);

      scope.$on('$destroy', function() {
        angular.element($window).off("scroll", checkScroll);
        visibleOnView();
      });
    }
  }
})();
