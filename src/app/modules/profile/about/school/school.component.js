(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('school', {
      bindings: {
         content: "<",
         hasdata: "="
      },
      controller: SchoolController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/school/school.html'
    });

  /** @ngInject */
  function SchoolController($window, $http, profileService, AddSection, aboutService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateSchool = updateSchool;
    vm.deleteSchool = deleteSchool;
    vm.addSchoolModel = addSchoolModel;
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
      key: 'schoolName',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'School Name',
        required: true,
        maxlength: 100,
        focus: true
      }
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
    }, {
      fieldGroup: [{
          key: 'fromDate',
          className: 'col-sm-6',
          type: 'datepickerformly',
          templateOptions: {
            label: 'Start Date',
            required: true,
            type: 'text',
            maxDate: today,
            datepickerPopup: 'dd-MMMM-yyyy'
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
        },
        {
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
            label: 'Currently Studying'
          }
        }
      ]
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
     * Create/Update Method of single School.
     * @param  {int} Array index of School Model
     * if sch.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateSchool(id) {
      if (vm.form.$valid) {
        vm.temp  = vm.model.currentlystudying;
        vm.model = vm.content;
        var sch = vm.model[id];
        if(sch.data.currentlystudying){
          sch.data.toDate = '';
        }
        var postParams = {
          activities: sch.data.activities,
          degree: sch.data.degree,
          description: sch.data.description,
          fieldOfStudy: sch.data.fieldOfStudy,
          fromDate: sch.data.fromDate,
          grade: sch.data.grade,
          schoolId: sch.data.schoolId,
          schoolName: sch.data.schoolName,
          toDate: sch.data.toDate,
          id: sch.data.id || ''
        };
        if (sch.data.id) {
          var editSchool = aboutService.updateSection(aboutService.SECTION.SCHOOL, postParams, sch.data.id);
          editSchool.execute().then(function() {
            sch.isEditable = false;
            vm.disabledAddMode = false;
            if(postParams.toDate == null){
              sch.data.currentlystudying = vm.temp;
            }
          });
        } else {
          var saveSchool = aboutService.addSection(aboutService.SECTION.SCHOOL, postParams);
          saveSchool.execute().then(function(response) {
            sch.data.id = response.id;
            sch.isEditable = false;
            sch.addInProcess = false;
            vm.disabledAddMode = false;
          });
        }
      }
    }

    /**
     * Delete details of a single School.
     * @param  {int} Array index of School Model
     */
    function deleteSchool(id) {
      vm.model = vm.content;
      var sch = vm.model[id];
      if (sch.data.id) {
        var delSchool = aboutService.deleteSection(aboutService.SECTION.SCHOOL, sch.data.id);        
        delSchool.execute().then(function() {
          vm.model.splice(id, 1);
          vm.disabledAddMode = false;
          if(vm.model.length == 0){
            vm.hasdata = false;
          }
        });        
      } else {
        vm.splice(id, 1);
        vm.disabledAddMode = false;
        if(vm.model.length == 0){
          vm.hasdata = false;
        }
      }
    }

    /**
     * Edit details of a single School.
     * @param  {int} Array index of School Model
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
      if(md.data.toDate == null){
          md.data.currentlystudying = true;
      }
    }

    function addSchoolModel() {
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
