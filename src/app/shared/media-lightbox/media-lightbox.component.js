(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('mediaLightbox', {
      controller: MediaLightboxController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/media-lightbox/media-lightbox.html'
    });

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
