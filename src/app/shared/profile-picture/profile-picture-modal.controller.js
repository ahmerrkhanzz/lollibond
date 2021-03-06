(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('ProfilePicModalController', ProfilePicModalController);

  function ProfilePicModalController($uibModalInstance, $http, baseService, toaster, $window, profileService, imageService) {
    var vm = this;
    vm.src = '';
    vm.croppedImage = '';
    vm.config = '';
    vm.setCroppieUrl = '';
    vm.isPhotoUploaded = false;
    vm.profilePictures = [];

    function uploadImage($files) {
      if ($files[0].type !== 'image/jpeg') {
        toaster.error({ title: 'Upload Failed!', body: 'Please select the JPEG file.' });
        vm.src = '';
        return false;
      }

      if($files[0].size > 5000000){
        toaster.error({ title: 'Upload Failed!', body: 'Please select image less then 5MB.' });
        vm.src = '';
        return false;
      }  

      vm.prevPhoto = false;

      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
          vm.setCroppieUrl(e);
          vm.isPhotoUploaded = true;
        };
        fileReader.readAsDataURL($files[0]);
      } else {
        saveImage();
      }
    }

    function uploadImageOnServer() {
      var CROP_X_START = vm.config.points[0] || '';
      var CROP_Y_START = vm.config.points[1] || '';
      var CROP_X_END = vm.config.points[2] || '';
      var CROP_Y_END = vm.config.points[3] || '';

      var CROP_WIDTH = CROP_X_END - CROP_X_START;
      var CROP_HEIGHT = CROP_Y_END - CROP_Y_START;

      return imageService
        .uploadProfilePic(
          CROP_X_START,
          CROP_Y_START,
          CROP_WIDTH,
          CROP_HEIGHT,
          'user-profile',
          vm.src)
        .then(function(key) {
          return {
            key: key,
            name: 'Profile Image Name'
          };
        });
    }

    function saveProfilePicture(postObj) {
      return new baseService()
        .setPath('peacock', '/user/me/profilePicture')
        .setPostMethod()
        .setPostParams(postObj)
        .execute()
        .then(function(res) {
          return res.key;
        });
    }

    function saveImage() {
      vm.isPhotoUploaded = false;

      uploadImageOnServer()
        .then(saveProfilePicture)
        .then(function(res) {
          vm.isPhotoUploaded = true;
          $uibModalInstance.close(res.key);
          // toaster.success({ title: 'Successfully saved!', body: 'Profile Picture has been updated!' });
          $window.location.reload();
        });
    }

    function setAsProfilePic(photoId) {
      vm.isPhotoUploaded = false;

      var api = new baseService()
        .setPath('peacock', '/user/me/profilePicture')
        .setPutMethod()
        .setGetParams({ imageId: photoId });

      api.execute()
        .then(function(res) {
          vm.isPhotoUploaded = true;
          $uibModalInstance.close(res.key);
          // toaster.success({ title: 'Successfully saved!', body: 'Profile Picture has been updated!' });
          $window.location.reload();
        });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function getProfilePics() {
      var api = new baseService()
        .setPath('peacock', '/user/' + profileService.profileId + '/photo-collections/profile');

      api.execute()
        .then(function(res) {
          vm.profilePictures = res;
        });
    }

    getProfilePics();

    //function assignment
    vm.saveImage = saveImage;
    vm.cancel = cancel;
    vm.uploadImage = uploadImage;
    vm.setAsProfilePic = setAsProfilePic;
  }
})();
