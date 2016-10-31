(function() {
  'use strict';

  angular
    .module('lollibond.search')
    .component('lbUserCard', {
      bindings: {
        cardData: '<',
        epsnData: '='
      },
      controller: LbUserCardController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/search/lb-search-card/lb-search-card.html'
    });

  /** @ngInject */
  function LbUserCardController(lbUtilService) {
    var vm = this;

    // If Profile Picture Empty, Set Placeholder according to Gender
    vm.profilePicture = lbUtilService.setProfilePicture(vm.cardData.user.profilePicture, vm.cardData.user.gender);
  }
})();
