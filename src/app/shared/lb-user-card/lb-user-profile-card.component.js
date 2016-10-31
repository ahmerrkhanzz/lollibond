(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('lbUserProfileCard', {
      controller: lbUserProfileCardController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/lb-user-card/lb-user-profile-card.html'
    });

  /** @ngInject */
  function lbUserProfileCardController(baseService, lbUtilService) {
    var vm = this;

    var getProfileData = new baseService()
      .setPath('peacock', '/user/me/');

    getProfileData
      .execute()
      .then(function(response) {
        var profilePic = response.profilePicture ? response.profilePicture.key : null;

        vm.userData = response;
        vm.profilePicture = lbUtilService.setProfilePicture(profilePic, response.gender);
      });
  }
})();
