(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('createPost', {
      bindings: {
        postUpdate: '&',
        shareMethod: '&',
        canChangePrivacy: '<'
      },
      controller: CreatePostController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/create-post/create-post.html'
    });

  /** @ngInject */
  function CreatePostController($scope, postService, authService, baseService, imageService, toaster) {
    var vm = this;

    vm.useUrl = false;
    vm.linkData = {};
    vm.files = [];
    vm.tempImages = [];
    vm.imageCount = 0;

    // Post variables
    vm.postTypes = [{
      name: 'Update',
      icon: 'glyphicon glyphicon-user',
      placeholder: 'What do you have in mind?'
    }, {
      name: 'Question',
      icon: 'fa fa-question',
      placeholder: 'What do you want to ask?'
    }, {
      name: 'Discussion',
      icon: 'icon-bubbles3',
      placeholder: 'What do you want to discuss?'
    }, {
      name: 'Idea',
      icon: 'fa fa-lightbulb-o',
      placeholder: 'What is your idea'
    }, {
      name: 'Announcement',
      icon: 'fa fa-bullhorn',
      placeholder: 'What would you like to announce?'
    }, {
      name: 'News',
      icon: 'fa fa-newspaper-o',
      placeholder: 'What\'s up and newsworthy?'
    }, {
      name: 'Article',
      icon: 'icon-magazine',
      placeholder: 'What topic do you want to talk about?'
    }];
    vm.selectedPostType = vm.postTypes[0];
    vm.selectedPostTypeIndex = 0;
    vm.postPrivacyOpts = [{
      name: 'Public',
      icon: 'icon-earth',
      level: 3
    }, {
      name: 'Bonds',
      icon: 'icon-users',
      level: 1
    }, {
      name: 'Bonds of Bonds',
      icon: 'icon-users',
      level: 2
    }, {
      name: 'Only me',
      icon: 'icon-lock',
      level: 0
    }];

    vm.selectedPostPrivacy = vm.postPrivacyOpts[0];
    vm.postContent = '';
    // Location variables
    vm.locationSection = false;

    function changePostType(type, idx) {
      vm.selectedPostType = type;
      vm.selectedPostTypeIndex = idx;
    }

    function changePostPrivacy(opt) {
      vm.selectedPostPrivacy = opt;
    }

    function addLocation() {
      vm.locationSection = !vm.locationSection;
    }

    // Upload image functionality
    function uploadImage(files) {
      if (files.length === 0) return false;

      // Clear the link
      clearLink();

      vm.tempImages = files.map(function(file) {
        var fileObj = {
          file: file,
          isUploaded: false,
          isValid: true,
          errMsg: null,
          key: null
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
              vm.imageCount++;
            });
        } else {
          vm.imageCount++;

          fileObj.isUploaded = true;
          fileObj.isValid = false;
          fileObj.errMsg = 'Invalid image format.';
        }

        return fileObj;
      });
      
      vm.files = vm.files.concat(vm.tempImages);
    }

    function removeImage(idx) {
      vm.files.splice(idx, 1);
      vm.imageCount--;
    }

    function sharePost() {
      // Post types:
      // External link/Simple text: 1
      // Internal link: 2
      // PhotoShare: 3
      // -- By default type is set to 1
      var type = 1;

      var postData = {
        permissions: checkPostPermission(vm.selectedPostPrivacy),
        post: {
          text: vm.postContent
        }
      };

      if (vm.linkData.media) {
        postData.post.link = vm.linkData;
      }

      // Incase user have uploaded photos
      if(vm.files.length > 0){
        var filesToSave = vm.files.filter(function(val){ return val.isValid });
        if (filesToSave.length > 0) {

          var imageKeys = filesToSave
            .filter(function(file) {
              return file.isValid;
            })
            .map(function(file) {
              return file.key;
            });

          // Change the post type
          type = 3;
          postData.post.photoKeys = imageKeys;
        }
        else{
          toaster.error({ title: "Error!", body: "Invalid files added! Please select JPEG" });
          return false;
        }
      }
      

      // Update the DB
      vm.shareMethod({
          data: postData,
          type: type
        })
        .then(function(data) {
          // Append in the posts list
          // using method from parent controller
          vm.postUpdate({
            data: freshPost(data, authService)
          });
        });
      // Reset the form
      resetForm();
    }

    function freshPost(data, user) {
      return {
        id: data.id,
        text: data.text,
        attachment: data.attachment,
        author: {
          id: user.UID,
          firstName: user.user.firstName,
          lastName: user.user.lastName,
          profilePicture: user.user.profilePicture
        },
        permissions: {
          // TODO: Change this logic while
          //       implementing permissions
          mine: true,
          level: vm.selectedPostPrivacy.level
        },
        timestamp: new Date().toISOString(),
        comments: [],
        aceCount: 0,
        shareCount: 0,
        commentCount: 0,
        aced: false
      };
    }

    function checkPostPermission(perm) {
      var permArr = [];

      switch (perm.name) {
        case 'Public':
          break;
        case 'Bonds':
          permArr.push('d' + authService.UID);
          break;
        case 'Bonds of Bonds':
          permArr.push('i' + authService.UID);
          break;
        case 'Only me':
          permArr.push('n' + authService.UID);
          break;
      }

      return permArr;
    }

    // Reset the create post form
    function resetForm() {
      vm.selectedPostType = vm.postTypes[0];
      vm.postContent = '';
      vm.locationSection = false;
      vm.files = [];
      vm.imageCount = 0;
      vm.formPost.$setPristine();
      clearLink();
    }

    function clearLink() {
      vm.linkData = {};
      vm.useUrl = false;
      // Clear the ignore list in url detect
      $scope.$broadcast('clearIgnoreList');
    }

    function analyzeUrl(url) {
      // Incase user has already uploaded images
      // Do not enter the link
      if (vm.files.length > 0) return false;

      var analyze = new baseService()
        .setPath('peacock', '/analyze/html?url=' + url);

      analyze
        .execute()
        .then(function(res) {
          vm.useUrl = true;
          vm.linkData = res;
        });
    }

    function deleteMedia() {
      vm.linkData = {};
      vm.useUrl = false;
    }

    //////////////////////////////////////
    vm.changePostType = changePostType;
    vm.changePostPrivacy = changePostPrivacy;
    vm.uploadImage = uploadImage;
    vm.sharePost = sharePost;
    vm.addLocation = addLocation;
    vm.analyzeUrl = analyzeUrl;
    vm.deleteMedia = deleteMedia;
    vm.removeImage = removeImage;
  }
})();
