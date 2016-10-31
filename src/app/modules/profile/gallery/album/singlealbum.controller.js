(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('SingleAlbumController', SingleAlbumController);

  /** @ngInject */
  function SingleAlbumController($uibModal, $stateParams, baseService, profileService) {
    var vm = this;

    vm.albumPhotos = [];
    vm.profileService = profileService;

    var photoDropdown = [{
      title: 'Remove this photo',
      action: deletePhoto
    }];

    if (profileService.ownProfile) vm.configDropdown = photoDropdown;
    else vm.configDropdown = false;

    function getAlbumPictures() {
      var api = new baseService()
        .setPath('peacock', '/user/albums/' + $stateParams.aid + '/photos');

      api.execute()
        .then(function(res) {
          vm.albumPhotos = res;
        });
    }

    function deletePhoto(photoId, idx) {
      var api = new baseService()
        .setPath('peacock', '/user/albums/photos/' + photoId)
        .setDeleteMethod();

      api.execute()
        .then(function() {
          vm.albumPhotos.splice(idx, 1);
        });
    }

    function openAddPhotoModal() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/shared/lb-create-album-modal/lb-create-album-modal.html',
        controller: 'LbCreateAlbumModalController',
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          album: function() {
            return $stateParams.aid;
          }
        }
      });

      modalInstance.result.then(function(result) {
        vm.albumPhotos.unshift(result.reverse());
        vm.albumPhotos = [].concat.apply([], vm.albumPhotos);
      });
    }

    getAlbumPictures();

    ///////////////////
    vm.deletePhoto = deletePhoto;
    vm.openAddPhotoModal = openAddPhotoModal;
  }
})();
