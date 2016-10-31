(function() {
  'use strict';

  angular
    .module('lollibond.companypage')
    .controller('CompanySetupController', CompanySetupController);

  /** @ngInject */
  function CompanySetupController(countries, aboutService, $state) {
    var vm = this;

    vm.model = {};

    // Formly Configuration Model
    vm.fields = [{
        type: 'input',
        key: 'title',
        className: 'col-md-12',
        ngModelElAttrs: {
          class: 'form-control input-xs'
        },
        templateOptions: {
          required: true,
          label: 'Title:',
          maxlength: 100,
          focus: true
        }
      }, {
        type: 'input',
        key: 'industry',
        className: 'col-md-12',
        ngModelElAttrs: {
          class: 'form-control input-xs'
        },
        templateOptions: {
          required: true,
          label: 'Industry:',
          maxlength: 100
        }
      }, {
      fieldGroup: [{
        key: 'location',
        type: 'typeahead',
        className: 'col-md-12',
        templateOptions: {
          label: 'Location',
          options: countries,
          required: true
        }
      }]
    }];

    // Update Company Information
    function updateCompanyProfileInfo() {
      if (vm.form.$valid) {
        /*var postParams = {
          title: vm.model.title,
          industry: vm.model.industry,
          location: vm.model.location
        }*/
        $state.go("personal.companypage.posts");
      }
    }

    //function assignment 
    vm.updateCompanyProfileInfo = updateCompanyProfileInfo;
  }
})();
