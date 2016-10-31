(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('lbUtilAnchor', lbUtilAnchor);

  /** @ngInject */
  function lbUtilAnchor() {
    var directive = {
      restrict: 'A',
      scope: {
        lbHref: '@'
      },
      link: linker
    };
    return directive;

    function linker(scope, el, attrs) {
      var expression = /https?:\/\//g;
      var regex = new RegExp(expression);

      if (scope.lbHref.match(regex)) {
        attrs.$set('href', scope.lbHref);
      } else {
        attrs.$set('href', 'http://' + scope.lbHref);
      }
    }
  }
})();
