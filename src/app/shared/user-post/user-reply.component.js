(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('userReply', {
      bindings: {
        replyData: '<'
      },
      controller: UserReplyController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/user-post/user-reply.html'
    });

  /** @ngInject */
  function UserReplyController(moment, postService, lbUtilService) {
    var vm = this;

    vm.replyAced = vm.replyData.aced;
    vm.textLimit = 250;

    // If Profile Picture Empty, Set Placeholder according to Gender
    vm.replyData.author.profilePicture = lbUtilService.setProfilePicture(vm.replyData.author.profilePicture, vm.replyData.author.gender);

    // Get timestamp helper function
    function getTimestamp(datetime) {
      return moment(datetime).fromNow()
    }

    // Give ACE to reply functionality
    function aceReply() {
      if (vm.replyAced) {
        postService.unAceComment(vm.replyData.id)
          .then(function() {
            --vm.replyData.aceCount;
            vm.replyAced = false;
          });
      } else {
        postService.aceComment(vm.replyData.id)
          .then(function() {
            ++vm.replyData.aceCount;
            vm.replyAced = true;
          });
      }
    }

    function showMore() {
      if (vm.textLimit > 250) {
        vm.textLimit = 250;
      } else {
        vm.textLimit = vm.replyData.text.length;
      }
    }

    ////////////////////////////
    vm.getTimestamp = getTimestamp;
    vm.aceReply = aceReply;
    vm.showMore = showMore;
  }
})();
