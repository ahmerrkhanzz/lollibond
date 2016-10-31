(function() {
  'use strict';

  angular
      .module('lollibond.setting')
      .controller('LbCreateAlbumModalController', LbCreateAlbumModalController);

  /** @ngInject */
  function LbCreateAlbumModalController($q, $state, $uibModalInstance, imageService, baseService, album, toaster) {
    var vm = this;

    vm.files = [];
    vm.loader = false;
    vm.album = album;
    vm.filesUploded = false;
    vm.tempImages = [];
    vm.count = 0;

    function uploadImage(files) {
      vm.filesUploded = false;
      if(files.length === 0 ) return false;

      vm.tempImages = files.map(function(file, idx) {
          var fileObj = {
            file: file,
            isUploaded: false,
            isValid: true,
            errMsg: null,
            key: null,
            idx: idx
          };

          // If file format is correct then hit server
          if (file.type === 'image/jpeg') {
            imageService
              .uploadAlbumPic(file)
              .then(function(res) {
                // Success
                  fileObj.key = res.data;
                  fileObj.isUploaded = true;
                }.bind(fileObj),
                // Error
                function(err) {
                  fileObj.isUploaded = true;
                  fileObj.isValid = false;
                  fileObj.errMsg = err;
                }.bind(fileObj))
                .finally(function() {
                  vm.count++;
                });
          } else {
            fileObj.isUploaded = true;
            fileObj.isValid = false;
            fileObj.errMsg = 'Invalid image format.';
            vm.count++;
          }
          return fileObj;      
        });
      vm.files = vm.files.concat(vm.tempImages);
    }


    function saveAlbum() {
      var album = {};
      var imageCounter = 0;
      var filesToSave = vm.files.filter(function(val){ return val.isValid });

      vm.loader = true;
      createAlbum()
        .then(function(res) {
            album = res;
            return filesToSave
        })
        .then(function(files) {
            files.map(function(photo) {
              addImage(photo.key, photo.fileName, album.id)
                .then(function(){
                  imageCounter++;
                })
                .then(function() {
                    if(filesToSave.length === imageCounter){
                      cancelModal();
                      vm.loader = true;
                      $state.go('personal.profile.gallery.singlealbum', {
                        aid: album.id
                      });
                    }
                });
            })
        })
        
    }

    function updateAlbum() {
      var fileKeys = [];
      var filesToSave = vm.files.filter(function(val){ return val.isValid });
      var imageCounter = 0;

      var albumId = $state.params.aid;
      if (filesToSave.length < 1) {
          toaster.error({ title: "Error!", body: "Invalid files added! Please select JPEG" });
          return false;
      }

      vm.loader = true;
      filesToSave.map(function(photo) {
        addImage(photo.key, photo.fileName, albumId)
          .then(function(res) {
            fileKeys.push({
                id: res.id,
                key: res.key,
                name: res.name
            });
          })
          .then(function() {
              imageCounter++;
              if(filesToSave.length === imageCounter){
                vm.loader = false;
                $uibModalInstance.close(fileKeys);
              }
          });
      });
    }

    function addImage(key, imgName, albumId) {
      var postParams = {
        key: key,
        name: imgName
      };

      return new baseService()
        .setPath('peacock', '/user/albums/' + albumId + '/photos')
        .setPostMethod()
        .setPostParams(postParams)
        .execute();
    }

    function createAlbum() {
      var postParams = {
          name: vm.albumName
      };

      return new baseService()
        .setPath('peacock', '/user/me/albums')
        .setPostMethod()
        .setPostParams(postParams)
        .execute();
    }

    function removeImage(idx) {
      vm.files.splice(idx, 1);
      vm.count--;
    }

    function cancelModal() {
      $uibModalInstance.close();
    }

    ///////////////////////
    vm.removeImage = removeImage;
    vm.uploadImage = uploadImage;
    vm.cancelModal = cancelModal;
    vm.saveAlbum = saveAlbum;
    vm.updateAlbum = updateAlbum;
  }
})();
