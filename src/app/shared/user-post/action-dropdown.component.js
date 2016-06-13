(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('actionDropdown', {
      bindings: {
        postData: '<'
      },
      controller: ActionDropdown,
      controllerAs: 'vm',
      templateUrl: 'app/shared/user-post/action-dropdown.html'
    });

  /** @ngInject */
  function ActionDropdown(authService, profileService) {
    var vm = this;

    // Post permissions based on roles
    // OWNER: A post on logged in user wall
    // AUTHOR: A post that is written by (logged/other) user
    // FEED: A post in logged in users feed
    // VIEWER: A post in other persons wall
    var PERMISSION = {
      OWNER: vm.postData.permissions.mine,
      AUTHOR: vm.postData.author.id === authService.UID && vm.postData.author.id !== profileService.profileId,
      FEED: vm.postData.author.id !== authService.UID && vm.postData.author.id === authService.UID,
      VIEWER: vm.postData.author.id !== authService.UID && vm.postData.author.id !== authService.UID
    };

    // List of actions that can be applied to a post
    // Permissions are provided based on user roles
    // defined above
    var actionsList = [{
      title: 'Delete post',
      icon: 'icon-cancel-circle2',
      action: deletePost,
      allowed: PERMISSION.OWNER || PERMISSION.AUTHOR
    }, {
      title: 'Turn off notifications',
      icon: 'icon-eye-blocked',
      action: turnOffNotification,
      allowed: PERMISSION.OWNER || PERMISSION.AUTHOR || PERMISSION.FEED
    }, {
      title: 'Edit post',
      icon: 'icon-pencil',
      action: editPost,
      allowed: PERMISSION.AUTHOR
    }, {
      title: 'Hide post',
      icon: 'icon-user-block',
      action: hideUserPost,
      allowed: PERMISSION.FEED
    }, {
      title: 'Follow ' + vm.postData.author.firstName + ' ' + vm.postData.author.lastName,
      icon: 'icon-user-plus',
      action: followUser,
      allowed: PERMISSION.FEED || PERMISSION.VIEWER
    }, {
      title: 'Report post',
      icon: 'icon-user-block',
      action: reportPost,
      allowed: PERMISSION.FEED
    }];

    // Iterate over the actions list
    // and filter the ones that is allowed
    vm.postActions = actionsList.filter(function(action) {
      return action.allowed;
    });

    function deletePost() { console.log('deletePost'); }

    function turnOnNotification() { console.log('turnOnNotification'); }

    function turnOffNotification() { console.log('turnOffNotification'); }

    function unfollowUser() { console.log('unfollowUser'); }

    function followUser() { console.log('followUser'); }

    function editPost() { console.log('editPost'); }

    function hideUserPost() { console.log('hideUserPost'); }

    function reportPost() { console.log('reportPost'); }
  }
})();
