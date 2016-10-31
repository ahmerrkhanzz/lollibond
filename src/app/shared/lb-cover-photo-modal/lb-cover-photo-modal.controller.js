(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('LbCoverPhotoModalController', LbCoverPhotoModalController);

  function LbCoverPhotoModalController($uibModalInstance, $http, $window, baseService, toaster, profileService, imageService) {
    var vm = this;
    vm.src = '';
    vm.croppedImage = '';
    vm.config = '';
    vm.setCroppieUrl = '';
    vm.isPhotoUploaded = false;
    vm.coverPhotos = [];

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
        };
        fileReader.onloadend = function() {
          vm.isPhotoUploaded = true;
        }
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
          'user-cover',
          vm.src)
        .then(function(key) {
          return {
            key: key,
            name: 'Cover Image Name'
          };
        });
    }

    function saveCoverPhoto(postObj) {
      return new baseService()
        .setPath('peacock', '/user/me/coverPhoto')
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
        .then(saveCoverPhoto)
        .then(function(res) {
          vm.isPhotoUploaded = true;
          $uibModalInstance.close(res.key);
          // toaster.success({ title: "Successfully saved!", body: "Cover Photo has been updated!" });
          $window.location.reload();
        })
    }

    function setAsCover(photoId) {
      vm.isPhotoUploaded = false;

      var api = new baseService()
        .setPath('peacock', '/user/me/coverPhoto')
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

    function getCoverPhoto() {
      var api = new baseService()
        .setPath('peacock', '/user/' + profileService.profileId + '/photo-collections/cover');

      api.execute()
        .then(function(res) {
          vm.coverPhotos = res;
        });
    }

    getCoverPhoto();

    //function assignment
    vm.saveImage = saveImage;
    vm.cancel = cancel;
    vm.uploadImage = uploadImage;
    vm.setAsCover = setAsCover;
  }
})();
