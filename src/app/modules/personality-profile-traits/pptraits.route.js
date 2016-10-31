(function() {
  'use strict';

  angular
    .module('lollibond.pptraits')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('personal.pptraits', {
        url: '/personality-profile-traits-instruction',
        templateUrl: 'app/modules/personality-profile-traits/pptraits-instruction.html',
        controller: 'PPTraitsController',
        controllerAs: 'vm'
      })
      .state('personal.pptraitsassessment', {
        url: '/personality-profile-traits-assessment',
        templateUrl: 'app/modules/personality-profile-traits/pptraits-assessment.html',
        controller: 'PPTraitsController',
        controllerAs: 'vm'
      })
  }
})();
