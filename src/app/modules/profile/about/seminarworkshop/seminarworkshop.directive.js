(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('seminarWorkshop', {
      bindings: {
        content: '<'
      },
      controller: SeminarWorkshopController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/seminarworkshop/seminarworkshop.html'
    });

  /** @ngInject */
  function SeminarWorkshopController() {
    var vm = this;

    vm.options = {};

    init();

    vm.originalFields = angular.copy(vm.fields);

    function init() {
      vm.model = {};

      vm.fields = [{
        type: 'formly',
        key: 'SeminarWorkshop',
        templateOptions: {
          addAnother: true,
          btnText: 'Seminar Workshop',
          fields: [{
            type: 'input',
            key: 'SeminarWorkshopTitle',
            ngModelElAttrs: {
              class: 'form-control input-xs'
            },
            templateOptions: {
              required: true,
              label: 'Title:',
              maxlength: 100
            }
          }, {
            type: 'textarea',
            key: 'SeminarWorkshopDescription',
            ngModelElAttrs: {
              class: 'form-control input-xs'
            },
            templateOptions: {
              label: 'Description',
              maxlength: 500
            }
          }]
        }
      }];
    }
  }
})();
