(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('mainHeader', mainHeader);

  function mainHeader() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {},
      controller: 'MainHeaderController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/shared/main-header/main-header.html'
    };
    return directive;
  }
})();
