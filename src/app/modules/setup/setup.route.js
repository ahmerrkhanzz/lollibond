(function() {
  'use strict';

  angular
    .module('lollibond.setup')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('setup', {
        url: '/setup-personal',
        templateUrl: 'app/modules/setup/setup.html',
        controller: 'SetupController',
        controllerAs: 'vm',
        abstract: true,
        data: {
          bodyClasses: 'bg-white',
          styleName: ''
        }
      })
      .state('setup.basicinformation', {
        url: '/basic-information',
        templateUrl: 'app/modules/setup/setupbasicinformation/setupbasicinformation.html',
        controller: 'SetupBasicInformationController',
        controllerAs: 'vm'
      })
      .state('setup.setupeducation', {
        url: '/education',
        templateUrl: 'app/modules/setup/setupeducation/setupeducation.html',
        controller: 'SetupEducationController',
        controllerAs: 'vm'
      })
      .state('setup.setupexperience', {
        url: '/experience',
        templateUrl: 'app/modules/setup/setupexperience/setupexperience.html',
        controller: 'SetupExperienceController',
        controllerAs: 'vm'
      })
      .state('setup.setupskill', {
        url: '/skills',
        templateUrl: 'app/modules/setup/setupskill/setupskill.html',
        controller: 'SetupSkillController',
        controllerAs: 'vm'
      })
      .state('setup.setupcontact', {
        url: '/contact',
        templateUrl: 'app/modules/setup/setupcontact/setupcontact.html',
        controller: 'SetupContactController',
        controllerAs: 'vm'
      })
      
  }

})();
