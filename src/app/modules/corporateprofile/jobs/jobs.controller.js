(function () {
    'use strict';

    angular
        .module('lollibond.corporateprofile')
        .controller('JobsController', JobsController);

    /** @ngInject */
    function JobsController($state) {
        var vm = this;
        vm.isJobs = true;

        // FUNCTION DEFINITIONS

        function changeStateToJobs() {
            $state.go('corporate.jobs.wizard');
        }

        // FUNCTION ASSIGNMENTS
        vm.changeStateToJobs = changeStateToJobs;
    }
})();