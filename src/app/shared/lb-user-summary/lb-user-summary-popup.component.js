(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('userSummaryPopup', {
      controller: UserSummaryPopupController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/lb-user-summary/lb-user-summary-popup.html'
    });

  /** @ngInject */
  function UserSummaryPopupController(userSummaryService, bondService) {
    var vm = this;

    vm.userSummaryService = userSummaryService;
    
    function unbondUser(userId) {
      bondService
        .deleteBond(userId)
        .then(function() {
          vm.userSummaryService.isBonded = false;
          vm.userSummaryService.isFollowed = false;
          return userId;
        })
        .then(updateLoadedData);
    }

    function bondUser(userId) {
      bondService
        .bondRequest(userId).then(function() {
          vm.userSummaryService.isRequested = true;
          return userId;
        })
        .then(updateLoadedData);
    }

    function cancelRequest(userId) {
      bondService
        .deleteRequest(userId)
        .then(function() {
          vm.userSummaryService.isRequested = false;
          return userId;
        })
        .then(updateLoadedData);
    }

    function unfollowUser(userId) {
      bondService
        .unfollowUser(userId)
        .then(function() {
          vm.userSummaryService.isFollowed = false;
          return userId;
        })
        .then(updateLoadedData);
    }

    function followUser(userId) {
      bondService
        .followUser(userId)
        .then(function() {
          vm.userSummaryService.isFollowed = true;
          return userId;
        })
        .then(updateLoadedData);
    }

    function approveRequest(userId) {
      bondService
        .bondRequest(userId, bondService.requestType.ACCEPT)
        .then(function() {
          vm.userSummaryService.isReceived = false;
          vm.userSummaryService.isBonded = true;
          return userId;
        })
        .then(updateLoadedData);
    }

    function rejectRequest(userId) {
      bondService
        .bondRequest(userId, bondService.requestType.REJECT)
        .then(function() {
          vm.userSummaryService.isReceived = false;
          vm.userSummaryService.isBonded = false;
          return userId;
        })
        .then(updateLoadedData);
    }

    function updateLoadedData(userId) {
      if (!vm.userSummaryService.loadedUsers[userId]) {
        return false;
      }
      vm.userSummaryService.loadedUsers[userId].followed = vm.userSummaryService.isFollowed;
      vm.userSummaryService.loadedUsers[userId].cover = vm.userSummaryService.cover;
      vm.userSummaryService.loadedUsers[userId].bondTypes.length = vm.userSummaryService.isBonded ? 1 : 0;
      vm.userSummaryService.loadedUsers[userId].requestSent = vm.userSummaryService.isRequested;
      vm.userSummaryService.loadedUsers[userId].requestRecieved = vm.userSummaryService.isReceived;
    }

    /////////////////////////////
    vm.bondUser = bondUser;
    vm.unbondUser = unbondUser;
    vm.cancelRequest = cancelRequest;
    vm.followUser = followUser;
    vm.unfollowUser = unfollowUser;
    vm.unbondUser = unbondUser;
    vm.rejectRequest = rejectRequest;
    vm.approveRequest = approveRequest;
  }
})();
