(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('userComment', {
      bindings: {
        postId: '@',
        commentData: '<'
      },
      controller: UserCommentController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/user-post/user-comment.html'
    });

  /** @ngInject */
  function UserCommentController(moment, postService, authService, profileService) {
    var vm = this;

    vm.commentAced = vm.commentData.aced;
    vm.profileService = profileService;

    // Get timestamp helper function
    function getTimestamp(datetime) {
      return moment(datetime).fromNow()
    }

    function showReply(ID) {
      // Return if function call is generated from
      // show replies once the data is loaded
      if (!!vm.commentReplies[0] && !ID) {
        return;
      }

      postService.getReplies(vm.postId, vm.commentData.id, ID)
        .then(function(data) {
          vm.commentReplies.push(data);
          // Flatten the array
          vm.commentReplies = [].concat.apply([], vm.commentReplies);
        });

      // Make the reply input form visible
      vm.addReplyForm = true;
    }

    function loadMore() {
      var totalComments = vm.commentReplies.length - 1;
      var lastCommentId = vm.commentReplies[totalComments].id;
      showReply(lastCommentId);
    }

    // Give ACE to comments functionality
    function aceComment() {
      if (vm.commentAced) {
        postService.unAceComment(vm.commentData.id)
          .then(function() {
            --vm.commentData.aceCount;
            vm.commentAced = false;
          });
      } else {
        postService.aceComment(vm.commentData.id)
          .then(function() {
            ++vm.commentData.aceCount;
            vm.commentAced = true;
          });
      }
    }

    // Add reply functionality
    vm.userReply = '';
    vm.commentReplies = [];
    vm.addReplyForm = false;

    function showReplyForm() {
      vm.addReplyForm = !vm.addReplyForm;
    }

    function addReply() {
      var replyContent = {
        text: vm.userReply,
      };

      // Update the DB
      postService.pushComment(vm.commentData.id, replyContent)
        .then(function(data) {
          // Append in the replies section if visible in the view
          vm.commentReplies.unshift(freshReply(data, authService));
        });

      // Reset the form
      vm.userReply = '';
    }

    function freshReply(data, user) {
      return {
        id: data.id,
        text: data.text,
        time: new Date().toISOString(),
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
    vm.getTimestamp = getTimestamp;
    vm.aceComment = aceComment;
    vm.addReply = addReply;
    vm.showReply = showReply;
    vm.showReplyForm = showReplyForm;
    vm.loadMore = loadMore;
  }
})();
