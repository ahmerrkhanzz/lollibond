(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('lbPhotoThumb', {
      bindings: {
        photoData: '<',
        configDropdown: '=',
        photoType: '@',
        index: '@'
      },
      controller: LbPhotoThumbController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/lb-photo-thumb/lb-photo-thumb.html'
    });

  /** @ngInject */
  function LbPhotoThumbController($uibModal) {
    var vm = this;

    var DIMENSIONS = {
      c: { w: 500, h: 125 },
      p: { w: 300, h: 300 },
      a: { w: 300, h: 300 }
    }

    vm.photoWidth = DIMENSIONS[vm.photoType].w;
    vm.photoHeight = DIMENSIONS[vm.photoType].h;

    // Show lightbox for image/video
    function showModal() {
      $uibModal.open({
        animation: true,
        templateUrl: 'app/shared/media-lightbox/media-lightbox.html',
        controller: 'MediaLightboxController',
        controllerAs: 'vm',
        bindToController: true,
        size: 'lg',
        resolve: {
          mediaData: function() {
            return {
              id: vm.photoData.id,
              name: vm.photoData.name,
              mediaImg: vm.photoData.key
            };
          }
        }
      });
    }

    /////////////////////////
    vm.showModal = showModal;
  }
})();
