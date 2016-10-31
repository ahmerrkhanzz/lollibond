(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('StructureController', StructureController);

    /** @ngInject */
    function StructureController($state, baseService, structureService) {
        var vm = this;
        vm.isFunctions = true;
        getFunctions();
        
        // FUNCTION DEFINITION
        function changeStateToFunction() {
            $state.go('corporate.structure.function');
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
                    if(res.length > 0){
                        vm.functionsList = res;
                        $state.go('corporate.structure.function');
                        vm.isFunctions = false;
                    }
                    else{
                        vm.isFunctions = true;
                        return false;
                    }
                });
        }

        // FUNCTION ASSIGNMENT
        vm.changeStateToFunction = changeStateToFunction;
        vm.getFunctions = getFunctions;

    }
})();