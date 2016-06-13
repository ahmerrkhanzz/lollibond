(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('subHeaderGreen', subHeaderGreen);

  function subHeaderGreen() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {},
      controller: 'SubHeaderGreenController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/shared/sub-header-green/sub-header-green.html'
    };
    return directive;
  }
})();
