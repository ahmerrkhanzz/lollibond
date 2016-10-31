(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('AlbumController', AlbumController);

  /** @ngInject */
  function AlbumController($uibModal, profileService, baseService) {
    var vm = this;

    vm.albums = [];
    vm.profileService = profileService;

    // Loader variable
    vm.postsLoading = true;

    function getAlbums() {
      // Show the loader while loading posts
      vm.postsLoading = true;
      var api = new baseService()
        .setPath('peacock', '/user/' + profileService.profileId + '/albums');

      api.execute()
        .then(function(res) {
          vm.albums = res;
        })
        .finally(function() {
          // Hide the loader
          vm.postsLoading = false;
        });
    }

    function deleteAlbum(albumId, idx) {
      var api = new baseService()
        .setPath('peacock', '/user/albums/' + albumId)
        .setDeleteMethod();

      api.execute()
        .then(function() {
          vm.albums.splice(idx, 1);
        });
    }

    function openCreateModal() {
      $uibModal.open({
        animation: true,
        templateUrl: 'app/shared/lb-create-album-modal/lb-create-album-modal.html',
        controller: 'LbCreateAlbumModalController',
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          album: function() {
            return false;
          }
        }
      });
    }

    getAlbums();

    ///////////////////////////
    vm.openCreateModal = openCreateModal;
    vm.deleteAlbum = deleteAlbum;
  }
})();
