(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('experience', {
      bindings: {
        content: '<',
        hasdata: "="
      },
      controller: ExperienceController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/experience/experience.html'
    });

  /** @ngInject */
  function ExperienceController($window, $http, profileService, AddSection, aboutService, baseService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateWorkExperience = updateWorkExperience;
    vm.deleteWorkExperience = deleteWorkExperience;
    vm.addWorkExperienceModel = addWorkExperienceModel;
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
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Title:',
        required: true,
        maxlength: 100,
        focus: true
      }
    }, {
      type: 'input',
      key: 'companyName',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Company Name',
        required: true,
        maxlength: 100
      }
    }, {
      type: 'input',
      key: 'location',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Location:',
        maxlength: 80,
        required: true
      }
    }, {
      type: 'input',
      key: 'duties',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Duties:',
        maxlength: 500
      }
    }, {
      type: 'input',
      key: 'achievements',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Achievements',
        maxlength: 500
      }
    }, {
      type: 'textarea',
      key: 'description',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Description:',
        maxlength: 500
      }
    }, {
      fieldGroup: [{
        key: 'fromDate',
        className: 'col-sm-6',
        type: 'datepickerformly',
        templateOptions: {
          label: 'Start Date',
          type: 'text',
          maxDate: today,
          datepickerPopup: 'dd-MMMM-yyyy',
          required: true
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
        template: '<span class="present">Present</span>',
        hideExpression: '!model.currentlystudying'
      }, {
        key: 'toDate',
        type: 'datepickerformly',
        className: 'col-sm-6',
        templateOptions: {
          label: 'End Date',
          required: true,
          type: 'text',
          minDate: minDate,
          maxDate: today,
          datepickerPopup: 'dd-MMMM-yyyy',
          //this houdl override datepicker format on formlyConfig and it did
          datepickerOptions: {
            format: 'dd-MMMM-yyyy'
          }
        },
        hideExpression: function (viewValue, modelValue, scope) {
          if(scope.model.currentlystudying){
            scope.model.toDate = '';
          }
          return scope.model.currentlystudying;
        },
        expressionProperties: {
          'templateOptions.minDate': 'model.fromDate',
          'templateOptions.disabled': '!model.fromDate'
        },
        controller: function($scope) {
          $scope.to.datepickerOptions.initDate = vm.dateInit.to;
        }
      }, {
        key: 'currentlystudying',
        className: 'col-sm-6 col-sm-offset-6 datefix',
        type: 'checkbox',
        templateOptions: {
          label: 'Currently Working'
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
     * Create/Update Method of single WorkExperience.
     * @param  {int} Array index of WorkExperience Model
     * if exp.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateWorkExperience(id) {
      if (vm.form.$valid) {
        vm.model = vm.content;
        var exp = vm.model[id];
        if (exp.data.currentlystudying) {
          exp.data.toDate = '';
        }
        var postParams = {
          companyName: exp.data.companyName,
          title: exp.data.title,
          location: exp.data.location,
          fromDate: exp.data.fromDate,
          toDate: exp.data.toDate,
          description: exp.data.description,
          duties: exp.data.duties,
          achievements: exp.data.achievements,
          id: exp.data.id || ''
        };

        if (exp.data.id) {
          var editWorkExperience = aboutService.updateSection(aboutService.SECTION.EXPERIENCE, postParams, exp.data.id);
          editWorkExperience.execute().then(function() {
            exp.isEditable = false;
            vm.disabledAddMode = false;
          }).then(function() {
            return new baseService()
              .setPath('peacock','/user/me/workExperiences/' + exp.data.id + '/permissions')
              .setPostMethod()
              .setPostParams(vm.selectedExpPrivacy)
              .execute();
          });
        } else {
          var saveWorkExperience = aboutService.addSection(aboutService.SECTION.EXPERIENCE, postParams);
          saveWorkExperience.execute().then(function(response) {
            exp.data.id = response.id;
            exp.isEditable = false;
            exp.addInProcess = false;
            vm.disabledAddMode = false;
          }).then(function() {
            return new baseService()
              .setPath('peacock','/user/me/workExperiences/' + exp.data.id + '/permissions')
              .setPostMethod()
              .setPostParams(vm.selectedExpPrivacy)
              .execute();
          });
        }
      }  
    }

    /**
     * Delete details of a single WorkExperience.
     * @param  {int} Array index of WorkExperience Model
     */
    function deleteWorkExperience(id) {
      vm.model = vm.content;
      var exp = vm.model[id];

      if (exp.data.id) {
        var delWorkExperience = aboutService.deleteSection(aboutService.SECTION.EXPERIENCE, exp.data.id);       
        delWorkExperience.execute().then(function() {
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
     * Edit details of a single WorkExperience.
     * @param  {int} Array index of WorkExperience Model
     */
    function editForm(md) {
      //Saving Data for Reset function
      origModel = angular.copy(md);

      vm.dateInit = {
        from: new Date(md.data.fromDate),
        to:  new Date() || new Date(md.data.toDate)
      };
      
      vm.model = vm.content;
      vm.disabledAddMode = true;
      md.isEditable = !md.isEditable;
      if (md.data.toDate == null) {
        md.data.currentlystudying = true;
      }
    }

    function addWorkExperienceModel() {

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
