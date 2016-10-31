(function () {
    'use strict';

    angular
        .module('lollibond.shared')
        .component('lbTimepicker', {
            bindings: {
                currentTime: '='
            },
            controller: LbTimepickerController,
            controllerAs: 'vm',
            template: '<div uib-timepicker ng-model="vm.mytime" ng-change="vm.changed()" hour-step="vm.hstep" minute-step="vm.mstep" show-meridian="vm.ismeridian"></div>'
        });

    /** @ngInject */
    function LbTimepickerController() {
        var vm = this;

        // vm.mytime = new Date();
        vm.hstep = 1;
        vm.mstep = 15;
        vm.ismeridian = true;
        vm.toggleMode = function () {
            vm.ismeridian = !vm.ismeridian;
        };

        // Fucntion definition
        function changed(){
            vm.currentTime = vm.mytime;
        }

        //function assignment
        vm.changed = changed;

    }

})();