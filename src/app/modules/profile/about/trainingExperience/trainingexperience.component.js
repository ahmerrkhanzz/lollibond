(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('trainingExperience', {
      bindings: {
        content: '=',
        hasdata: "="
      },
      controller: TrainingExperienceController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/trainingExperience/trainingExperience.html'
    });

  /** @ngInject */
  function TrainingExperienceController($window, profileService, AddSection, aboutService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateTraining = updateTraining;
    vm.deleteTraining = deleteTraining;
    vm.addTrainingModel = addTrainingModel;
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
        key: 'institute',
        className: 'col-md-12',
        ngModelElAttrs: {
          class: 'form-control input-xs'
        },
        templateOptions: {
          required: true,
          label: 'Institute:',
          maxlength: 100
        }
      }, {
        key: 'fromDate',
        type: 'datepickerformly',
        className: 'col-md-12',
        templateOptions: {
          label: 'From Date',
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
      },{
        template: '<span class="present">Present</span>',
        hideExpression: '!model.currentlystudying'
      }, {
        key: 'toDate',
        type: 'datepickerformly',
        className: 'col-md-12',
        templateOptions: {
          label: 'To Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy',
          minDate: minDate,
          maxDate: today
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
      className: 'col-md-12',
      type: 'checkbox',
      templateOptions: {
        label: 'In Process'
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
     * Create/Update Method of single Training.
     * @param  {int} Array index of Training Model
     * if training.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateTraining(id) {
      if (vm.form.$valid) {
        vm.model = vm.content;
        var training = vm.model[id];
        if (training.data.currentlystudying) {
          training.data.toDate = '';
        }
        var postParams = {
          title: training.data.title,
          institute: training.data.institute,
          fromDate: training.data.fromDate,
          toDate: training.data.toDate,
          id: training.data.id || ''
        };
        if (training.data.id) {
          var editTraining = aboutService.updateSection(aboutService.SECTION.TRAINING, postParams, training.data.id);
          editTraining.execute().then(function() {
            training.isEditable = false;
            vm.disabledAddMode = false;
          });
        } else {
          var saveTraining = aboutService.addSection(aboutService.SECTION.TRAINING, postParams);
          saveTraining.execute().then(function(response) {
            training.data.id = response.id;
            training.isEditable = false;
            training.addInProcess = false;
            vm.disabledAddMode = false;
          });
        }
      }
    }

    /**
     * Delete details of a single Training.
     * @param  {int} Array index of Training Model
     */
    function deleteTraining(id) {
      vm.model = vm.content;
      var training = vm.model[id];
      if (training.data.id) {
        var delTraining = aboutService.deleteSection(aboutService.SECTION.TRAINING, training.data.id);        
        delTraining.execute().then(function() {
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
     * Edit details of a single Training.
     * @param  {int} Array index of Training Model
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

    function addTrainingModel() {
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
