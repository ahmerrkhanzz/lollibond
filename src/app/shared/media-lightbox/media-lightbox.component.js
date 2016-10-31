(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .controller('MediaLightboxController', MediaLightboxController);

  /** @ngInject */
  function MediaLightboxController($uibModalInstance, mediaData) {
    var vm = this;

    vm.mediaData = mediaData;

    function dismisModal() {
      $uibModalInstance.dismiss('cancel');
    }

    // Available functions for controller
    vm.dismisModal = dismisModal;
  }
})();
