(function () {
  'use strict';

  angular
    .module('lollibond.search')
    .controller('SearchUserController', SearchUserController);

  /** @ngInject */
  function SearchUserController($stateParams, $state, $window, searchService, baseService, toaster, lbUtilService) {
    var vm = this;
    getPositionUsers();

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
        .then(function (res) {
          var lastPage = Math.ceil(res.totalCount / 10);

          if (searchPage > lastPage && lastPage != 0) {
            requestSearch(lastPage, searchQuery);
          }
          res.results.forEach(function (x) {
            vm.profilePicture = lbUtilService.setProfilePicture(x.user.profilePicture, x.user.gender);
          });
          vm.peopleList = res;
        }.bind(searchPage));
    }

    function updateUrl(page, query) {
      query.page = page;

      $state.go('corporate.search', query, {
        notify: false
      });

      // Scroll to top on search update
      $window.scrollTo(0, 0);
    }

    init();

    /**
     * Add user to the current position
     * @param  {string} userObj   Takes the object of the current user that is added
     * @return {object}           Name and ID of user to be added
     */
    function assignPosition(userObj) {
      return new baseService()
        .setPath('ray', '/company/position/' + $stateParams.position + '/user/' + userObj.id)
        .setPostMethod()
        .execute()
        .then(function () {
          vm.assignBtn = false;
          vm.positionUsers.push(userObj);
          toaster.success({ title: "Successfully Assigned", body: "Successfully assigned the position to " + userObj.name });
        }, function (err) {
          if (err.status == 400) {
            vm.isError = true;
            vm.assignBtn = true;
            toaster.error({ title: "Already Assigned", body: err.message });
          }
        });
    }

    /**
     * Loads the list of all the users inside a position
     */
    function getPositionUsers() {
      return new baseService()
        .setPath('ray', '/company/position/' + $stateParams.position + '/employees')
        .execute()
        .then(function (res) {
          vm.positionUsers = res.map(function (x) {
            return {
              name: x.firstName + ' ' + x.lastName,
              id: x.id
            };
          });
        });
    }

    


    /////////////////////////////////
    vm.requestSearch = requestSearch;
    vm.isArray = angular.isArray;
    vm.getPositionUsers = getPositionUsers;
    vm.assignPosition = assignPosition;
  }
})();
