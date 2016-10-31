(function() {
  'use strict';

  angular
    .module('lollibond.search')
    .controller('SearchController', SearchController);

  /** @ngInject */
  function SearchController($stateParams, $state, $window, searchService) {
    var vm = this;
    vm.selectedFilters = [];

    // Constant for search results at one time
    vm.currentPage = parseInt($stateParams.page) || 1;

    function init() {
      vm.selectedFilters = $stateParams;

      requestSearch();
    }

    function requestSearch(page, query) {
      var searchPage = page || vm.currentPage;
      var searchQuery = query || vm.selectedFilters;

      // Covert the page number to positive
      searchPage = Math.abs(searchPage);

      vm.currentPage = searchPage;
      updateUrl(searchPage, searchQuery);

      searchService.searchUserQuery(searchPage, searchQuery)
        .then(function(res) {
          var lastPage = Math.ceil(res.totalCount / 10);

          if (searchPage > lastPage && lastPage != 0) {
            requestSearch(lastPage, searchQuery);
          }

          vm.peopleList = res;
        }.bind(searchPage));
    }

    function updateUrl(page, query) {
      query.page = page;
      
      $state.go('personal.search', query, {
        notify: false
      });

      // Scroll to top on search update
      $window.scrollTo(0, 0);
    }

    function removeFacet(facet, value) {
      // Null check
      if (!vm.selectedFilters[facet]) return false;

      // Get the index of value to be removed
      var idx = vm.selectedFilters[facet].indexOf(value);
      vm.selectedFilters[facet].splice(idx, 1);

      // Remove facet if its empty
      if (vm.selectedFilters[facet].length === 0) vm.selectedFilters[facet] = undefined;

      requestSearch(1, vm.selectedFilters);
    }

    init();

    /////////////////////////////////
    vm.requestSearch = requestSearch;
    vm.isArray = angular.isArray;
    vm.removeFacet = removeFacet;
  }
})();
