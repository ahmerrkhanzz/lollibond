(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('affiliationsMemberships', {
      bindings: {
        content: '<',
        hasdata: "="
      },
      controller: AffiliationsMembershipsController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/affiliationsmemberships/affiliationsmemberships.html'
    });
  /** @ngInject */
  function AffiliationsMembershipsController($window, profileService, AddSection, aboutService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateAffiliation = updateAffiliation;
    vm.deleteAffiliation = deleteAffiliation;
    vm.addAffiliationModel = addAffiliationModel;
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
      key: 'role',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        required: true,
        label: 'Your Role:',
        maxlength: 100,
        focus: true
      }
    }, {
      type: 'input',
      key: 'organization',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        required: true,
        label: 'Organization Name:',
        maxlength: 100
      }
    }, {
      className: "row",
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
        hideExpression: '!model.currentlyaffiliated'
      }, {
        key: 'toDate',
        type: 'datepickerformly',

        className: 'col-md-12',
        templateOptions: {
          label: 'End Date',
          required: true,
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy',
          //this houdl override datepicker format on formlyConfig and it did
          datepickerOptions: {
            format: 'dd-MMMM-yyyy'
          },
          minDate: minDate
        },
        hideExpression: function (viewValue, modelValue, scope) {
          if(scope.model.currentlyaffiliated){
            scope.model.toDate = '';
          }
          return scope.model.currentlyaffiliated;
        },
        expressionProperties: {
          'templateOptions.minDate': 'model.fromDate',
          'templateOptions.disabled': '!model.fromDate'
        },
        controller: function($scope) {
          $scope.to.datepickerOptions.initDate = vm.dateInit.to;
        }
      }, {
        key: 'currentlyaffiliated',
        className: 'col-md-12',
        type: 'checkbox',
        templateOptions: {
          label: 'Currently Affiliated'
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
     * Create/Update Method of single Affiliation.
     * @param  {int} Array index of Affiliation Model
     * if aff.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateAffiliation(id) {
      if (vm.form.$valid) {
        vm.model = vm.content;
        var aff = vm.model[id];
        if (aff.data.currentlyaffiliated) {
          aff.data.toDate = '';
        }
        var postParams = {
          organization: aff.data.organization,
          role: aff.data.role,
          fromDate: aff.data.fromDate,
          toDate: aff.data.toDate,
          description: aff.data.description,
          duties: aff.data.duties,
          achievements: aff.data.achievements,
          id: aff.data.id || ''
        };
        if (aff.data.id) {
          var editAffiliation = aboutService.updateSection(aboutService.SECTION.AFFILLIATION, postParams, aff.data.id);
          editAffiliation.execute().then(function() {
            aff.isEditable = false;
            vm.disabledAddMode = false;
          });
        } else {
          var saveAffiliation = aboutService.addSection(aboutService.SECTION.AFFILLIATION, postParams);
          saveAffiliation.execute().then(function(response) {
            aff.data.id = response.id;
            aff.isEditable = false;
            aff.addInProcess = false;
            vm.disabledAddMode = false;
          });
        }
      }  
    }

    /**
     * Delete details of a single Affiliation.
     * @param  {int} Array index of Affiliation Model
     */
    function deleteAffiliation(id) {
      vm.model = vm.content;
      var aff = vm.model[id];
      if (aff.data.id) {
        var delAffiliation = aboutService.deleteSection(aboutService.SECTION.AFFILLIATION, aff.data.id);        
        delAffiliation.execute().then(function() {
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
     * Edit details of a single Affiliation.
     * @param  {int} Array index of Affiliation Model
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
        md.data.currentlyaffiliated = true;
      }
    }

    function addAffiliationModel() {
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
