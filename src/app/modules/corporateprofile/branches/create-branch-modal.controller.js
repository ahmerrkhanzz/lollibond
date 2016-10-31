(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('CreateBranchModalController', CreateBranchModalController);

    /** @ngInject */
    function CreateBranchModalController(baseService, $uibModalInstance, toaster, currentBranch, structureService) {
        var vm = this;


        // FUNCTION DEFINITION

        if (currentBranch !== true) {
            vm.branchId = currentBranch.id;
            vm.branchName = currentBranch.name;
        }

        /**
         * Submit the updated branch name
         * @return {object}         Returns updated list of all branches inside a company.
         */
        function branchSubmit() {
            var postParams = {
                id: vm.branchId,
                name: vm.branchName
            };
            if (currentBranch !== true) {
                return new baseService()
                    .setPath('ray', '/company/branch')
                    .setPatchMethod()
                    .setPostParams(postParams)
                    .execute()
                    .then(function (res) {
                        $uibModalInstance.close(res)
                        toaster.success({ title: "Successfully Updated!", body: "You have successfully updated company branch." });
                    });
            }
            else {
                return new baseService()
                    .setPath('ray', '/company/' + structureService.companyId + '/branch')
                    .setPostMethod()
                    .setPostParams(postParams)
                    .execute()
                    .then(function (res) {
                        $uibModalInstance.close(res)
                        toaster.success({ title: "Successfully Created!", body: "You have successfully created company branch." });
                    });
            }
        }

        // HIDE MODAL
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        // FUNCTION ASIGNMENTS
        vm.branchSubmit = branchSubmit;
        vm.cancel = cancel;

    }
})();