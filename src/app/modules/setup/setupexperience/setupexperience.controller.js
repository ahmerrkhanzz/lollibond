(function() {
  'use strict';

  angular
    .module('lollibond.setup')
    .controller('SetupExperienceController', SetupExperienceController);

  /** @ngInject */
  function SetupExperienceController(countries, aboutService, $state) {
    var vm = this;

    // Adding a day in current date
    var today = new Date(); 
    var minDate = '';
    vm.dateInit = {
      from: new Date(),
      to: new Date()
    };

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
          return scope.model.currentlystudying;
        },
        expressionProperties: {
          'templateOptions.minDate': 'model.fromDate',
          'templateOptions.disabled': '!model.fromDate'
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


    /**
     * Create Method of single WorkExperience.
     * vm.form.$valid condition is required to check all fields validation. 
     * If it is valid formwill create a new object and save the details
     */
    function addWorkExperience() {
      if (vm.form.$valid) {
        var postParams = {
          companyName: vm.model.companyName,
          title: vm.model.title,
          location: vm.model.location,
          fromDate: vm.model.fromDate,
          toDate: vm.model.toDate,
          description: vm.model.description,
          duties: vm.model.duties,
          achievements: vm.model.achievements
        };
        var saveWorkExperience = aboutService.addSection(aboutService.SECTION.EXPERIENCE, postParams);
        saveWorkExperience.execute().then(function() {
          $state.go('setup.setupskill');
        });
      }  
    }


    //function assignment 
    vm.addWorkExperience = addWorkExperience;
  }

})();
