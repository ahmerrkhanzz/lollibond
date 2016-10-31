(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('PermissionsController', PermissionsController);

    /** @ngInject */

    function PermissionsController(baseService, currentUser, $uibModalInstance, structureService, toaster) {
        var vm = this;

        if (currentUser.permission) {
            vm.permissions = ['CONTENT_MANAGER'];
        }
        else {
            vm.permissions = ['USER_MANAGER', 'JOB_POST_MANAGER', 'SUPER_USER'];
        }
        vm.employeeId = currentUser.id;
        vm.firstName = currentUser.firstName;
        vm.lastName = currentUser.lastName;
        vm.email = currentUser.email;
        vm.phone = currentUser.phone;
        vm.userPermissions = [];
        getUserPermissions();
        // getUserFunction();
        // getUserDepartment();
        // getUserJobFamily();
        // getUserPosition();


        // FUNCTION DEFINITIONS

        /**
         * Get the function info for the user
         */
        function getUserFunction() {
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/user/' + currentUser.id + '/function')
                .execute()
                .then(function (res) {
                    vm.userFunction = res;
                });
        }

        /**
         * Get the department info for the user
         */
        function getUserDepartment() {
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/user/' + currentUser.id + '/department')
                .execute()
                .then(function (res) {
                    vm.userDepartment = res;
                });
        }

        /**
         * Get the Job family info for the user
         */
        function getUserJobFamily() {
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/user/' + currentUser.id + '/position-family')
                .execute()
                .then(function (res) {
                    vm.userJobFamily = res;
                });
        }

        /**
         * Get the position info for the user
         */
        function getUserPosition() {
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/user/' + currentUser.id + '/position')
                .execute()
                .then(function (res) {
                    vm.userPosition = res;
                });
        }


        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }



        /**
         * Load permissions list for current user
         */
        function getUserPermissions() {
            if (currentUser.permission) {
                return new baseService()
                    .setPath('ray', '/company/' + structureService.companyId + '/ou/' + currentUser.currentOu + '/user/' + currentUser.id + '/permissions')
                    .execute()
                    .then(function (res) {
                        if (res[currentUser.currentOu] == undefined) {
                            vm.userPermissions = [];
                        }
                        else {
                            vm.userPermissions = res[currentUser.currentOu];
                        }
                    });
            }
            else {
                return new baseService()
                    .setPath('ray', '/company/' + structureService.companyId + '/user/' + currentUser.id + '/permissions')
                    .execute()
                    .then(function (res) {
                        if (res[structureService.companyId] == undefined) {
                            vm.userPermissions = [];
                        }
                        else {
                            vm.userPermissions = res[structureService.companyId];
                        }
                    });
            }

        }

        /**
         * Add permission to current user
         * @param  {string} user   Takes the object of the current user that is added
         * @return {object}        Name and ID of user to be added
         */
        function addPermission() {
            if (currentUser.permission) {
                return new baseService()
                    .setPath('ray', '/company/permission/employee/' + currentUser.id + '/ou/' + currentUser.currentOu)
                    .setPostMethod()
                    .execute()
                    .then(function () {
                        if (vm.userPermissions.indexOf(vm.selectedPermission) == -1) {
                            vm.userPermissions.push(vm.selectedPermission);
                        }
                        else {
                            toaster.error({ title: "Permission Already Assigned!", body: "This permission has already assigned" });
                        }
                    });
            }
            else {
                return new baseService()
                    .setPath('ray', '/company/' + structureService.companyId + '/permission/' + vm.selectedPermission + '/employee/' + currentUser.id)
                    .setPostMethod()
                    .execute()
                    .then(function (res) {
                        if (vm.userPermissions.indexOf(vm.selectedPermission) == -1) {
                            vm.userPermissions.push(vm.selectedPermission);
                        }
                        else {
                            toaster.error({ title: "Permission Already Assigned!", body: "This permission has already assigned" });
                        }
                    });
            }

        }

        function isChangePermission(item) {
            vm.selectedPermission = item;
        }

        /**
         * Remove Permission from the current user
         * @param  {string} idx   Takes the current permission to be removed
         */
        function removePermission(idx) {
            var currentPermission = vm.userPermissions[idx];
            if (currentUser.permission) {
                return new baseService()
                    .setPath('ray', '/company/permission/employee/' + currentUser.id + '/ou/' + currentUser.currentOu)
                    .setDeleteMethod()
                    .execute()
                    .then(function (res) {
                        if (res) {
                            vm.userPermissions.splice(idx, 1);
                        }
                        else {
                            return false;
                        }

                    });
            }
            else {
                return new baseService()
                    .setPath('ray', '/company/' + structureService.companyId + '/permission/' + currentPermission + '/employee/' + currentUser.id)
                    .setDeleteMethod()
                    .execute()
                    .then(function () {
                        vm.userPermissions.splice(idx, 1);
                    });
            }

        }


        function updateName() {
            var postParams = {
                id: vm.employeeId,
                email: vm.email,
                firstName: vm.firstName,
                lastName: vm.lastName,
                phone: vm.phone
            };
            return new baseService()
                .setPath('ray', '/company/employee')
                .setPutMethod()
                .setPostParams(postParams)
                .execute()
                .then(function (res) {
                    $uibModalInstance.close(res);
                    toaster.success({ title: "Successfully Updated!", body: "You have successfully updated the name." });
                });
        }




        // FUNCTION ASSIGNMENT

        vm.getUserFunction = getUserFunction;
        vm.getUserDepartment = getUserDepartment;
        vm.getUserJobFamily = getUserJobFamily;
        vm.getUserPosition = getUserPosition;
        vm.getUserPermissions = getUserPermissions;
        vm.cancel = cancel;
        vm.addPermission = addPermission;
        vm.isChangePermission = isChangePermission;
        vm.removePermission = removePermission;
        vm.updateName = updateName;
    }
})();