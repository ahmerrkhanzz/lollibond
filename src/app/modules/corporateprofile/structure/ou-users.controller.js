(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('OuUsersController', OuUsersController);

    /** @ngInject */

    function OuUsersController($stateParams, baseService, $uibModal) {
        var vm = this;
        vm.ouid = $stateParams.ouid;
        vm.ouName = $stateParams.ouname;
        vm.ouType = $stateParams.outype;
        getOuUsers();

        // FUNCTION DEFINITIONS

        /**
         * loads the list of all users inside a organizational unit
         * @return {obj}                   List of all users
         */
        function getOuUsers() {
            return new baseService()
                .setPath('ray', '/company/' + vm.ouType + '/' + vm.ouid + '/employees')
                .execute()
                .then(function (res) {
                    vm.ouUsers = res.map(function (x) {
                        return {
                            name: x.firstName + ' ' + x.lastName,
                            id: x.id
                        };
                    });
                });
        }

        /**
         * Opens a modal to view user information and assigning permission
         * params {string} size     Takes the size for the modal popup
         * params {string} idx      Takes the current user index
         * @return {object}         Returns the a indexed or current user for v iewing its information/permissions.
         */
        function oUContentPermission(idx, size) {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/modules/corporateprofile/employees/permissions-modal.html',
                controller: 'PermissionsController',
                controllerAs: 'vm',
                size: size,
                resolve: {
                    currentUser: function () {
                        vm.ouUsers[idx].permission = 'CONTENT_MANAGER';
                        vm.ouUsers[idx].currentOu = vm.ouid;
                        return vm.ouUsers[idx];
                    }
                }
            });
        }


        // FUNCTION ASSIGNMENTS
        vm.getOuUsers = getOuUsers;
        vm.oUContentPermission = oUContentPermission;
    }
})();