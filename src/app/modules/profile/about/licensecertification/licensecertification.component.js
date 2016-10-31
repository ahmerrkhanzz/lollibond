(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('licenseCertification', {
      bindings: {
        content: '<',
        hasdata: "="
      },
      controller: LicenseCertificationController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/licensecertification/licensecertification.html'
    });

  /** @ngInject */
  function LicenseCertificationController($window, profileService, AddSection, aboutService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateCertifications = updateCertifications;
    vm.deleteCertifications = deleteCertifications;
    vm.addCertificationsModel = addCertificationsModel;
    vm.copyFields = AddSection.copyFields;
    vm.reset = reset;

    vm.dateInit = {
      from: '',
      to: ''
    }

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.disabledAddMode = false;
    var today = new Date();  
    var minDate = '';
    var origModel = {};

    // function definition
    vm.model = {};

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
      key: 'number',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        required: true,
        label: 'Number:',
        maxlength: 100
      }
    }, {
      type: 'input',
      key: 'authority',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Authority:',
        maxlength: 100
      }
    }, {
      type: 'input',
      key: 'url',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Website:',
        maxlength: 100
      },
      validators: {
        urlAddress: {
          expression: function($viewValue, $modelValue) {
            var value = $modelValue || $viewValue;
            if($modelValue){
              var regexPattern = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@%_\+.~#?&//=]*)/g;
              return regexPattern.test(value);
            }else{
              return true;
            }
          },
          message: '" Invalid URL "'
        }
      }
    }, {
      fieldGroup: [{
        key: 'fromDate',
        className: 'col-md-12',
        type: 'datepickerformly',
        templateOptions: {
          label: 'Start Date',
          required: true,
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy',
          maxDate: today
        },
        expressionProperties: {
          'templateOptions.maxDate': 'model.toDate'
        },
        validators: {
          beforeEnd: {
            //expression: '$modelValue > today',
            expression: function(viewValue, modelValue){
              return modelValue < today;
            },
            message: '$viewValue + " cannot be set for future!"'
          }
        },
        controller: function($scope) {
          $scope.to.datepickerOptions.initDate = vm.dateInit.from;
        }
      }, {
      key: 'certificationExpires',
      type: 'checkbox',
      className: 'col-md-12',
      templateOptions: {
        label: 'Expires'
      }
    },{
        key: 'toDate',
        type: 'datepickerformly',
        className: 'col-md-12',
        templateOptions: {
          required: true,
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy',
          minDate: minDate,
          //this houdl override datepicker format on formlyConfig and it did
          datepickerOptions: {
            format: 'dd-MMMM-yyyy'
          }
        },
        hideExpression: function (viewValue, modelValue, scope) {
          if(!scope.model.certificationExpires){
            scope.model.toDate = '';
          }
          return !scope.model.certificationExpires;
        },
        expressionProperties: {
          'templateOptions.minDate': 'model.fromDate',
          'templateOptions.disabled': '!model.fromDate'
        },
        controller: function($scope) {
          $scope.to.datepickerOptions.initDate = vm.dateInit.to;
        }
      }]
    }];

    // Reset function 
    function reset(idx) {
      if(vm.content[idx].data.id){
        vm.content[idx] = origModel;
        vm.content[idx].data.isEditable = false;
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
     * Create/Update Method of single Certifications.
     * @param  {int} Array index of Certifications Model
     * if cert.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateCertifications(id) {
      if (vm.form.$valid) {
        vm.model = vm.content;
        var cert = vm.model[id];
        if(!cert.data.certificationExpires){
            cert.data.toDate = '';
          }
        var postParams = {
          title: cert.data.title,
          authority: cert.data.authority,
          number: cert.data.number,
          url: cert.data.url,
          fromDate: cert.data.fromDate,
          toDate: cert.data.toDate,
          expires: cert.data.expires,
          id: cert.data.id || ''
        };
        if (cert.data.id) {
          var editCertifications = aboutService.updateSection(aboutService.SECTION.CERTIFICATIONS, postParams, cert.data.id);
          editCertifications.execute().then(function() {
            cert.isEditable = false;
            vm.disabledAddMode = false;
          });
        } else {
          var saveCertifications = aboutService.addSection(aboutService.SECTION.CERTIFICATIONS, postParams);
          saveCertifications.execute().then(function(response) {
            cert.data.id = response.id;
            cert.isEditable = false;
            cert.addInProcess = false;
            vm.disabledAddMode = false;
          });
        }
      }
    }

    /**
     * Delete details of a single Certifications.
     * @param  {int} Array index of Certifications Model
     */
    function deleteCertifications(id) {
      vm.model = vm.content;
      var cert = vm.model[id];
      if (cert.data.id) {
        var delCertifications = aboutService.deleteSection(aboutService.SECTION.CERTIFICATIONS, cert.data.id);        
        delCertifications.execute().then(function() {
          vm.model.splice(id, 1);
          vm.disabledAddMode = false;
          if(vm.model.length == 0){
            vm.hasdata = false;
          }
        });        
      } else {
        vm.model.splice(id, 1);
        vm.disabledAddMode = false;
        if(vm.model.length == 0){
          vm.hasdata = false;
        }
      }
    }

    /**
     * Edit details of a single Certifications.
     * @param  {int} Array index of Certifications Model
     */
    function editForm(md) {
      //Saving Data for Reset function
      origModel = angular.copy(md);

      vm.dateInit = {
        from: new Date(md.data.fromDate),
        to:  new Date() || new Date(md.data.toDate)
      };

      vm.disabledAddMode = true;
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
      if(md.data.toDate != null){
          md.data.certificationExpires = true;
      }
    }

    function addCertificationsModel() {
      vm.dateInit = {
        from: new Date(),
        to: new Date()
      };

      vm.content.push({
        isEditable: true,
        addInProcess: true
      });
      vm.hasdata = true;
      vm.disabledAddMode = true;
    }

    /*** CRUD Methods End***/
  }
})();
