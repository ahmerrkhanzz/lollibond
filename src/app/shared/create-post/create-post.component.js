(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('createPost', {
      bindings: {
        postList: '<',
        shareMethod: '&'
      },
      controller: CreatePostController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/create-post/create-post.html'
    });

  /** @ngInject */
  function CreatePostController(Upload, $timeout, postService, authService) {
    var vm = this;

    // Post variables
    vm.postTypes = [{
      name: 'Update',
      icon: 'icon-link',
      placeholder: 'What do you have in mind?'
    }, {
      name: 'Question',
      icon: 'icon-infinite',
      placeholder: 'What do you want to ask?'
    }, {
      name: 'Discussion',
      icon: 'icon-bubble2',
      placeholder: 'What do you want to discuss?'
    }, {
      name: 'Idea',
      icon: 'icon-spinner4',
      placeholder: 'What is your idea'
    }, {
      name: 'Announcement',
      icon: 'icon-feed',
      placeholder: 'What would you like to announce?'
    }, {
      name: 'News',
      icon: 'icon-lastfm',
      placeholder: 'What\'s up and newsworthy?'
    }, {
      name: 'Article',
      icon: 'icon-files-empty',
      placeholder: 'What topic do you want to talk about?'
    }];
    vm.selectedPostType = vm.postTypes[0];
    vm.selectedPostTypeIndex = 0;
    vm.postPrivacyOpts = [{
      name: 'Public',
      icon: 'icon-earth'
    }, {
      name: 'Friends',
      icon: 'icon-users'
    }, {
      name: 'Friends of Friends',
      icon: 'icon-users'
    }, {
      name: 'Only me',
      icon: 'icon-lock'
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
    var imageData = '';

    function uploadImage(files) {
      vm.files = files;

      if (files && files.length) {
        Upload.upload({
          // TODO: Replace by actual api (when ready)
          //       and use Service for this operation
          url: 'http://localhost:3003/images/',
          data: {
            files: files
          }
        }).then(function(response) {
          $timeout(function() {
            vm.uploadResult = response.data;
          });
        }, function(response) {
          if (response.status > 0) {
            vm.uploadError = response.status + ': ' + response.data;
          }
        }, function(evt) {
          vm.uploadProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        Upload.base64DataUrl(files).then(function(urls) {
          imageData = urls;
        });
      }
    }

    function sharePost() {
      var postData = {
        text: vm.postContent
      };

      // Update the DB
      vm.shareMethod({ data: postData })
        .then(function(data) {
          // Append in the posts list
          vm.postList.unshift(freshPost(data, authService));
        });
      // Reset the form
      resetForm();
    }

    function freshPost(data, user) {
      return {
        id: data.id,
        text: data.text,
        author: {
          id: user.UID,
          firstName: user.user.firstName,
          lastName: user.user.lastName
        },
        permissions: {
          // TODO: Change this logic while
          //       implementing permissions
          mine: true
        },
        timestamp: new Date().toISOString(),
        comments: [],
        aceCount: 0,
        shareCount: 0,
        commentCount: 0,
        aced: false
      };
    }

    // Reset the create post form
    function resetForm() {
      vm.selectedPostType = vm.postTypes[0];
      vm.selectedPostPrivacy = vm.postPrivacyOpts[0];
      vm.postContent = '';
      vm.files = false;
      vm.locationSection = false;
    }

    //////////////////////////////////////
    vm.changePostType = changePostType;
    vm.changePostPrivacy = changePostPrivacy;
    vm.uploadImage = uploadImage;
    vm.sharePost = sharePost;
    vm.addLocation = addLocation;
  }
})();
