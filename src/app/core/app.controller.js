(function() {
  'use strict';

  angular
    .module('lollibond.core')
    .controller('AppShellController', AppShellController);

  /** @ngInject */
  function AppShellController($scope, lbUtilService, baseService, socketService) {
    var vm = this;
        vm.openChatThreads = [];
        vm.uIds = [];
        vm.socketService = socketService;

    
    function getThreadDataByUserId(uId){
      if(vm.uIds.indexOf(uId) == -1){
        return new baseService()
          .setPath('pigeon', '/thread/user/' + uId)
            .execute()
            .then(function(response) {
              var chatData = response;
              chatData.uId = uId;

              vm.openChatThreads.push(chatData);
              vm.uIds.push(uId);
            })
      }
    }

    function closeChatBox(uId, tId){
      //Removing userId from uIds array
      var userIdx = vm.uIds.indexOf(uId);
                    vm.uIds.splice(userIdx, 1);

      // Removing Chat Box from openChatThreads
      vm.openChatThreads.forEach(function(obj, idx){
        if(obj.threadId === tId){
          vm.openChatThreads.splice(idx,1);
        }
      })
    }





    // Get All currently open chat Threads 
    /*var threads = lbUtilService.getCurrentThreadIds();
    if (threads) {
        threads = threads.split(',');
        threads.forEach(function(val) {
            var api = new baseService();
            api.setPath('pigeon', '/thread/' + val)
                .execute()
                .then(function(response) {
                    vm.openChatThreads.push(response);
                    console.log(vm.openChatThreads);
                })
        })
    }*/

    // this'll be called on every state change in the app
    $scope.$on('$stateChangeSuccess', function(event, toState) {
      if (angular.isDefined(toState.data.bodyClasses)) {
        vm.bodyClasses = toState.data.bodyClasses;
        vm.styleName = toState.data.styleName;
        return;
      }
    });


    // Function Assignment 
    vm.getThreadDataByUserId = getThreadDataByUserId; 
    vm.closeChatBox = closeChatBox;
  }
})();
