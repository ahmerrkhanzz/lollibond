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
  function ActionDropdown(authService, profileService, baseService, bondService) {
    var vm = this;

    vm.isMenuOpen = false;

    // Post permissions based on roles
    // OWNER: A post on logged in user wall
    // AUTHOR: A post that is written by (logged/other) user
    // FEED: A post in logged in users feed
    // VIEWER: A post in other persons wall
    var PERMISSION = {
      OWNER: vm.postData.permissions.mine,
      AUTHOR: vm.postData.author.id === authService.UID,
      FEED: vm.postData.author.id !== authService.UID && vm.postData.author.id === authService.UID,
      VIEWER: vm.postData.author.id !== authService.UID
    };

    // The items on view will appear by the order in this array
    var actionsList = ['EDIT', 'HIDE', 'FOLLOW', 'UNFOLLOW', 'TURN_OFF', 'TURN_ON', 'DELETE', 'REPORT'];

    // List of actions that can be applied to a post
    // Permissions are provided based on user roles
    // defined above
    var actionsObj = {
      'DELETE': {
        title: 'Delete post',
        icon: 'icon-cross3',
        action: deletePost,
        visible: true,
        allowed: PERMISSION.OWNER || PERMISSION.AUTHOR
      },
      'TURN_OFF': {
        title: 'Turn off notifications',
        icon: 'icon-eye-blocked',
        action: turnOffNotification,
        visible: true,
        allowed: PERMISSION.OWNER || PERMISSION.AUTHOR || PERMISSION.FEED
      },
      'EDIT': {
        title: 'Edit post',
        icon: 'icon-pencil',
        action: editPost,
        visible: true,
        allowed: PERMISSION.AUTHOR
      },
      'HIDE': {
        title: 'Hide post',
        icon: 'icon-user-block',
        action: hideUserPost,
        visible: true,
        allowed: PERMISSION.FEED
      },
      'FOLLOW': {
        title: 'Follow ' + vm.postData.author.firstName + ' ' + vm.postData.author.lastName,
        icon: 'icon-user-plus',
        action: followUser,
        visible: true,
        allowed: PERMISSION.FEED || PERMISSION.VIEWER
      },
      'UNFOLLOW': {
        title: 'Unfollow ' + vm.postData.author.firstName + ' ' + vm.postData.author.lastName,
        icon: 'icon-user-plus',
        action: unfollowUser,
        visible: true,
        allowed: PERMISSION.FEED || PERMISSION.VIEWER
      },
      'REPORT': {
        title: 'Report post',
        icon: 'icon-user-block',
        action: reportPost,
        visible: true,
        allowed: PERMISSION.FEED
      }
    };

    function openMenu() {
      if (!vm.isMenuOpen) return;
      if (!vm.actionsList) loadUserInfo();
    }

    function loadUserInfo() {
      var userSummary = new baseService()
        .setPath('peacock', '/user/' + vm.postData.author.id + '/summary');

      userSummary.execute().then(function(res) {
        vm.actionsList = actionsList;
        vm.actionsObj = actionsObj;
        beingFollowed(res.followed);
      });
    }

    function beingFollowed(state) {
      vm.actionsObj['FOLLOW'].visible = !state;
      vm.actionsObj['UNFOLLOW'].visible = state;
    }

    // function turnOnNotification() {}

    function deletePost() {}

    function turnOffNotification() {}

    function unfollowUser() {
      bondService
        .unfollowUser(vm.postData.author.id)
        .then(function() {
          beingFollowed(false);
        });
    }

    function followUser() {
      bondService
        .followUser(vm.postData.author.id)
        .then(function() {
          beingFollowed(true);
        });
    }

    function editPost() {}

    function hideUserPost() {}

    function reportPost() {}

    ////////////////////////////
    vm.openMenu = openMenu;
  }
})();
