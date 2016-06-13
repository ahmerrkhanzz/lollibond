(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .controller('MainHeaderController', MainHeaderController);

  /** @ngInject */
  function MainHeaderController(authService) {
    var vm = this;
    vm.authService = authService;
    vm.isPortal = 'corporate';

    function switchWorld(portalName) {
      vm.isPortal = portalName;
    }

    function login() {
      authService.login();
    }

    ////////////////////////////////////
    vm.switchWorld = switchWorld;
    vm.logout = authService.logout;
    vm.login = login;
  }
})();
