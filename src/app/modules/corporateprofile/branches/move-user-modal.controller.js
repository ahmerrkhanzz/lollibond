(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('MoveBranchUserController', MoveBranchUserController);

    /** @ngInject */
    function MoveBranchUserController(baseService, toaster, $stateParams, $uibModalInstance, currentUser, structureService) {
        var vm = this;
        vm.userName = currentUser.user.name;
        vm.userId = currentUser.user.id;
        vm.companyId = structureService.companyId;
        vm.branchId = currentUser.currentBranch;
        getBranches();

        // FUNCTION DEFINITIONS

        function modalSubmit() {
            return new baseService()
                .setPath('ray', '/company/branch/' + vm.selectedBranchOption + '/user/' + vm.userId)
                .setPutMethod()
                .execute()
                .then(function (res) {
                    $uibModalInstance.close(res);
                    toaster.success({ title: "Successfully Updated!", body: "You have successfully moved " + vm.userName });
                });
        }

        /**
         * Loads the list of all functions inside a company
         * @return {object}          Returns the list of functions for a particular company id.
         */
        function getBranches() {
            return new baseService()
                .setPath('ray', '/company/' + vm.companyId + '/branches')
                .execute()
                .then(function (res) {
                    vm.branches = res;
                });
        }

        function changeBranch(item) {
            vm.selectedBranchOption = item;
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        // FUNCTION ASIGNMENTS
        vm.modalSubmit = modalSubmit;
        vm.getBranches = getBranches;
        vm.changeBranch = changeBranch;
        vm.cancel = cancel;

    }
})();
