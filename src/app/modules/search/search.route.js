(function() {
  'use strict';

  angular
    .module('lollibond.search')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('personal.search', {
        url: '/search',
        templateUrl: 'app/modules/search/search.html',
        controller: 'SearchController',
        controllerAs: 'vm'
      })
  }

})();
