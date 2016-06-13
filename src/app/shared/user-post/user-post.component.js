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
  function UserPostController(moment, $uibModal, postService, authService, profileService) {
    var vm = this;

    vm.profileService = profileService;
    vm.postAced = vm.postData.aced;

    // Post actions dropdown functionality
    vm.postActions = [{
      title: 'Hide user post',
      icon: 'icon-user-lock',
      action: hideUserPost
    }, {
      title: 'Block user',
      icon: 'icon-user-block',
      action: blockUser
    }, {
      title: 'Unfollow user',
      icon: 'icon-cross2',
      action: unfollowUser
    }, {
      title: 'Embed post',
      icon: 'icon-embed',
      action: embedPost
    }, {
      title: 'Report this post',
      icon: 'icon-blocked',
      action: reportPost
    }];

    function hideUserPost() {}

    function blockUser() {}

    function unfollowUser() {}

    function embedPost() {}

    function reportPost() {}

    // Get timestamp helper function
    function getTimestamp(datetime) {
      return moment(datetime).fromNow()
    }

    function showComments(ID) {
      postService.getComments(vm.postData.id, ID)
        .then(function(data) {
          vm.postComments.push(data);
          // Flatten the array
          vm.postComments = [].concat.apply([], vm.postComments);
        });
    }

    function loadMore() {
      var totalComments = vm.postComments.length - 1;
      var lastCommentId = vm.postComments[totalComments].id;
      showComments(lastCommentId);
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
    vm.userComment = '';
    vm.postComments = [];

    function addComment() {
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
          lastName: user.user.lastName
        },
        comments: [],
        aceCount: 0,
        shareCount: 0,
        commentCount: 0,
        aced: false
      };
    }

    //////////////////////////////////
    vm.showComments = showComments;
    vm.getTimestamp = getTimestamp;
    vm.acePost = acePost;
    vm.addComment = addComment;
    vm.loadMore = loadMore;
  }
})();
