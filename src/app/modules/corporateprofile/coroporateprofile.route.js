(function () {
  'use strict';

  angular
    .module('lollibond.corporateprofile')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('corporate.profile', {
        url: '/profile',
        params: {
          cid: '-9003547651299343360'
        },
        templateUrl: 'app/modules/corporateprofile/corporateprofile.html',
        controller: 'CorporateProfileController',
        controllerAs: 'vm'
      })
      .state('corporate.branches', {
        url: '/branches',
        templateUrl: 'app/modules/corporateprofile/branches/branches-dashboard.html',
        controller: 'BranchDashboardController',
        controllerAs: 'vm'
      })
      .state('corporate.branches.addBranch', {
        url: '/addBranches',
        templateUrl: 'app/modules/corporateprofile/branches/branches.html',
        controller: 'BranchesController',
        controllerAs: 'vm'
      })
      .state('corporate.branches.users', {
        url: '/:bid/users',
        templateUrl: 'app/modules/corporateprofile/branches/users.html',
        controller: 'BranchUsersController',
        controllerAs: 'vm'
      })
      .state('corporate.employees', {
        url: '/employees',
        templateUrl: 'app/modules/corporateprofile/employees/employees.html',
        controller: 'EmployeesController',
        controllerAs: 'vm'
      });
  }

})();
