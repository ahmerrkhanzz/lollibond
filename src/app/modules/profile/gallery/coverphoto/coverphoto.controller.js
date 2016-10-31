(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('CoverPhotoController', CoverPhotoController);

  /** @ngInject */
  function CoverPhotoController(baseService, profileService, $window) {
    var vm = this;

    // Loader variable
    vm.postsLoading = true;

    vm.coverPhotos = [];

    var photoDropdown = [{
      title: 'Set as Cover Photo',
      action: setAsCover
    }, {
      title: 'Remove this Photo',
      action: deletePhoto
    }];

    if (profileService.ownProfile) vm.configDropdown = photoDropdown;
    else vm.configDropdown = false;

    function getCoverPhoto() {
      // Show the loader while loading posts
      vm.postsLoading = true;
      var api = new baseService()
        .setPath('peacock', '/user/' + profileService.profileId + '/photo-collections/cover');

      api.execute()
        .then(function(res) {
          vm.coverPhotos = res;
        })
        .finally(function() {
          // Hide the loader
          vm.postsLoading = false;
        });
    }

    function deletePhoto() {}

    function setAsCover(photoId) {
      var api = new baseService()
        .setPath('peacock', '/user/me/coverPhoto')
        .setPutMethod()
        .setGetParams({ imageId: photoId });

      api.execute()
        .then(function(){
          $window.location.reload();
        });
    }

    getCoverPhoto();
  }
})();
