(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('userPost', {
      bindings: {
        postData: '<'
      },
      controller: UserPostController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/user-post/user-post.html'
    });

  /** @ngInject */
  function UserPostController(moment, postService, authService, lbUtilService) {
    var vm = this;
    // No of comments that are loaded one time
    var PAGER_COUNT = 5;

    var permissionLevel = vm.postData.permissions.level;
    var postPrivacyOpts = [{
      name: 'Only me',
      icon: 'icon-lock'
    }, {
      name: 'Bonds',
      icon: 'icon-users'
    }, {
      name: 'Bonds of Bonds',
      icon: 'icon-users'
    }, {
      name: 'Public',
      icon: 'icon-earth'
    }];
    vm.postPermission = postPrivacyOpts[permissionLevel];

    vm.authService = authService;

    vm.userComment = '';
    vm.postComments = [];
    vm.postAced = vm.postData.aced;
    vm.dataLoaded = false;
    vm.commentsLoading = false;
    vm.commentAvailable = vm.postData.commentCount > 0;
    vm.textLimit = 330;

    // If Profile Picture Empty, Set Placeholder according to Gender
    vm.postData.author.profilePicture = lbUtilService.setProfilePicture(vm.postData.author.profilePicture, vm.postData.author.gender);

    // Get timestamp helper function
    function getTimestamp(datetime) {
      return moment(datetime).fromNow()
    }

    function showComments(state, ID) {
      // State is used to keep check that
      // Data has been loaded by clicking
      // on show comments
      if (state) return;

      // Show the loader while loading comments
      vm.commentsLoading = true;

      postService.getComments(vm.postData.id, ID)
        .then(function(data) {
          vm.postComments.push(data);

          // Flatten the array
          vm.postComments = [].concat.apply([], vm.postComments);
          // Check for comments availability
          vm.commentAvailable = data.length >= PAGER_COUNT;
          // On first time load when show comments is clicked
          // dataLoaded is changed to true
          vm.dataLoaded = true;
        })
        .finally(function() {
          // Hide the loader
          vm.commentsLoading = false;
        });
    }

    function loadMore() {
      var totalComments = vm.postComments.length - 1;
      var lastCommentId = vm.postComments[totalComments].id;
      showComments(false, lastCommentId);
    }

    // Give ACE to post functionality
    function acePost() {
      if (vm.postAced) {
        postService.unAcePost(vm.postData.id)
          .then(function() {
            --vm.postData.aceCount;
            vm.postAced = false;
          });
      } else {
        postService.acePost(vm.postData.id)
          .then(function() {
            ++vm.postData.aceCount;
            vm.postAced = true;
          });
      }
    }

    // Add comment functionality
    function addComment() {
      if(!vm.userComment) return false;
      
      var commentContent = {
        text: vm.userComment
      };

      // Update the DB
      postService.pushComment(vm.postData.id, commentContent)
        .then(function(data) {
          // Append in the comments section if visible in the view
          vm.postComments.unshift(freshComment(data, authService));
          ++vm.postData.commentCount;
        });

      vm.dataLoaded = true;
      // Reset the form
      vm.userComment = '';
    }

    function freshComment(data, user) {
      return {
        id: data.id,
        text: data.text,
        timestamp: new Date().toISOString(),
        author: {
          id: user.UID,
          firstName: user.user.firstName,
          lastName: user.user.lastName,
          profilePicture: user.user.profilePicture
        },
        comments: [],
        aceCount: 0,
        shareCount: 0,
        replyCount: 0,
        aced: false
      };
    }

    function showMore() {
      if(vm.textLimit > 330){
        vm.textLimit = 330;
      }else{
        vm.textLimit = vm.postData.text.length;
      }
    }

    //////////////////////////////////
    vm.showComments = showComments;
    vm.getTimestamp = getTimestamp;
    vm.acePost = acePost;
    vm.addComment = addComment;
    vm.loadMore = loadMore;
    vm.showMore = showMore;
  }
})();
