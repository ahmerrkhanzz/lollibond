(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .controller('SubHeaderGreenController', SubHeaderGreenController);

  /** @ngInject */
  function SubHeaderGreenController() {
    var vm = this;

    vm.subHeaderCollapsed = true;
   
  }
})();
