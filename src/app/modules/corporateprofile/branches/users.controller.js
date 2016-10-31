(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('BranchUsersController', BranchUsersController);

    /** @ngInject */
    function BranchUsersController(baseService, $stateParams, $uibModal, structureService, toaster) {

        var vm = this;
        vm.currentBranch = $stateParams.bid;
        getBranchUsers();
        vm.isError = false;
        getBranch();


        // FUNCTION DEFINITIONS

        // Show list of employees in autocomplete
        function companyEmployeesList($query) {
            var getUsers = new baseService();
            getUsers.setPath('ray', '/company/' + structureService.companyId + '/employees?count=10&cursor=1');
            return getUsers.execute().then(function (response) {
                return response.map(function (user) {
                    return {
                        name: user.firstName + ' ' + user.lastName,
                        id: user.id
                    };
                }).filter(function (user) {
                    return user.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
                });
            });
        }


        /**
         * Add user to the current position
         * @param  {string} user   Takes the object of the current user that is added
         * @return {object}        Name and ID of user to be added
         */
        function addUserToBranch(user) {
            return new baseService()
                .setPath('ray', '/company/branch/' + vm.currentBranch + '/employee/' + user.id)
                .setPostMethod()
                .execute()
                .then(function () {
                    vm.branchUsers.push(user);
                }, function (err) {
                    if (err.status == 400) {
                        vm.isError = true;
                        toaster.error({ title: "Already Added!", body: err.message });
                    }
                });
        }


        /**
         * Loads the list of all the users inside the position
         * @param  {string} user   Takes the object of the current user that is added
         * @return {onject}        Name and ID of user to be added
         */
        function getBranchUsers() {
            return new baseService()
                .setPath('ray', '/company/branch/' + vm.currentBranch + '/employees')
                .execute()
                .then(function (res) {
                    vm.branchUsers = res.map(function (x) {
                        return {
                            name: x.firstName + ' ' + x.lastName,
                            id: x.id
                        };
                    });
                });
        }

        /**
         * Returns the position against a particular user
         * @param  {string} id   Takes the id of the current user and check
         * @return {object}        Name and ID of user to be added
         */
        function errorRemoved() {
            vm.isError = false;
        }

        /**
         * Opens the popup to move the user to another branch
         * @param  {string} idx     Takes the current user to move
         * @param  {string} size    Takes the size of the popup
         * @return [array]          Updated list of remaining users inside current branch
         */
        function moveUser(idx, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modules/corporateprofile/branches/move-user-modal.html',
                controller: 'MoveBranchUserController',
                controllerAs: 'vm',
                size: size,
                resolve: {
                    currentUser: function () {
                        return {
                            currentBranch: vm.currentBranch,
                            user: vm.branchUsers[idx]
                        };
                    }
                }
            });
            modalInstance.result.then(function () {
                getBranchUsers();
            });
        }

        /**
         * Returns the name of the current branch
         */
        function getBranch() {
            return new baseService()
                .setPath('ray', '/company/branch/' + vm.currentBranch)
                .execute()
                .then(function (res) {
                    vm.branchName = res.name;
                });
        }

        
        /**
         * Opens a modal to view user information and assigning permission
         * params {string} size     Takes the size for the modal popup
         * params {string} idx      Takes the current user index
         * @return {object}         Returns the a indexed or current user for v iewing its information/permissions.
         */
        function userInfo(idx, size) {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/modules/corporateprofile/employees/permissions-modal.html',
                controller: 'PermissionsController',
                controllerAs: 'vm',
                size: size,
                resolve: {
                    currentUser: function () {
                        vm.branchUsers[idx].permission = 'CONTENT_MANAGER';
                        vm.branchUsers[idx].currentOu = vm.currentBranch;
                        return vm.branchUsers[idx];
                    }
                }
            });
        }

        // FUNCTION ASIGNMENTS

        vm.companyEmployeesList = companyEmployeesList;
        vm.addUserToBranch = addUserToBranch;
        vm.getBranchUsers = getBranchUsers;
        vm.getBranch = getBranch;
        vm.errorRemoved = errorRemoved;
        vm.moveUser = moveUser;
        vm.userInfo = userInfo;
    }
})();
