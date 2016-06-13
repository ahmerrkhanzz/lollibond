(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('subHeaderBlue', subHeaderBlue);

  function subHeaderBlue() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {},
      controller: 'SubHeaderBlueController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/shared/sub-header-blue/sub-header-blue.html'
    };
    return directive;
  }
})();
