(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('BranchDashboardController', BranchDashboardController);

    /** @ngInject */
    function BranchDashboardController($state, baseService, structureService) {
        var vm = this;
        vm.isBranches = true;
        getBranchesList();

        // FUNCTION DEFINITION
        function changeStateToBranch() {
            $state.go('corporate.branches.addBranch');
        }


        /**
         * Loads the list of all branches inside a company
         * @return {object}       Returns updated list of all branches inside a company.
         */
        function getBranchesList() {
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/branches')
                .execute()
                .then(function (res) {
                    if(res.length > 0){
                        vm.branchesList = res;
                        $state.go('corporate.branches.addBranch');
                        vm.isBranches = false;
                    }
                    else{
                        vm.isBranches = true;
                        return false;
                    }
                });
        }

        // FUNCTION ASSIGNMENT
        vm.changeStateToBranch = changeStateToBranch;
        vm.getBranchesList = getBranchesList;

    }
})();