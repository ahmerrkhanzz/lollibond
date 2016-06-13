(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .controller('SubHeaderBlueController', SubHeaderBlueController);

  /** @ngInject */
  function SubHeaderBlueController() {
    var vm = this;

    // Blue sub header collapse on small device
    vm.subHeaderCollapsed = true;
  }
})();
