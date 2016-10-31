(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('chatSidebar', {
      bindings:{
        chatOpen: "=",
        openChatBox: "=",
        openThread: "="
      },
      controller: LbSidebarController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/chat-box/chat-sidebar.html'
    });

  function LbSidebarController(baseService, authService, lbUtilService, moment) {
    var vm = this;
        vm.userList = [];
        vm.userOnlineUsers = [];
        vm.recentChats = [];

      function init(){
        getThreads();
      }

      // Show the loader while loading posts
      vm.postsLoading = true;
      var getUsers = new baseService();
      getUsers.setPath('peacock','/user/' + authService.UID + '/bonds?count=10&cursor=1');
      getUsers.execute().then(function(response) {
        vm.userList = response.values.map(function(obj){
          obj.profilePicture = lbUtilService.setProfilePicture(obj.profilePicture, obj.profilePicture.gender);
          return obj;
        });
      })

      //Get Online users 
      var getOnlineUsers = new baseService();
      getOnlineUsers.setPath('pigeon','/getonlinebonds/');
      getOnlineUsers.execute().then(function(response) {
        vm.userOnlineUsers = response.map(function(obj){
          obj.profilePicture = lbUtilService.setProfilePicture(obj.profilePicture, obj.profilePicture.gender);
          return obj;
        });
      })

      function getThreads(){
        return new baseService()
          .setPath('pigeon','/threads/')
          .execute().then(function(response) {
            vm.recentChats = response.map(function(obj){
              obj.participants.map(function(pObj){
                pObj.profilePicture = lbUtilService.setProfilePicture(pObj.profilePicture, pObj.gender);
              });
              return obj;
            })
          });
      }

      // Get timestamp helper function
      function getTimestamp(datetime) {
        return moment(datetime).fromNow()
      }

      init();

      // Function assignment
      vm.getTimestamp = getTimestamp;
      vm.getThreads = getThreads;
  }
})();
