(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('ProfileController', ProfileController);

  /** @ngInject */
  function ProfileController($stateParams, $http, $state, profileService, authService, bondService) {
    var vm = this;
    var paramId = !$stateParams.uid ? authService.UID : $stateParams.uid;

    // Check for the UID in params
    // If no UID is there, use logged-in UID
    profileService.checkProfile(paramId);

    // Check if uid is of the logged-in user
    vm.profileService = profileService;

    function init() {
      if (profileService.ownProfile) {
        executeLoggedUser();
      } else {
        executeOtherUser();
      }
    }

    function executeLoggedUser() {
      $http.get('http://dev1.bond.local:9999/user/me').then(function(res) {
        vm.username = res.data.firstName + ' ' + res.data.lastName;
      });
    }

    function executeOtherUser() {
      $http.get('http://dev1.bond.local:9999/user/' + paramId).then(function(res) {
        vm.username = res.data.firstName + ' ' + res.data.lastName;
      });

      // Check for bonded state
      bondService.getBond(profileService.profileId).then(function(res) {
        if (res[0]) {
          vm.profileService.isBonded = true;
        } else {
          vm.profileService.isBonded = false;
        }
      });

      // Check for bonded state
      bondService.isFollowing(profileService.profileId).then(function(res) {
        if (res) {
          vm.profileService.isFollowed = true;
        } else {
          vm.profileService.isFollowed = false;
        }
      });
    }

    function unbondUser() {
      bondService.deleteBond(profileService.profileId).then(function() {
        vm.profileService.isBonded = false;
        vm.profileService.isFollowed = false;
      });
    }

    function bondUser() {
      bondService.bondRequest(profileService.profileId).then(function() {
        vm.profileService.isRequested = true;
      });
    }

    function cancelRequest() {
      bondService.deleteRequest(profileService.profileId).then(function() {
        vm.profileService.isRequested = false;
      })
    }

    function unfollowUser() {
      bondService.unfollowUser(profileService.profileId).then(function() {
        vm.profileService.isFollowed = false;
      });
    }

    function followUser() {
      bondService.followUser(profileService.profileId).then(function() {
        vm.profileService.isFollowed = true;
      });
    }

    // Profile navigation collapse on small device
    vm.navbarCollapsed = true;

    // Profile navigation tabs
    vm.tabs = [{
      title: 'Post',
      icon: 'icon-magazine',
      route: 'personal.profile.posts'
    }, {
      title: 'About',
      icon: 'icon-insert-template',
      route: 'personal.profile.about'
    }, {
      title: 'Network',
      icon: 'icon-collaboration',
      route: 'personal.profile.network'
    }, {
      title: 'Gallery',
      icon: 'icon-images3',
      route: 'personal.profile.gallery'
    }, {
      title: 'Recent Activities',
      icon: 'icon-droplets',
      route: 'personal.profile.activities'
    }];
    vm.activeTab = 0;

    // ace button
    vm.aceUser = {
      individualAce: true,
      corporateAce: false,
      academicAce: false,
      individualAceCount: 200,
      corporateAceCount: 122,
      academicAceCount: 365,
      individualBond: true,
      corporateBond: false,
      academicBond: true
    };

    init();

    //////////////////////////////
    vm.bondUser = bondUser;
    vm.unbondUser = unbondUser;
    vm.cancelRequest = cancelRequest;
    vm.followUser = followUser;
    vm.unfollowUser = unfollowUser;
    vm.unbondUser = unbondUser;
  }
})();
