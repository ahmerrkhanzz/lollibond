(function() {
  'use strict';

  angular
    .module('lollibond.setup')
    .controller('SetupEducationController', SetupEducationController);

  /** @ngInject */
  function SetupEducationController(countries, aboutService, $state) {
    var vm = this;

    // Adding a day in current date
    var today = new Date();
    today.setDate(today.getDate() - 1);
    var minDate = '';

    vm.model = {};

    // Formly Configuration Model
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
    }, {
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
            expression: function(viewValue, modelValue) {
              return modelValue < today;
            },
            message: '$viewValue + " cannot be set for future!"'
          }
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
        hideExpression: function(viewValue, modelValue, scope) {
          return scope.model.currentlystudying;
        },
        expressionProperties: {
          'templateOptions.minDate': 'model.fromDate',
          'templateOptions.disabled': '!model.fromDate'
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


    /**
     * Create Method of single WorkExperience.
     * vm.form.$valid condition is required to check all fields validation. 
     * If it is valid formwill create a new object and save the details
     */
    function addCollegeEducation() {
      if (vm.form.$valid) {
        var postParams = {
          activities: vm.model.activities,
          degree: vm.model.degree,
          description: vm.model.description,
          fieldOfStudy: vm.model.fieldOfStudy,
          fromDate: vm.model.fromDate,
          grade: vm.model.grade,
          schoolId: vm.model.schoolId,
          schoolName: vm.model.schoolName,
          toDate: vm.model.toDate
        };
        var saveEducation = aboutService.addSection(aboutService.SECTION.COLLEGE_EDUCATION, postParams);
        saveEducation.execute().then(function() {
          $state.go('setup.setupexperience');
        });
      }
    }


    //function assignment 
    vm.addCollegeEducation = addCollegeEducation;
  }

})();
