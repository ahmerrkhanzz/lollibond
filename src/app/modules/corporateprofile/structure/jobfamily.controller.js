(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('JobFamilyController', JobFamilyController);

    function JobFamilyController(baseService, $stateParams, structureService, $uibModal, toaster) {
        var vm = this;
        getJobFamilies();

        //FUNCTION DEFINITIONS

        /**
         * Create a new job family
         * @param  {string} PostParams     Takes the name of job family
         * @return {obj}                   job family name and id to a particular department
         */
        function addJobFamily() {
            var postParams = {
                name: vm.jobFamilyName
            };
            structureService.addStructure($stateParams.did, 'JOB', postParams)
                .execute()
                .then(function (res) {
                    vm.jobFamiliesList.push(res);
                    vm.jobFamilyName = '';
                });
        }

        /**
         * loads the list of all job families inside a department
         * @return {obj}                   List of all job families
         */
        function getJobFamilies() {
            structureService.getStructure($stateParams.did, 'JOB')
                .execute()
                .then(function (res) {
                    vm.jobFamiliesList = res;
                });
        }

        /**
         * Opens the popup to edit the name of function
         * @param  {string} idx     Takes the current function to edit its name
         * @return [array]            List of the updated funtions
         */
        function editJobFamily(idx) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modules/corporateprofile/structure/edit-modal.html',
                controller: 'EditModalController',
                controllerAs: 'vm',
                resolve: {
                    currentFunction: function () {
                        vm.jobFamiliesList[idx].type = "position-family";
                        vm.jobFamiliesList[idx].paramType = "positionFamily";
                        return vm.jobFamiliesList[idx];
                    }
                }
            });

            modalInstance.result.then(function (res) {
                vm.jobFamiliesList[idx] = res;
            });
        }

        /**
         * Opens the popup to delete the position
         * @param  {string} idx     Takes the current position to delete
         * @return [array]          List of the remaining positions in job family
         */
        function removeJobFamily(idx) {
            var currentItem = vm.jobFamiliesList[idx];
            structureService.removeStructure(currentItem.id, 'JOB')
                .execute()
                .then(function () {
                    vm.isError = false;
                    vm.jobFamiliesList.splice(idx, 1);
                    toaster.success({ title: "Successfully Deleted!", body: "You have successfully deleted the " + currentItem.name + " Position Family." });
                }, function (err) {
                    if (err.status == 400) {
                        vm.isError = true;
                        toaster.error({ title: "Cannot Delete!", body: "Move the user to another position before deleting " + currentItem.name + " Position Family" });
                    }
                });
        }

        // FUNCTION ASSIGNMENTS
        vm.addJobFamily = addJobFamily;
        vm.getJobFamilies = getJobFamilies;
        vm.editJobFamily = editJobFamily;
        vm.removeJobFamily = removeJobFamily;


    }
})();