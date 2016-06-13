(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('NetworkController', NetworkController);

  /** @ngInject */
  function NetworkController($resource, baseService, bondService) {
    var vm = this;
    
    // funcation assignment
    vm.getAllUsers = getAllUsers;
    vm.getUsers = getUsers;
    vm.getPendingRequests = getPendingRequests;
    vm.getRequestSent = getRequestSent;
    vm.getFollowers = getFollowers;
    vm.getPeopleIFollow = getPeopleIFollow;

    // variable assignment
    vm.userDetailCollpased = true;

    var getAllUsers = new baseService();
      getAllUsers.setPath('http://localhost:3004/search/');
      getAllUsers.execute().then(function (response) {
        vm.userListType = "All Contacts";
        vm.userList = response;
      });

    /*bondService.loadRequests().then(function(res) {
      vm.requestList = res;
    });*/

    //Get all Bonds
    function getUsers() {
      var getUsers = new baseService();
        getUsers.setPath('http://localhost:3004/search/');
        getUsers.execute().then(function (response) {
          vm.userListType = "All Contacts";
          vm.userList = response;
        });
    }

    //Get all pending requests
    function getPendingRequests() {
      /*var getPendingRequests = new baseService();
        getPendingRequests.setPath('http://localhost:3004/pendingRequest/');
        getPendingRequests.execute().then(function (response) {
          vm.userListType = "Pending Requests";
          vm.userList = response;
        });*/
      bondService.loadRequests().then(function(res) {
        vm.userList = res;
      });
    }

    //Get all requests sent
    function getRequestSent() {
      var getRequestSent = new baseService();
        getRequestSent.setPath('http://localhost:3004/requestSent/');
        getRequestSent.execute().then(function (response) {
          vm.userListType = "Requests Sent";
          vm.userList = response;
        });
    }

    //Get all Followers
    function getFollowers() {
      var getFollowers = new baseService();
        getFollowers.setPath('http://localhost:3004/peopleIFollow/');
        getFollowers.execute().then(function (response) {
          vm.userListType = "Followers";
          vm.userList = response;
        });
    }

    //Get all People I Follow
    function getPeopleIFollow() {
      var getPeopleIFollow = new baseService();
        getPeopleIFollow.setPath('http://localhost:3004/peopleFollowMe/');
        getPeopleIFollow.execute().then(function (response) {
          vm.userListType = "People I Follow";
          vm.userList = response;
        });
    }
    


  }
})();
