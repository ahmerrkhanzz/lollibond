(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('mainHeaderGreen', mainHeaderGreen);

  function mainHeaderGreen() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {},
      controller: 'mainHeaderGreenController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/shared/main-header-green/main-header-green.html'
    };
    return directive;
  }
})();
