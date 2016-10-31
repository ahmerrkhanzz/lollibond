(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('FunctionController', FunctionController);

    /** @ngInject */
    function FunctionController(baseService, $uibModal, toaster, structureService, $state) {
        var vm = this;
        vm.selected = 0;
        getFunctions();

        // FUNCTION DEFINITIONS

        /**
         * Create a new function
         * @param  {string} PostParams     Takes the name of function
         * @return {obj}                   function name nad id
         */
        function addFunction() {
            var postParams = {
                name: vm.functionName
            };
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/function')
                .setPostMethod()
                .setPostParams(postParams)
                .execute()
                .then(function () {
                    getFunctions();
                    vm.functionName = '';
                });
        }

        /**
         * loads the list of all functions inside a company
         * @return {obj}                   List of all functions
         */
        function getFunctions() {
            return new baseService()
                .setPath('ray', '/company/' + structureService.companyId + '/functions')
                .execute()
                .then(function (res) {
                    vm.functionsList = res;
                });
        }

        /**
         * Opens the popup to edit the name of function
         * @param  {string} idx     Takes the current function to edit its name
         * @return [array]            List of the updated funtions
         */
        function editFunc(idx) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/modules/corporateprofile/structure/edit-modal.html',
                controller: 'EditModalController',
                controllerAs: 'vm',
                resolve: {
                    currentFunction: function () {
                        vm.functionsList[idx].type = "function";
                        vm.functionsList[idx].paramType = "function";
                        return vm.functionsList[idx];
                    }
                }
            });

            modalInstance.result.then(function (res) {
                vm.functionsList[idx] = res;
            });
        }

        /**
         * Opens the popup to delete the department
         * @param  {string} idx     Takes the current department to delete
         * @return [array]          List of the remaining departments in function
         */
        function removeFunc(idx) {
            var currentItem = vm.functionsList[idx];
            return new baseService()
                .setPath('ray', '/company/function/' + currentItem.id)
                .setDeleteMethod()
                .execute()
                .then(function () {
                    vm.isError = false;
                    vm.functionsList.splice(idx, 1);
                }, function (err) {
                    if (err.status == 400) {
                        vm.isError = true;
                        toaster.error({ title: "Cannot Delete!", body: "Move the user(s) to another position before deleting " + currentItem.name + " Function." });
                    }
                });
        }

        /**
         * Opens the popup to edit the name of function
         * @param  {string} idx     Takes the current function to edit its name
         * @return [array]            List of the updated funtions
         */
        function viewFunctionUsers(idx) {
            var currentOu = vm.functionsList[idx];
            $state.go('corporate.structure.users', {
                ouid: currentOu.id,
                ouname: currentOu.name,
                outype: 'function'
            });
        }

        // FUNCTION ASSIGNMENTS
        vm.addFunction = addFunction;
        vm.getFunctions = getFunctions;
        vm.editFunc = editFunc;
        vm.removeFunc = removeFunc;
        vm.viewFunctionUsers = viewFunctionUsers;
        
    }

})();