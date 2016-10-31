(function() {
  'use strict';

  angular
    .module('lollibond.search')
    .component('advanceFilter', {
      bindings: {
        filterData: '<',
        filtersApplied: '<',
        requestSearch: '&'
      },
      controller: AdvanceFilter,
      controllerAs: 'vm',
      templateUrl: 'app/modules/search/advance-filter/advance-filter.html'
    });

  /** @ngInject */
  function AdvanceFilter(appDataFlowService) {
    var vm = this;

    // Used for making api requests
    // since facet names are different from
    // the ones which are sent to api
    // API_FACETS : REQ_PARAMS/ROUTE_PARAMS
    var facetMaps = {
      keywords: 'keywords',
      firstName: 'firstName',
      lastName: 'lastName',
      locations: 'locationIds',
      industries: 'industryIds',
      colleges: 'schools',
      profileLanguages: 'profileLangageIds',
      currentExp: 'currentCompanies',
      companySize: 'companySizes',
      nonProfitInterests: 'NaN',
      seniorityLevels: 'seniorityLevels',
      workingSince: 'yearsOfExperience',
      memberSince: 'NaN'
    };

    vm.userFrom = {
      keywords: vm.filtersApplied.keywords || undefined,
      firstName: vm.filtersApplied.firstName || undefined,
      lastName: vm.filtersApplied.lastName || undefined
    };

    // Following types are not available in Facet list on get call
    //
    // String title;
    // Date joinDateAfter;
    // List < Integer > relationshipLevels;
    // List < String > pastCompanies;
    // List < Integer > functions;

    // Facet decorated field names for view
    // API_FACETS : VIEW_VALUES
    vm.decoratedFieldName = {
      locations: 'Locations',
      industries: 'Industries',
      colleges: 'Colleges',
      profileLanguages: 'Languages',
      currentExp: 'Current Company',
      companySize: 'Company Size',
      nonProfitInterests: 'Non-Profit Interests',
      seniorityLevels: 'Seniority Level',
      workingSince: 'Working Since',
      memberSince: 'Member Since'
    };

    function searchUser(form) {
      angular.forEach(form, function(value, facet) {
        if (value === '') vm.filtersApplied[facet] = undefined;
        else vm.filtersApplied[facet] = value;
      });

      // Update the keyword value in header search
      appDataFlowService.updateQuery(form['keywords']);

      facetUpdate();
    }

    function toggleFilter(isSelected, facet, value) {
      // Get the maped facet
      facet = facetMaps[facet];

      if (!isSelected.target.checked) {
        removeSelectedFilter(facet, value);
      } else {
        addSelectedFilter(facet, value);
      }

      facetUpdate();
    }

    function addSelectedFilter(facet, value) {
      // Check if facet already exist
      // push in the array
      // else create new array
      if (facet in vm.filtersApplied && angular.isDefined(vm.filtersApplied[facet])) {
        vm.filtersApplied[facet].push(value);
      } else {
        vm.filtersApplied[facet] = [value];
      }
    }

    function removeSelectedFilter(facet, value) {
      // Null check
      if (!vm.filtersApplied[facet]) return false;

      // Get the index of value to be removed
      var idx = vm.filtersApplied[facet].indexOf(value);
      vm.filtersApplied[facet].splice(idx, 1);

      // Remove facet if its empty
      if (vm.filtersApplied[facet].length === 0) vm.filtersApplied[facet] = undefined;
    }

    function isSelectedFilter(facet, value) {
      // Get the maped facet
      facet = facetMaps[facet];

      // Check if facet exist in applied filters obj
      // then check the value in the facet
      if (facet in vm.filtersApplied && angular.isDefined(vm.filtersApplied[facet])) {
        return vm.filtersApplied[facet].indexOf(value) > -1;
      }
      else return false;
    }

    function facetUpdate() {
      var obj = vm.filtersApplied;

      vm.requestSearch({
        page: 1,
        query: obj
      });
    }

    /////////////////////////
    vm.searchUser = searchUser;
    vm.toggleFilter = toggleFilter;
    vm.isSelectedFilter = isSelectedFilter;
  }
})();
