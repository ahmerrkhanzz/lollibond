(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('EmployeesController', EmployeesController);

    /** @ngInject */

    function EmployeesController(baseService, $stateParams, structureService, $uibModal, toaster) {
        var vm = this;
        vm.isFunction = false;
        vm.isDepartment = false;
        getCompanyUsers();
        getFunctions();

        // FUNCTION DEFINITIONS

        /**
         * Loads the list of all the users inside the company
         * @param  {string} user   Takes the object of the current user that is added
         * @return {onject}        Name and ID of user to be added
         */
        function getCompanyUsers() {
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/employees')
                .execute()
                .then(function (res) {
                    vm.companyUsers = res;
                });
        }


        /**
         * Loads the list of all functions inside a company
         * @return {object}          Returns the list of functions for a particular company id.
         */
        function getFunctions() {
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/functions')
                .execute()
                .then(function (res) {
                    vm.functions = res;
                });
        }

        function isChangeFunction(fn) {
            vm.selectedFunction = fn;
            vm.isDepartment = true;
            getDepartments();
        }

        /**
         * Loads the list of all department inside a particular function
         * @return {object}          Returns the list of departments for a particular function id.
         */
        function getDepartments() {
            return new baseService()
                .setPath('ray', '/company/function/' + vm.selectedFunction + '/departments')
                .execute()
                .then(function (res) {
                    vm.departments = res;
                });
        }

        function isChangeDepartment(dep) {
            vm.selectedDepartment = dep;
            getDepartments();
        }


        /**
         * Opens a modal to view user information and assigning permission
         * params {string} size     Takes the size for the modal popup
         * params {string} idx      Takes the current user index
         * @return {object}         Returns the a indexed or current user for v iewing its information/permissions.
         */
        function addPermission(idx) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modules/corporateprofile/employees/permissions-modal.html',
                controller: 'PermissionsController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: function () {
                        return vm.companyUsers[idx];
                    }
                }
            });
            modalInstance.result.then(function () {
                getCompanyUsers();
            });
        }

        function addEmployee() {
            var postParams = {
                email: vm.email,
                firstName: vm.firstName,
                lastName: vm.lastName,
                phone: vm.phone
            };
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/employee')
                .setPostMethod()
                .setPostParams(postParams)
                .execute()
                .then(function (res) {
                    vm.companyUsers.push(res);
                    vm.reset();
                    toaster.success({ title: "Successfully Added!", body: "You have successfully added " + res.firstName + " " + res.lastName + " to company." });
                });
        }

        function reset() {
            vm.email = null;
            vm.firstName = null;
            vm.lastName = null;
            vm.phone = null;
        }


        // FUNCTION ASSIGNMENTS
        vm.getCompanyUsers = getCompanyUsers;
        // vm.isChangeFilter = isChangeFilter;
        vm.getFunctions = getFunctions;
        vm.isChangeFunction = isChangeFunction;
        vm.getDepartments = getDepartments;
        vm.isChangeDepartment = isChangeDepartment;
        vm.addPermission = addPermission;
        vm.addEmployee = addEmployee;
        vm.reset = reset;

    }
})();