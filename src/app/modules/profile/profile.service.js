(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .factory('profileService', profileService);

  /** @ngInject */
  function profileService(authService) {
    // Service available function declarations
    var service = {
      isLogged: false,
      ownProfile: false,
      isBonded: false,
      isRequested: false,
      isFollowed: false,
      profileId: '',
      checkProfile: checkProfile
    };
    // Return the service object
    return service;

    ////////////////////////////
    function checkProfile(param) {
      if (param === authService.UID) {
        service.ownProfile = true;
      } else {
        service.ownProfile = false;
      }

      // Check if the user is logged in
      if (authService.UID) {
        service.isLogged = true;
      } else {
        authService.isLogged = false;
      }

      service.profileId = param || authService.UID;
    }
  }
})();
