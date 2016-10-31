(function () {
    'use strict';

    angular
        .module('lollibond.shared')
        .component('lbDatepicker', {
            bindings: {
                data: '<'
            },
            controller: LbDatepickerController,
            controllerAs: 'vm',
            templateUrl: 'app/shared/lb-datepicker/lb-datepicker.html'
        });

    /** @ngInject */
    function LbDatepickerController() {
        var vm = this;

        vm.today = function () {
            vm.dt = new Date();
        };
        vm.today();

        vm.clear = function () {
            vm.dt = null;
        };

        vm.open1 = function () {
            vm.popup1.opened = true;
        };
        vm.popup1 = {
            opened: false
        };
    }

})();