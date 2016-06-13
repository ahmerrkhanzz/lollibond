(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('SeminarWorkshopController', SeminarWorkshopController);

  /** @ngInject */
  function SeminarWorkshopController() {
    var vm = this;

    // funcation assignment

    // variable assignment
    vm.options = {};

    init();

    vm.originalFields = angular.copy(vm.fields);

    // function definition
    

    function init() {
      vm.model = {};


      vm.fields = [
        {
          type: 'formly',
          key: 'SeminarWorkshop',
          templateOptions: {
            addAnother: true,
            btnText:'Seminar Workshop',
            fields: [
              {
                type: 'input',
                key: 'SeminarWorkshopTitle',
                ngModelElAttrs: {
                  class: 'form-control input-xs'
                },
                templateOptions: {
                  required: true,
                  label: 'Title:'
                }
              },
              {
                type: 'textarea',
                key: 'SeminarWorkshopDescription',
                ngModelElAttrs: {
                  class: 'form-control input-xs'
                },
                templateOptions: {
                  label: 'Description'
                }
              }
            ]
          }

        }
      ];
    }

  }
})();
