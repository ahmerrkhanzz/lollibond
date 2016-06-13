(function() {
  'use strict';

  angular
    .module('lollibond.feed')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('personal.feed', {
        url: '/feed',
        templateUrl: 'app/modules/feed/feed.html',
        controller: 'FeedController',
        controllerAs: 'vm',
        onEnter: ['authService', function(authService) {
          authService.verifyAuth();
        }]
      })
  }

})();
