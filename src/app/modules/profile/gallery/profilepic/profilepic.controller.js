(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('ProfilePicController', ProfilePicController);

  /** @ngInject */
  function ProfilePicController(baseService, profileService, $window) {
    var vm = this;

    // Loader variable
    vm.postsLoading = true;

    vm.profilePictures = [];

    var photoDropdown = [{
      title: 'Set as Profile Picture',
      action: setAsProfilePic
    }, {
      title: 'Remove this photo',
      action: deletePhoto
    }];

    if (profileService.ownProfile) vm.configDropdown = photoDropdown;
    else vm.configDropdown = false;

    function getProfilePics() {
      // Show the loader while loading posts
      vm.postsLoading = true;
      var api = new baseService()
        .setPath('peacock', '/user/' + profileService.profileId + '/photo-collections/profile');

      api.execute()
        .then(function(res) {
          vm.profilePictures = res;
        })
        .finally(function() {
          // Hide the loader
          vm.postsLoading = false;
        });
    }

    function deletePhoto() {}

    function setAsProfilePic(photoId) {
      var api = new baseService()
        .setPath('peacock', '/user/me/profilePicture')
        .setPutMethod()
        .setGetParams({ imageId: photoId });

      api.execute()
        .then(function(){
          $window.location.reload();
        });
    }

    getProfilePics();
  }
})();
