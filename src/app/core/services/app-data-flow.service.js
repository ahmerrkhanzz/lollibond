(function() {
  'use strict';

  angular
    .module('lollibond.core')
    .factory('appDataFlowService', appDataFlowService);

  /** @ngInject */
  function appDataFlowService() {
    var service = {
      searchQuery: '',
      updateQuery: updateQuery
    };
    // Service available function declarations
    return service;

    function updateQuery(query) {
      service.searchQuery = query;
    }
  }
})();
