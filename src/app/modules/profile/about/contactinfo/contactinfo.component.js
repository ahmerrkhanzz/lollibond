(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('contactinfo', {
      bindings: {
        content: '<',
        hasdata: "="
      },
      controller: ContactInfoController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/contactinfo/contactinfo.html'
    });

  /** @ngInject */
  function ContactInfoController($window, $http, profileService, AddSection, aboutService, baseService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editPhone = editPhone;
    vm.updatePhone = updatePhone;
    vm.deletePhone = deletePhone;
    vm.addPhone = addPhone;
    vm.copyFields = AddSection.copyFields;
    vm.reset = reset;

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.disabledAddMode = false;
    var origModel = {};
    vm.phoneTypeObj = {};

    // function definition
    vm.model = {};

    vm.fields = [{
      type: 'select',
      key: 'phoneType',
      defaultValue: "",
      className: 'col-xs-6 pl-5 pr-5',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        options: [],
        required: true
      },
      controller: function($scope) {
        var opt = [];
        opt.unshift({
          name: 'Select Phone Type',
          value: ''
        });            
        angular.forEach(vm.phoneTypeObj, function(key, value) {
          this.push({
            name: key,
            value: parseInt(value)
          });
        }, opt);
        $scope.to.options = opt;
      }
    }, {
      type: 'input',
      key: 'number',
      className: 'col-xs-6 pl-5 pr-5',
      ngModelElAttrs: {
        class: 'form-control input-xs',
        placeholder: 'Phone Number'
      },
      templateOptions: {
        focus: true,
        required: true
      },
      validators: {
        phoneNumber: {
          expression: function($viewValue, $modelValue) {
            var value = $modelValue || $viewValue;
            if ($modelValue) {
              var regexPattern = /\+?\d[\d -]{8,12}\d/g;
              return regexPattern.test(value);
            } else {
              return false;
            }
          },
          message: '" Invalid Phone Number "'
        }
      }
    }];

    // Reset function 
    function reset(idx) {
      if(vm.content[idx].id){
        vm.content[idx] = origModel;
        vm.content[idx].isEditable = false;
      }else{
        vm.content.splice(idx, 1);
      }
      vm.disabledAddMode = false;
      if(vm.content.length == 0){
          vm.hasdata = false;
      }
    }

    // CRUD Methods

    /**
     * Create/Update Method of single Phone.
     * @param {int} Array index of Phone Model
     * if phone.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updatePhone(id) {
      if (vm.form.$valid) {
        vm.model = vm.content;
        var phone = vm.model[id];
        
        var postParams = {
          number: phone.number,
          phoneType: phone.phoneType,
          id: phone.id || ''
        };

        if (phone.id) {
          var editPhone = aboutService.updateSection(aboutService.SECTION.PHONE, postParams, phone.id);
          editPhone.execute().then(function() {
            phone.isEditable = false;
            vm.disabledAddMode = false;
          }).then(function() {
            /*return new baseService()
              .setPath('peacock','/user/me/phones/' + phone.id + '/permissions')
              .setPostMethod()
              .setPostParams(vm.selectedPhonePrivacy)
              .execute();*/
          });
        } else {
          var savePhone = aboutService.addSection(aboutService.SECTION.PHONE, postParams);
          savePhone.execute().then(function(response) {
            phone.id = response.id;
            phone.isEditable = false;
            phone.addInProcess = false;
            vm.disabledAddMode = false;
          }).then(function() {
            /*return new baseService()
              .setPath('peacock','/user/me/phones/' + phone.id + '/permissions')
              .setPostMethod()
              .setPostParams(vm.selectedPhonePrivacy)
              .execute();*/
          });
        }
      }
    }

    /**
     * Delete details of a single Phone.
     * @param {int} Array index of Phone Model
     */
    function deletePhone(id) {
      vm.model = vm.content;
      var phone = vm.model[id];

      if (phone.id) {
        var deletePhone = aboutService.deleteSection(aboutService.SECTION.PHONE, phone.id);       
        deletePhone.execute().then(function() {
          vm.model.splice(id, 1);
          vm.disabledAddMode = false;
          if (vm.model.length == 0) {
            vm.hasdata = false;
          }
        });        
      } else {
        vm.model.splice(id, 1);
        vm.disabledAddMode = false;
        if (vm.model.length == 0) {
          vm.hasdata = false;
        }
      }
    }

    /**
     * Edit details of a single Phone.
     * @param {int} Array index of Phone Model
     */
    function editPhone(md) {
      //Saving Data for Reset function
      origModel = angular.copy(md);

      vm.model = vm.content;
      vm.disabledAddMode = true;
      md.isEditable = !md.isEditable;
    }

    /**
     * Add single Phone.
     * @param {int} Array index of Phone Model
     */
    function addPhone() {
      vm.content.push({
        isEditable: true,
        addInProcess: true
      });
      vm.hasdata = true;
      vm.disabledAddMode = true;
    }

    // All phone type
    function getPhoneType() {
      return new baseService()
        .setPath('coral', '/api/v1/phonenumbertype/list/en')
        .execute().then(function(response) {
          vm.phoneTypeObj = response;
        });
    }

    getPhoneType();

    /*** CRUD Methods End***/
  }
})();
