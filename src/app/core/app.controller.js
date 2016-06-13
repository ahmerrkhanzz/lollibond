(function() {
  'use strict';

  angular
    .module('lollibond.core')
    .controller('AppShellController', AppShellController);

  /** @ngInject */
  function AppShellController($scope) {
    var vm = this;

    // this'll be called on every state change in the app
    $scope.$on('$stateChangeSuccess', function(event, toState) {
      if (angular.isDefined(toState.data.bodyClasses)) {
        vm.bodyClasses = toState.data.bodyClasses;
        vm.styleName = toState.data.styleName;
        return;
      }
    });
  }
})();
