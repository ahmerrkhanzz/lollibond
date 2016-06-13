(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('WhyMeController', WhyMeController);

  /** @ngInject */
  function WhyMeController($http, countries, $resource, $scope, baseService, $q, profileService, AddSection) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateWhyMe = updateWhyMe;
    vm.copyFields = AddSection.copyFields;

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.addInProcess = false;

    // function definition
    vm.model = {};

    vm.fields = [{
        type: 'textarea',
        key: 'whyMe',
        ngModelElAttrs: {
          class: 'form-control input-xs'
        },
        templateOptions: {
          label: 'Description'
        }
      }];


    // CRUD Methods 

    /**
     * Create/Update Method of single WhyMe.
     * @param  {int} Array index of WhyMe Model  
     * if proInfo.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateWhyMe() {
      console.log(vm.content);
      vm.model = vm.content;
      var postParams = {
        whyMe: vm.content.whyMe
      }
        var saveWhyMe = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/')
          .setPatchMethod()
          .setPostParams(postParams);
          console.log(postParams);
        saveWhyMe.execute().then(function(response) {
          vm.isEditable = false;
          vm.addInProcess = false;
        });
    }

    /**
     * Edit details of a single WhyMe.
     * @param  {int} Array index of WhyMe Model  
     */
    function editForm() {
      vm.model = vm.content;
      vm.isEditable = !vm.isEditable;
    }


    /*** CRUD Methods End***/

  }
})();
