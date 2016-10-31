(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('PositionController', PositionController);

    /** @ngInject */
    function PositionController(baseService, $stateParams, structureService, $uibModal, toaster, $state) {
        var vm = this;
        vm.isError = false;
        getPositions();

        //FUNCTION DEFINITIONS

        /**
         * Create a new position
         * @param  {string} PostParams     Takes the name of position
         * @return {obj}                   position name and id to a particular job family
         */
        function addPosition() {
            var postParams = {
                title: vm.positionName
            };
            structureService.addStructure($stateParams.jid, 'POS', postParams)
                .execute()
                .then(function (res) {
                    vm.positionsList.push(res);
                    vm.positionName = '';
                });
        }

        /**
         * loads the list of all positions inside a job family
         * @return {obj}                   List of all positions
         */
        function getPositions() {
            structureService.getStructure($stateParams.jid, 'POS')
                .execute()
                .then(function (res) {
                    vm.positionsList = res;
                });
        }

        /**
         * Opens the popup to edit the name of function
         * @param  {string} idx     Takes the current function to edit its name
         * @return [array]            List of the updated funtions
         */
        function editPosition(idx) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modules/corporateprofile/structure/edit-modal.html',
                controller: 'EditModalController',
                controllerAs: 'vm',
                resolve: {
                    currentFunction: function () {
                        vm.positionsList[idx].type = "position";
                        vm.positionsList[idx].paramType = "position";
                        return vm.positionsList[idx];
                    }
                }
            });
            modalInstance.result.then(function (res) {
                vm.positionsList[idx] = res;
            });
        }

        /**
         * Opens the popup to delete the position
         * @param  {string} idx     Takes the current position to delete
         * @return [array]          List of the remaining positions in job family
         */
        function removePosition(idx) {
            var currentItem = vm.positionsList[idx];
            structureService.removeStructure(currentItem.id, 'POS')
                .execute()
                .then(function () {
                    vm.isError = false;
                    vm.positionsList.splice(idx, 1);
                    toaster.success({ title: "Successfully Deleted!", body: "You have successfully deleted the " + currentItem.name + " Position." });
                }, function (err) {
                    if (err.status == 400) {
                        vm.isError = true;
                        toaster.error({ title: "Cannot Delete!", body: "Move the user to another position before deleting " + currentItem.title + " Position" });
                    }
                    else if (err.status == 401) {
                        toaster.error({ title: "Cannot Delete!", body: err.message });
                    }
                });
        }

        /**
         * Opens the popup to edit the name of function
         * @param  {string} idx     Takes the current function to edit its name
         * @return [array]            List of the updated funtions
         */
        function addUsers(idx) {
            var currentPosition = vm.positionsList[idx];
            $state.go('corporate.structure.addUser', { pid: currentPosition.id }, { relative: $state.$current });
        }

        // FUNCTION ASSIGNMENTS
        vm.addPosition = addPosition;
        vm.getPositions = getPositions;
        vm.editPosition = editPosition;
        vm.removePosition = removePosition;
        vm.addUsers = addUsers;
    }

})();