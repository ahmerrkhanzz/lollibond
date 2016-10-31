(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .controller('MainHeaderController', MainHeaderController);

  /** @ngInject */
  function MainHeaderController($scope, $rootScope, $http, $state, authService, bondService, searchService, baseService, lbUtilService, appDataFlowService, $uibModal) {
    var vm = this;
    vm.appDataFlowService = appDataFlowService;
    vm.authService = authService;
    vm.isPortal = 'corporate';
    vm.requestList = {};

    var isSearchRedirect = false;

    // Overriding AuthService user name to summary user name
    var userSummary = new baseService();
    userSummary
      .setPath('peacock', '/user/' + vm.authService.UID + '/summary')
      .execute()
      .then(function(res) {
        vm.authService.user = {
          firstName: res.firstName,
          lastName: res.lastName,
          profilePicture: lbUtilService.setProfilePicture(res.profilePicture, res.gender)
        }
      });

    function switchWorld(portalName) {
      vm.isPortal = portalName;
    }

    function login() {
      authService.login();
    }

    function searchUser(query) {
      isSearchRedirect = true;

      $state.go('personal.search', {
        keywords: query,
        page: 1
      });
    }

    bondService.loadRequests().then(function(res) {
      vm.requestList = res;
    });

    function removeItem(idx) {
      vm.requestList.splice(idx, 1);
    }

    function getUsers(query) {
      return searchService.searchUserQuery(1, { keywords: query })
        .then(function(res) {
          var results = res.results.map(function(item) {
            return {
              name: item.user.firstName + " " + item.user.lastName,
              id: item.user.id,
              profilePicture: lbUtilService.setProfilePicture(item.user.profilePicture, item.user.gender)
            };
          });

          // First item should not be a user
          results.unshift({
            name: query,
            id: 0
          });

          return results;
        })
        .then(function(results) {
          if (isSearchRedirect) {
            isSearchRedirect = false;
            return false;
          }
          else return results;
        });
    }

    function redirectToUser(item) {
      if (item.id === 0) {
        searchUser(item.name);
      } else {
        vm.appDataFlowService.searchQuery = '';
        $state.go('personal.profile.posts', { uid: item.id });
      }
    }

    var stateChange = $rootScope.$on('$stateChangeStart', function(event, toState) {
      // Reset the search query on main-header
      // if redirected to page other then search
      if (toState.name != 'personal.search') {
        vm.appDataFlowService.searchQuery = '';
      }
    });

    function recentBuildNumber() {
      // Random string for cache busting
      // Generates a 21 char random string
      var randStr = Math.random().toString(36).substring(7);

      $http.get("peacock_build_info.json?q=" + randStr).then(function(res) {
        vm.recentBuildNumber = res.data.buildNumber;
      });
    }

    recentBuildNumber();

    $scope.$on('$destroy', function() {
      stateChange();
    });

    // Open create company modal
      function openModal() {

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/modules/corporateprofile/create-company-modal.html',
          controller: 'CreateCompanyModalController',
          controllerAs: 'vm',
          resolve: {
                newCompany: function () {
                    return false;
                }
            }
        });

        modalInstance.result.then(function (res) {
            $state.go('corporate.profile', { cid : res.id });
        });
      }

    ////////////////////////////////////
    vm.switchWorld = switchWorld;
    vm.logout = authService.logout;
    vm.login = login;
    vm.searchUser = searchUser;
    vm.removeItem = removeItem;
    vm.getUsers = getUsers;
    vm.redirectToUser = redirectToUser;
    vm.openModal = openModal;
  }
})();
