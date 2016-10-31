(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('DepartmentController', DepartmentController);

    /** @ngInject */
    function DepartmentController(baseService, $stateParams, structureService, $uibModal, toaster, $state) {
        var vm = this;
        getDepartments();

        //FUNCTION DEFINITIONS

        /**
         * Create a new department
         * @param  {string} PostParams     Takes the name of department
         * @return {obj}                   department name and id to a particular function
         */
        function addDepartment() {
            var postParams = {
                name: vm.departmentName
            };
            structureService.addStructure($stateParams.fid, 'DEP', postParams)
                .execute()
                .then(function (res) {
                    vm.departmentsList.push(res);
                    vm.departmentName = '';
                });
        }

        /**
         * loads the list of all departments inside a function
         * @return {obj}                   List of all departments
         */
        function getDepartments() {
            structureService.getStructure($stateParams.fid, 'DEP')
                .execute()
                .then(function (res) {
                    vm.departmentsList = res;
                });
        }


        /**
         * Opens the popup to edit the name of function
         * @param  {string} idx     Takes the current function to edit its name
         * @return [array]            List of the updated funtions
         */
        function editDepartment(idx) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modules/corporateprofile/structure/edit-modal.html',
                controller: 'EditModalController',
                controllerAs: 'vm',
                resolve: {
                    currentFunction: function () {
                        vm.departmentsList[idx].type = "department";
                        vm.departmentsList[idx].paramType = "department";
                        return vm.departmentsList[idx];
                    }
                }
            });
            modalInstance.result.then(function (res) {
                vm.departmentsList[idx] = res;
            });
        }


        /**
         * Opens the popup to delete the department
         * @param  {string} idx     Takes the current department to delete
         * @return [array]          List of the remaining departments in function
         */
        function removeDept(idx) {
            var currentItem = vm.departmentsList[idx];
            structureService.removeStructure(currentItem.id, 'DEP')
                .execute()
                .then(function () {
                    vm.isError = false;
                    vm.departmentsList.splice(idx, 1);
                    toaster.success({ title: "Successfully Deleted!", body: "You have successfully deleted the " + currentItem.name + " Department." });
                }, function (err) {
                    if (err.status == 400) {
                        vm.isError = true;
                        toaster.error({ title: "Cannot Delete!", body: "Move the user to another position before deleting " + currentItem.name + " Department." });
                    }

                });
        }


        /**
         * Opens the popup to edit the name of function
         * @param  {string} idx     Takes the current function to edit its name
         * @return [array]            List of the updated funtions
         */
        function viewDepartmentUsers(idx) {
            var currentOu = vm.departmentsList[idx];
            $state.go('corporate.structure.users', {
                ouid: currentOu.id,
                ouname: currentOu.name,
                outype: 'department'
            });
        }
        

        // FUNCTION ASSIGNMENTS
        vm.addDepartment = addDepartment;
        vm.getDepartments = getDepartments;
        vm.editDepartment = editDepartment;
        vm.removeDept = removeDept;
        vm.viewDepartmentUsers = viewDepartmentUsers;
    }

})();