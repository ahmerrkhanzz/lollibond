(function() {
  'use strict';

  angular
    .module('lollibond.corporateprofile')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('corporate.profile', {
        url: '/profile',
        templateUrl: 'app/modules/corporateprofile/corporateprofile.html',
        controller: 'CorporateProfileController',
        controllerAs: 'vm'
      });
  }

})();
