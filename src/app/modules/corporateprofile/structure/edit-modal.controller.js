(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('EditModalController', EditModalController);

    /** @ngInject */
    function EditModalController(baseService, $uibModalInstance, toaster, currentFunction, structureService) {
        var vm = this;
        vm.valId = currentFunction.id;
        vm.valName = currentFunction.name;
        vm.heading = currentFunction.type;
        // FUNCTION DEFINITIONS

        /**
         * Submits the new name with PUT call
         * @return [array]            List of the updated funtions
         */
        function modalSubmit() {
            var postParams = {
                id: vm.valId,
                name: vm.valName,
                title: vm.valName
            };
            structureService.submitEditModal(currentFunction.type, postParams)
                .execute()
                .then(function (res) {
                    $uibModalInstance.close(res);
                    toaster.success({ title: "Successfully Updated!", body: "You have successfully updated " + currentFunction.type + " name." });
                });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        // FUNCTION ASIGNMENTS
        vm.modalSubmit = modalSubmit;
        vm.cancel = cancel;
    }
})();