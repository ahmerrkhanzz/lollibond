(function() {
  'use strict';

  angular
    .module('lollibond')
    .service('lbUtilService', lbUtilService);

  /** @ngInject */
  function lbUtilService($cookies, $log) {
    var allChatThreads = [];
    return {
      setProfilePicture: setProfilePicture,
      safeApply: safeApply,
      urlEncode: urlEncode,
      addChatBox: addChatBox,
      getCurrentThreadIds: getCurrentThreadIds,
      deleteChatBox: deleteChatBox
    }

    /////////////////////////////////
    /**
     * This is a mixin to be called by passing a scope as 'this'. This is until angular makes the safeApply official.
     * Example: utilService.safeApply.call($scope, function () {});
     * @param fn
     */
    function safeApply(fn) {
      /* eslint angular/no-private-call: 0 */
      var phase = this.$root.$$phase;
      if (phase === '$apply' || phase === '$digest') {
        if (fn.isFunction) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    }

    function setProfilePicture(profilePicture, gender) {
      var placeholder = '';
      // In case profilePicture is undefined
      profilePicture = profilePicture || '';

      if (profilePicture == '' && gender == 1) {
        placeholder = 'assets/images/dummy/users/placeholder-f.jpg';
      } else if (profilePicture == '') {
        placeholder = 'assets/images/dummy/users/placeholder-m.jpg';
      } else {
        placeholder = profilePicture;
      }
      return placeholder;
    }

    function urlEncode(url){
      return encodeURIComponent(url);
    }

    /////////////////////////////////
    /**
     * This is a function used to Get all the Open Current chat boxes which is saved in the localStorage.
     * Example: utilService.getCurrentChatBoxes();
     * Return: []    List of currentChatThreads
     */

    // Current Local Chatboxes
    function getCurrentThreadIds(){
        //STORING THREAD ID in LOCAL STORAGE
        var currentLocalThreads = $cookies.get('chatThreads');
        if(currentLocalThreads){
          return currentLocalThreads;
        }
    }

    //Add Chat Box
    function addChatBox(threadId){
      allChatThreads.push(threadId);
      $log.log(allChatThreads);
      $cookies.put('chatThreads', allChatThreads);
    }

    //Delete Chat Box
    function deleteChatBox(){
    /*   var aa = allChatThreads.split(',').indexOf(threadId);
      $log.log(aa);
     allChatThreads.push(threadId);
      $cookies.put('chatThreads', allChatThreads);*/
    }
    
  }
})();
