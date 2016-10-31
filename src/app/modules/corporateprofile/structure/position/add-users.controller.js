(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('AddUsersController', AddUsersController);

    /** @ngInject */
    function AddUsersController(baseService, toaster, $stateParams, $uibModal, $state, searchService, lbUtilService, structureService) {
        var vm = this;
        vm.positionId = $stateParams.pid;
        getPositionUsers();
        getPosition();
        vm.isError = false;
        var isSearchRedirect = false;

        // FUNCTION DEFINITIONS

        /**
         * Add user to the current position
         * @param  {string} user   Takes the object of the current user that is added
         * @return {object}        Name and ID of user to be added
         */
        function addUserToPosition(user) {
            return new baseService()
                .setPath('ray', '/company/position/' + vm.positionId + '/employee/' + user.id)
                .setPostMethod()
                .execute()
                .then(function () {
                    vm.positionUsers.push(user);
                }, function (err) {
                    if (err.status == 400) {
                        vm.isError = true;
                        toaster.error({ title: "Cannot Assign!", body: "Can not assign position since user already has a position in the company. Please consider changing position." });
                    }
                });
        }

        /**
         * Loads the list of all the users inside the position
         * @param  {string} user   Takes the object of the current user that is added
         * @return {onject}        Name and ID of user to be added
         */
        function getPositionUsers() {
            return new baseService()
                .setPath('ray', '/company/position/' + vm.positionId + '/employees')
                .execute()
                .then(function (res) {
                    vm.positionUsers = res.map(function (x) {
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
         * Opens the popup to edit the name of function
         * @param  {string} idx     Takes the current function to edit its name
         * @return [array]            List of the updated funtions
         */
        function moveUser(idx, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modules/corporateprofile/structure/position/move-user-modal.html',
                controller: 'MoveUserController',
                controllerAs: 'vm',
                size: size,
                resolve: {
                    currentUser: function () {
                        return {
                            currentPosition: vm.positionId,
                            user: vm.positionUsers[idx]
                        };
                    }
                }
            });
            modalInstance.result.then(function () {
                getPositionUsers();
            });
        }

        /**
         * Returns the name of the current position
         */
        function getPosition() {
            return new baseService()
                .setPath('ray', '/company/position/' + vm.positionId)
                .execute()
                .then(function (res) {
                    vm.positionName = res.title;
                });
        }

        function searchUser(query) {
            isSearchRedirect = true;
            $state.go('corporate.search', {
                keywords: query,
                page: 1,
                position: vm.positionId
            });
        }

        function getUsers(query) {
            return searchService.searchUserQuery(1, { keywords: query })
                .then(function (res) {
                    var results = res.results.map(function (item) {
                        return {
                            name: item.user.firstName + " " + item.user.lastName,
                            id: item.user.id,
                            profilePicture: lbUtilService.setProfilePicture(item.user.profilePicture, item.user.gender)
                        };
                    });

                    // First item should not be a user
                    results.unshift({
                        name: query,
                        id: 0
                    });

                    return results;
                })
                .then(function (results) {
                    if (isSearchRedirect) {
                        isSearchRedirect = false;
                        return false;
                    }
                    else return results;
                });
        }

        function redirectToUser(item) {
            if (item.id === 0) {
                searchUser(item.name);
            } else {
                vm.appDataFlowService.searchQuery = '';
                $state.go('personal.profile.posts', { uid: item.id });
            }
        }

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


        

        // FUNCTION ASIGNMENTS
        vm.addUserToPosition = addUserToPosition;
        vm.getPositionUsers = getPositionUsers;
        vm.errorRemoved = errorRemoved;
        vm.moveUser = moveUser;
        vm.getPosition = getPosition;
        vm.searchUser = searchUser;
        vm.redirectToUser = redirectToUser;
        vm.getUsers = getUsers;
        vm.companyEmployeesList = companyEmployeesList;
    }
})();