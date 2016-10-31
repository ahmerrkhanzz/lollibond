(function () {
  'use strict';

  angular
    .module('lollibond.corporateprofile')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('corporate.structure', {
        url: '/structure',
        templateUrl: 'app/modules/corporateprofile/structure/structure.html',
        controller: 'StructureController',
        controllerAs: 'vm'
      })
      .state('corporate.structure.function', {
        url: '/f',
        templateUrl: 'app/modules/corporateprofile/structure/function.html',
        controller: 'FunctionController',
        controllerAs: 'vm'
      })
      .state('corporate.structure.function.department', {
        url: '/:fid',
        templateUrl: 'app/modules/corporateprofile/structure/department.html',
        controller: 'DepartmentController',
        controllerAs: 'vm'
      })
      .state('corporate.structure.function.department.jobfamily', {
        url: '/d/:did',
        templateUrl: 'app/modules/corporateprofile/structure/jobfamily.html',
        controller: 'JobFamilyController',
        controllerAs: 'vm'
      })
      .state('corporate.structure.function.department.jobfamily.position', {
        url: '/j/:jid',
        templateUrl: 'app/modules/corporateprofile/structure/position/position.html',
        controller: 'PositionController',
        controllerAs: 'vm'
      })
      .state('corporate.structure.addUser', {
        url: '/p/:pid',
        templateUrl: 'app/modules/corporateprofile/structure/position/add-users.html',
        controller: 'AddUsersController',
        controllerAs: 'vm'
      })
      .state('corporate.structure.users', {
        url: '/:ouid/users?ouname&?outype',
        templateUrl: 'app/modules/corporateprofile/structure/ou-users.html',
        controller: 'OuUsersController',
        controllerAs: 'vm'
      });
  }

})();
