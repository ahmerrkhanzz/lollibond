(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('MoveUserController', MoveUserController);

    /** @ngInject */
    function MoveUserController(baseService, toaster, $stateParams, $uibModalInstance, currentUser, structureService) {
        var vm = this;
        vm.userName = currentUser.user.name;
        vm.userId = currentUser.user.id;
        vm.positionId = currentUser.currentPosition;
        getFunctions();

        // FUNCTION DEFINITIONS

        function modalSubmit() {
            return new baseService()
                .setPath('ray', '/company/position/' + vm.selectedPosOption + '/user/' + vm.userId)
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
        function getFunctions() {
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/functions')
                .execute()
                .then(function (res) {
                    vm.functions = res;
                });
        }

        /**
         * Loads the list of all department inside a particular function
         * @return {object}          Returns the list of departments for a particular function id.
         */
        function getDepartments() {
            return new baseService()
                .setPath('ray', '/company/function/' + vm.selectedFunOption + '/departments')
                .execute()
                .then(function (res) {
                    vm.departments = res;
                });
        }

        function changeFunction(item) {
            vm.selectedFunOption = item;
            getDepartments();
        }

        /**
         * Loads the list of all job families inside a particular department
         * @return {object}          Returns the list of job families for a particular department id.
         */
        function getjobFamilies() {
            return new baseService()
                .setPath('ray', '/company/department/' + vm.selectedDepOption + '/position-families')
                .execute()
                .then(function (res) {
                    vm.jobFamilies = res;
                });
        }

        function changeDepartment(item) {
            vm.selectedDepOption = item;
            getjobFamilies();
        }

        /**
         * Loads the list of all positions inside a particular position family
         * @return {object}          Returns the list of positions for a particular position family id.
         */
        function getPositions() {
            return new baseService()
                .setPath('ray', '/company/position-family/' + vm.selectedJobOption + '/positions')
                .execute()
                .then(function (res) {
                    vm.positions = res;
                });
        }

        function changeJobFamily(item) {
            vm.selectedJobOption = item;
            getPositions();
        }

        function changePosition(item) {
            vm.selectedPosOption = item;
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }



        // FUNCTION ASIGNMENTS
        vm.modalSubmit = modalSubmit;
        vm.getFunctions = getFunctions;
        vm.getDepartments = getDepartments;
        vm.getjobFamilies = getjobFamilies;
        vm.getPositions = getPositions;
        vm.changeFunction = changeFunction;
        vm.changeDepartment = changeDepartment;
        vm.changeJobFamily = changeJobFamily;
        vm.changePosition = changePosition;
        vm.cancel = cancel;

    }
})();
