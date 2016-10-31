(function() {
  'use strict';

  angular
    .module('lollibond.search')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('personal.search', {
        url: '/search?keywords?firstName?lastName&yearsOfExperience&currentCompanies&schools&locationIds&relationshipLevels&industryIds&pastCompanies&functions&seniorityLevels&companySizes&profileLangageIds&page',
        templateUrl: 'app/modules/search/search.html',
        controller: 'SearchController',
        controllerAs: 'vm',
        resolve: {
          pageTitle: function() { return 'Search | lollibond';}
        },
        reloadOnSearch: true,
        params: {
          // Facet names which are set in the API
          currentCompanies: {
            array: true
          },
          schools: {
            array: true
          },
          locationIds: {
            array: true
          },
          relationshipLevels: {
            array: true
          },
          industryIds: {
            array: true
          },
          pastCompanies: {
            array: true
          },
          functions: {
            array: true
          },
          seniorityLevels: {
            array: true
          },
          companySizes: {
            array: true
          },
          profileLangageIds: {
            array: true
          },
          page: '1'
        }
      })
      .state('corporate.search', {
        url: '/search?position?keywords',
        templateUrl: 'app/modules/corporateprofile/structure/position/search-user.html',
        controller: 'SearchUserController',
        controllerAs: 'vm',
        resolve: {
          pageTitle: function() { return 'Search | lollibond';}
        },
        reloadOnSearch: true
        
      });
  }

})();
