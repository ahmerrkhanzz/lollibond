(function() {
  'use strict';

  angular
    .module('lollibond.setup')
    .controller('SetupContactController', SetupContactController);

  /** @ngInject */
  function SetupContactController(authService) {
    var vm = this;
    vm.authService = authService;
    
  }
})();
