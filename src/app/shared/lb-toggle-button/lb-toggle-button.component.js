(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('lbToggleButton', {
      bindings: {
        buttonConfig: '<',
        buttonState: '<'
      },
      controller: LbToggleButtonController,
      controllerAs: 'vm',
      template: '<button class="btn btn-primary" ng-disabled="vm.buttonState === null" ng-click="vm.clickEvent()">{{ vm.label }} <i class="{{ vm.icon }}"></i></button>'
    });

  /** @ngInject */
  function LbToggleButtonController() {
    var vm = this;

    toggleState();

    function clickEvent() {
      if (vm.buttonState) {
        vm.buttonConfig.trueState.action();
        vm.buttonState = false;
      } else {
        vm.buttonConfig.falseState.action();
        vm.buttonState = (vm.buttonConfig.pendingState) ? null : true;
      }
      toggleState();
    }

    function toggleState() {
      if (vm.buttonState === null) {
        vm.label = vm.buttonConfig.pendingState.label;
      } else if (vm.buttonState) {
        vm.label = vm.buttonConfig.trueState.label;
      } else {
        vm.label = vm.buttonConfig.falseState.label;
      }
    }

    ///////////////////////////
    vm.clickEvent = clickEvent;
  }
})();
