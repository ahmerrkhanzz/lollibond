(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('BranchesController', BranchesController);

    /** @ngInject */
    function BranchesController(baseService, $uibModal, $state, toaster, structureService) {
        var vm = this;
        getBranchesList();

        // FUNCTION DEFINITIONS

        /**
         * Opens a modal to create a new branch
         * params {string} size     Takes the size for the modal popup
         * @return {object}         Returns the new created branch and updated list of all branches inside a company.
         */
        function openBranchModal(size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modules/corporateprofile/branches/create-branch-modal.html',
                controller: 'CreateBranchModalController',
                controllerAs: 'vm',
                size: size,
                resolve: {
                    currentBranch: function () {
                        return true;
                    }
                }
            });
            modalInstance.result.then(function() {
                getBranchesList();
            });
        }

        /**
         * Opens a modal to edit a branch
         * params {string} size     Takes the size for the modal popup
         * params {string} idx      Takes the current branch to edit
         * @return {object}         Returns updated list of all branches inside a company.
         */
        function editBranchModal(idx, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modules/corporateprofile/branches/create-branch-modal.html',
                controller: 'CreateBranchModalController',
                controllerAs: 'vm',
                size: size,
                resolve: {
                    currentBranch: function () {
                        return vm.branchesList[idx];
                    }
                }
            });
            modalInstance.result.then(function () {
                getBranchesList();
            });
        }




        /**
         * Loads the list of all branches inside a company
         * @return {object}         Returns updated list of all branches inside a company.
         */
        function getBranchesList() {
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/branches')
                .execute()
                .then(function (res) {
                    vm.branchesList = res;
                });
        }

        /**
         * Opens the popup to delete the branch
         * @param  {string} idx     Takes the current branch to delete
         * @return [array]          List of the remaining branches in company
         */
        function removeBranch(idx) {
            var currentItem = vm.branchesList[idx];
            // vm.branchesList.splice(idx, 1);
            return new baseService()
                .setPath('ray', '/company/branch/' + currentItem.id)
                .setDeleteMethod()
                .execute()
                .then(function () {
                    vm.isError = false;
                    vm.branchesList.splice(idx, 1);
                    toaster.success({ title: "Successfully Delete!", body: "You have successfully deleted the  " + currentItem.name });
                }, function (err) {
                    if (err.status == 400) {
                        vm.isError = true;
                        toaster.error({ title: "Cannot Delete!", body: "Move the user to another branch before deleting " + currentItem.name });
                    }

                });
        }


        function addUsers(idx) {
            var currentBranch = vm.branchesList[idx];
            $state.go('corporate.branches.users', { bid: currentBranch.id});
        }



        // FUNCTION ASSIGNMENTS
        vm.openBranchModal = openBranchModal;
        vm.editBranchModal = editBranchModal;
        vm.getBranchesList = getBranchesList;
        vm.removeBranch = removeBranch;
        vm.addUsers = addUsers;
    }

})();