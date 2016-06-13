(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('lbUserCard', {
      bindings: {
        cardData: '<'
      },
      controller: LbUserCardController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/lb-user-card/lb-user-card.html'
    });

  /** @ngInject */
  function LbUserCardController() {
    // var vm = this;
  }
})();
