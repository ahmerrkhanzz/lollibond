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
  function UserReplyController(moment, postService) {
    var vm = this;

    vm.replyAced = vm.replyData.aced;

    // Get timestamp helper function
    function getTimestamp(datetime) {
      return moment(datetime).fromNow()
    }

    // Give ACE to reply functionality
    function aceReply() {
      if (vm.commentAced) {
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

    ////////////////////////////
    vm.getTimestamp = getTimestamp;
    vm.aceReply = aceReply;
  }
})();
