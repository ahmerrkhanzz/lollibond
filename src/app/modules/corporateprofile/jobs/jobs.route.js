(function () {
    'use strict';

    angular
        .module('lollibond.corporateprofile')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
            .state('corporate.jobs', {
                url: '/jobs',
                templateUrl: 'app/modules/corporateprofile/jobs/jobs.html',
                controller: 'JobsController',
                controllerAs: 'vm'
            })
            .state('corporate.jobs.wizard', {
                url: '/wizard',
                templateUrl: 'app/modules/corporateprofile/jobs/jobpost-wizard.html',
                controller: 'JobPostWizardController',
                controllerAs: 'vm'
            })
            .state('corporate.jobs.wizard2', {
                url: '/wizard2',
                templateUrl: 'app/modules/corporateprofile/jobs/jobpost-wizard.html',
                controller: 'JobPostWizardController',
                controllerAs: 'vm'
            });
    }

})();
