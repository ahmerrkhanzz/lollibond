(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('NetworkController', NetworkController);

  /** @ngInject */
  function NetworkController(baseService, $stateParams, profileService, bondService) {
    var vm = this;

    // Loader variable
    vm.postsLoading = true;

    // User List type
    var CONSTANTS = {
      ALL_CONTACTS: "All Contacts",
      PENDING_REQUEST: "Pending Requests",
      REQUEST_SENT: "Sent Requests",
      PEOPLE_FOLLOW: "People I Follow",
      FOLLOWERS: "Followers"
    };
    
    // User List type for empty data
    var EMPTY_CONSTANTS = {
      ALL_CONTACTS: "No Contacts To Display",
      PENDING_REQUEST: "No Pending Requests",
      REQUEST_SENT: "No Sent Requests",
      PEOPLE_FOLLOW: "People I Follow",
      FOLLOWERS: "Followers"
    };

    vm.activeTab = $stateParams.activeTab || 0;

    // variable assignment
    vm.userDetailCollpased = true;

    // Check if uid is of the logged-in user
    vm.profileService = profileService;

    var networkTabs = [{
      label: CONSTANTS.ALL_CONTACTS,
      action: getBondsbyId,
      visible: true,
      active: false
    }, {
      label: CONSTANTS.PENDING_REQUEST,
      action: getPendingRequests,
      visible: profileService.ownProfile,
      active: false
    }, {
      label: CONSTANTS.REQUEST_SENT,
      action: getRequestSent,
      visible: profileService.ownProfile,
      active: false
    }, {
      label: CONSTANTS.PEOPLE_FOLLOW,
      action: getFollowers,
      visible: false, // Feature not enabled
      active: false
    }, {
      label: CONSTANTS.FOLLOWERS,
      action: getPeopleIFollow,
      visible: false, // Feature not enabled
      active: false
    }];

    function showActiveTab(tabIndex) {
      networkTabs[tabIndex].active = true;
      networkTabs[tabIndex].action();
    }

    //Get Bond types
    var getBondTypes = new baseService();
      getBondTypes.setPath('peacock','/user/bond-types/');
      getBondTypes.execute().then(function(response) {
          vm.bondtypes = response;
      });

    //Get Bonds by Id
    function getBondsbyId() {
      // Show the loader while loading posts
      vm.postsLoading = true;
      var getUsers = new baseService();
      getUsers.setPath('peacock','/user/' + profileService.profileId + '/bonds?count=10&cursor=1');
      getUsers.execute().then(function(response) {
        vm.userList = response.values;
        vm.activeTab = 0;
        vm.userList.type = CONSTANTS.ALL_CONTACTS;          
        if(vm.userList.length == 0){          
          vm.userListEmptConstant = EMPTY_CONSTANTS.ALL_CONTACTS;
        }
      })
      .finally(function() {
        // Hide the loader
        vm.postsLoading = false;
      });
    }

    //Get all pending requests
    function getPendingRequests() {
      // Show the loader while loading posts
      vm.postsLoading = true;
      bondService.loadRequests().then(function(response) {
        vm.userList = response;
        vm.activeTab = 1;
        vm.userList.type = CONSTANTS.PENDING_REQUEST;
        if(vm.userList.length == 0){          
          vm.userListEmptConstant = EMPTY_CONSTANTS.PENDING_REQUEST;
        }
      })
      .finally(function() {
        // Hide the loader
        vm.postsLoading = false;
      });
    }

    //Get all requests sent
    function getRequestSent() {
      // Show the loader while loading posts
      vm.postsLoading = true;
      bondService.bondRequestsSent().then(function(response) {
        vm.userList = response;
        vm.activeTab = 2;
        vm.userList.type = CONSTANTS.REQUEST_SENT;
        if(vm.userList.length == 0){          
          vm.userListEmptConstant = EMPTY_CONSTANTS.REQUEST_SENT;
        }
      })
      .finally(function() {
        // Hide the loader
        vm.postsLoading = false;
      });
    }

    function removeItem(idx) {
      vm.userList.splice(idx, 1);
    }

    //Get all Followers
    function getFollowers() {
      var getFollowers = new baseService();
      getFollowers.setPath('peacock','http://172.16.18.60:3004/peopleFollowMe/');
      getFollowers.execute().then(function(response) {
        vm.userList = response;
        vm.activeTab = 3;
        vm.userList.type = CONSTANTS.FOLLOWERS;
        if(vm.userList.length == 0){          
          vm.userListEmptConstant = EMPTY_CONSTANTS.FOLLOWERS;
        }
      });
    }

    //Get all People I Follow
    function getPeopleIFollow() {
      var getPeopleIFollow = new baseService();
      getPeopleIFollow.setPath('peacock','http://172.16.18.60:3004/peopleIFollow/');
      getPeopleIFollow.execute().then(function(response) {
        vm.userList = response;
        vm.activeTab = 4;
        vm.userList.type = CONSTANTS.PEOPLE_FOLLOW;
        if(vm.userList.length == 0){          
          vm.userListEmptConstant = EMPTY_CONSTANTS.PEOPLE_FOLLOW;
        }
      });
    }

    showActiveTab(vm.activeTab);

    // funcation assignment
    vm.networkTabs = networkTabs;
    vm.getBondsbyId = getBondsbyId;
    vm.getPendingRequests = getPendingRequests;
    vm.getRequestSent = getRequestSent;
    vm.removeItem = removeItem;
  }
})();
