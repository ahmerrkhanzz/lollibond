(function() {
  'use strict';

  angular
    .module('lollibond.setup')
    .controller('SetupBasicInformationController', SetupBasicInformationController);

  /** @ngInject */
  function SetupBasicInformationController(countries, aboutService, $state) {
    var vm = this;

    // Adding a day in current date
    var today = new Date();
    today.setDate(today.getDate() - 1);
    vm.model = {};

    // Formly Configuration Model
    vm.fields = [{
      fieldGroup: [{
        key: 'birthdate',
        className: 'col-md-12',
        type: 'datepickerformly',
        templateOptions: {
          label: 'Birth Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy',
          maxDate: today,
          required: true
        }
      }, {
        type: 'select',
        className: 'col-md-12',
        key: 'gender',
        defaultValue: "",
        ngModelElAttrs: {
          class: 'form-control '
        },
        templateOptions: {
          label: 'Gender:',
          required: true,
          options: [{
            name: 'Select Gender',
            value: null
          }, {
            name: 'Male',
            value: 0
          }, {
            name: 'Female',
            value: 1
          }]
        }
      }]
    }, {
      fieldGroup: [{
        key: 'residency',
        type: 'typeahead',
        className: 'col-md-12',
        templateOptions: {
          label: 'Residency',
          options: countries,
          required: true
        }
      }]
    }];

    // Update User Information
    function updateProfileInfo() {
      if (vm.form.$valid) {
        var postParams = {
          gender: vm.model.gender,
          residency: vm.model.residency,
          birthdate: vm.model.birthdate
        }
        var saveProfileInfo = aboutService.updateUser(postParams);
        saveProfileInfo.execute().then(function() {
          $state.go('setup.setupeducation');
        });
      }
    }

    //function assignment 
    vm.updateProfileInfo = updateProfileInfo;
  }

})();
