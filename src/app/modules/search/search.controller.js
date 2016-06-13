(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('SearchController', SearchController);

  /** @ngInject */
  function SearchController($http) {
    var vm = this;

    $http.get('http://localhost:3004/search/')
      .then(function(res) {
        vm.peopleList = res.data;
      });
  }
})();
