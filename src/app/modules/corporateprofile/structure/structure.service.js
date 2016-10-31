(function () {
    'use strict';

    angular
        .module('lollibond.profile')
        .service('structureService', structureService);

    /** @ngInject */

    function structureService(baseService) {

        // DEFINING CONSTANTS
        var STRUCT_CONS = {
            FUN: {
                forAdd: 'function',
                forGet: 'functions',
                parent: 'company'
            },
            DEP: {
                forAdd: 'department',
                forGet: 'departments',
                parent: 'function'
            },
            JOB: {
                forAdd: 'position-family',
                forGet: 'position-families',
                parent: 'department'
            },
            POS: {
                forAdd: 'position',
                forGet: 'positions',
                parent: 'position-family'
            }

        };

        // FUNCTION DEFINITION

        /**
         * Create a new department/job family/position
         * @param  {string} id      Takes the id of the parent to add its child
         * @param  {obj} type       Takes the type either addding department/function/job family/position
         * @param  {obj} paramObj   Takes the post parameteres
         * @return {obj}            Instance of baseservice for POST call.
         */
        function addStructure(id, type, paramObj) {
            return new baseService()
                .setPath('ray', '/company/' + STRUCT_CONS[type].parent + '/' + id + '/' + STRUCT_CONS[type].forAdd)
                .setPostMethod()
                .setPostParams(paramObj);
        }

        /**
        * Get list of department/job family/position
        * @param  {string} id      Takes the id of the parent to add its child
        * @param  {obj} type       Takes the type either getting list of  department/function/job family/position
        * @return {obj}            Instance of baseservice for GET call.
        */
        function getStructure(id, type) {
            return new baseService()
                .setPath('ray', '/company/' + STRUCT_CONS[type].parent + '/' + id + '/' + STRUCT_CONS[type].forGet);
        }


        /**
        * Create a new department/job family/position
        * @param  {string} id      Takes the id of the current item to delete
        * @param  {obj} type       Takes the type either addding department/function/job family/position
        * @return {obj}            Instance of baseservice for DELETE call.
        */
        function removeStructure(id, type) {
            return new baseService()
                .setPath('ray', '/company/' + STRUCT_CONS[type].forAdd + '/' + id)
                .setDeleteMethod();
        }


        /**
        * Get list of department/job family/position
        * @param  {string} id      Takes the id of the parent to add its child
        * @param  {obj} type       Takes the type either getting list of  department/function/job family/position
        * @return {obj}            Instance of baseservice for GET call.
        */

        function submitEditModal(type, paramObj) {
            return new baseService()
                .setPath('ray', '/company/' + type)
                .setPutMethod()
                .setPostParams(paramObj);
        }


        //  FUNCTION ASSSIGNMENT AND RETURN

        return {
            addStructure: addStructure,
            getStructure: getStructure,
            removeStructure: removeStructure,
            submitEditModal: submitEditModal,
            companyId: '-9003547651299343360'
        };

    }
})();