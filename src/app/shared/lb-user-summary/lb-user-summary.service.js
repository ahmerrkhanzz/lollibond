(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .factory('userSummaryService', userSummaryService);

  /** @ngInject */
  function userSummaryService() {
    var service = {
      isData: {},
      loadedUsers: {},
      popupStyles: {},
      isFollowed: false,
      isBonded: false,
      isRequested: false,
      isReceived: false,
      loggedInUserId: '',
      hidePopup: hidePopup,
      cover: null
    };

    function hidePopup() {
      var styles = {
        transform: 'translate(-1000px, -1000px)',
        visibility: 'hidden'
      };

      service.popupStyles = styles;
    }

    return service;
  }
})();
