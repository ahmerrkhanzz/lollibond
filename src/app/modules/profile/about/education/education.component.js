(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('education', {
      bindings: {
        content: '<',
        hasdata: "="
      },
      controller: EducationController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/education/education.html'
    });

  /** @ngInject */
  function EducationController($http, profileService, AddSection, aboutService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateEducation = updateEducation;
    vm.deleteEducation = deleteEducation;
    vm.addEducationModel = addEducationModel;
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
      key: 'degree',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Degree Name:',
        required: true,
        maxlength: 100,
        focus: true
      }
    }, {
      type: 'input',
      key: 'fieldOfStudy',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Field of Study',
        maxlength: 100
      }
    },{
      type: 'input',
      key: 'schoolName',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'College Name',
        required: true,
        maxlength: 100
      }
    }, {
      type: 'input',
      key: 'grade',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Grade:',
        maxlength: 100
      }
    }, {
      type: 'input',
      key: 'activities',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Activities:',
        maxlength: 100
      }
    }, {
      fieldGroup: [{
        key: 'fromDate',
        className: 'col-md-6',
        type: 'datepickerformly',
        templateOptions: {
          label: 'Start Date',
          required: true,
          type: 'text',
          maxDate: today,
          datepickerPopup: 'dd-MMMM-yyyy',
          //this houdl override datepicker format on formlyConfig and it did
          datepickerOptions: {
            format: 'dd-MMMM-yyyy'
          }
        },
        expressionProperties: {
          'templateOptions.maxDate': 'model.toDate'
        },
        validators: {
          beforeEnd: {
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
        className: 'col-md-6',
        templateOptions: {
          label: 'End Date',
          required: true,
          type: 'text',
          minDate: minDate,
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
        className: 'col-md-6 col-xs-offset-6 datefix',
        type: 'checkbox',
        templateOptions: {
          label: 'Currently Studying'
        }
      }]
    }, {
      type: 'textarea',
      key: 'description',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Description',
        maxlength: 500
      }
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
     * Create/Update Method of single Education.
     * @param  {int} Array index of Education Model
     * if edu.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateEducation(id) {
      /*if(vm.content[id].data.fromDate > vm.content[id].data.toDate){
        vm.form.$valid = false;
      }*/
      if (vm.form.$valid) {
        //vm.options.updateInitialValue();
        vm.temp  = vm.model.currentlystudying;
        vm.model = vm.content;
        var edu = vm.model[id];
        if (edu.data.currentlystudying) {
          edu.data.toDate = '';
        }
        var postParams = {
          activities: edu.data.activities,
          degree: edu.data.degree,
          description: edu.data.description,
          fieldOfStudy: edu.data.fieldOfStudy,
          fromDate: edu.data.fromDate,
          grade: edu.data.grade,
          schoolId: edu.data.schoolId,
          schoolName: edu.data.schoolName,
          toDate: edu.data.toDate,
          id: edu.data.id
        };
        if (edu.data.id) {
          var editEducation = aboutService.updateSection(aboutService.SECTION.COLLEGE_EDUCATION, postParams, edu.data.id);
          editEducation.execute().then(function() {
            edu.isEditable = false;
            vm.disabledAddMode = false;
            if(postParams.toDate == null){
              edu.data.currentlystudying = vm.temp;
            }
          });
        } else {
          var saveEducation = aboutService.addSection(aboutService.SECTION.COLLEGE_EDUCATION, postParams);
          saveEducation.execute().then(function(response) {
            edu.data.id = response.id;
            edu.isEditable = false;
            edu.addInProcess = false;
            vm.disabledAddMode = false;
          });
        }
      }
    }

    /**
     * Delete details of a single education.
     * @param  {int} Array index of Education Model
     */
    function deleteEducation(id) {
      vm.model = vm.content;
      var edu = vm.model[id];
      if (edu.data.id) {
      var delEducation = aboutService.deleteSection(aboutService.SECTION.COLLEGE_EDUCATION, edu.data.id);
          delEducation.execute().then(function() {
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
     * Edit details of a single education.
     * @param  {int} Array index of Education Model
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
      if (md.data.toDate == null) {
        md.data.currentlystudying = true;
      }
    }

    function addEducationModel() {
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
