(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('lbChatBox', {
      bindings: {
        threadData: '<',
        closeChatBox: '='
      },
      controller: LbChatBoxController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/chat-box/chat.html'
    });

  /** @ngInject */
  function LbChatBoxController($scope, socketService, baseService, authService, $log, lbUtilService, $element, $timeout, moment) {
    var vm = this;
    vm.authService = authService;
    vm.chatCollapsed = true;
    vm.chatData = [];
    vm.socketService = socketService;
    vm.loadingChat = false;
    vm.isChatDataAvailable = true;
    var socket = null;
    var chatList = $element.find('.chat-list');

    // View Variable Changes - For Hide/Show
    vm.isChatDeleting = false;
    vm.isMessageDeleting = false;
    vm.showDeleteIcon = false;

    // Setup Socket listener when chat box rendered 
    vm.socketService.socket.then(function(res){
      socket = res;
      socket.on('chat', function(data) {
        if(data.threadId === vm.threadData.threadId){
          var msgData = {
            from: data.from,
            message: data.message,
            timestamp: data.timestamp
          }
          if(msgData.message){
            msgData.from.profilePicture = lbUtilService.setProfilePicture(msgData.from.profilePicture, msgData.from.gender);
            lbUtilService.safeApply.call($scope, function() {
              vm.chatData.push(msgData);
              scrollToBottom();
            });
          }
        }
      });
    })

    function init(){
      getMessagesByThreadId(vm.threadData.threadId)
        .then(function(res){
          vm.chatData = res.slice().reverse();
        })
        .finally(function(){
          scrollToBottom();
        });
    }

    /*
     * CRUD Methods  (Retrieving / Create / Delete) Messages
     */

    function getMessagesByThreadId(threadId, ts){
      // If last ID is not there forward empty string
      ts = ts || '';

      return new baseService()
            .setPath('pigeon','/thread/' + threadId + '/messages')
            .setGetParams({ ts: ts })
            .execute()
            .then(function(response) {
              // Setting profile picture for each message
              response.map(function(obj){
                obj.from.profilePicture = lbUtilService.setProfilePicture(obj.from.profilePicture, obj.from.gender);
                return obj;
              });
              return response;
            })
    }

    function submit() { 
      var emitParams = {
        message: vm.sendData,
        threadId: vm.threadData.threadId
      };
      var chatPostParams = {
        message: vm.sendData,
        timestamp: new Date().toISOString(),
        from: {
          id: vm.authService.UID,
          firstName: vm.authService.user.firstName,
          lastName: vm.authService.user.lastName,
          profilePicture: vm.authService.user.profilePicture
        }
      }
      // Emit chat message to Socket Server
      //Push Data into View
      if(vm.sendData){
        socket.emit('chat', emitParams);
        vm.chatData.push(chatPostParams);
        vm.sendData = null;
        scrollToBottom();
      }
    }

    //Delete entire message from the conversation
    function deleteChat(tId){
      vm.isChatDeleting = true;
      vm.chatData = [];
      return new baseService()
            .setPath('pigeon','/thread/'+ tId +'/deletethread/')
            .setPostMethod()
            .execute()
            .then(function() {
              vm.isChatDeleting = false;
            });
    }


    // Delete Single message from the conversation
    function deleteMessage(ts, idx){
      vm.isMessageDeleting = true;
      return new baseService()
            .setPath('pigeon','/thread/'+ vm.threadData.threadId +'/deletemessage/' + ts)
            .setPostMethod()
            .execute()
            .then(function() {
              vm.chatData.splice(idx, 1);
              vm.isMessageDeleting = false;
            });
    }


    /*
     * Scroll Events and Methods on scroll 
     */

    function scrollToBottom(){
      $timeout(function() {
        chatList.scrollTop(chatList[0].scrollHeight);
      }, 0, false);
    }
    
    function checkScroll(){
      var el = chatList[0];
      if(el.scrollTop === 0){
        vm.loadingChat = true;
        var currentScrollHeight = el.scrollHeight;

        // Get last Message Data for next http call
        var lastMessage = vm.chatData[0];

        // If Data not available Stop here
        if(vm.isChatDataAvailable === false){
          return false;
        }else{
          getMessagesByThreadId(vm.threadData.threadId, lastMessage.timestamp)
          .then(function(res){
            if(res.length > 0){
              var prevChat = res.slice().reverse();
              vm.chatData.unshift(prevChat);
              vm.chatData = [].concat.apply([], vm.chatData);

              $timeout(function() {
                chatList.scrollTop(el.scrollHeight - currentScrollHeight);
              }, 0, false);

              // Hide Loader 
              vm.loadingChat = false;
            }else{
              vm.loadingChat = false;
              vm.isChatDataAvailable = false;
            }

          });
        }
      }
    }

    // Get timestamp helper function
    function getTimestamp(datetime) {
      return moment(datetime).fromNow()
    }

    // Remove bindings and events
    function cleanup() {
      chatList.off("scroll", checkScroll);
    }

    
    chatList.on("scroll", checkScroll);
    // Clean up which remove Remove bindings on destroy
    $scope.$on('$destroy', cleanup);

    init();

    vm.submit = submit;
    vm.deleteChat = deleteChat;
    vm.getTimestamp = getTimestamp;
    vm.deleteMessage = deleteMessage;
  }
})();
