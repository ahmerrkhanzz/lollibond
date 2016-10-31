(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('volunteeringExperience', {
      bindings: {
        content: '<',
        hasdata: "="
      },
      controller: VolunteeringExperienceController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/volunteer/volunteer.html'
    });

  /** @ngInject */
  function VolunteeringExperienceController($window, countries, profileService, AddSection, aboutService, baseService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateVolunteers = updateVolunteers;
    vm.deleteVolunteers = deleteVolunteers;
    vm.addVolunteersModel = addVolunteersModel;
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
    vm.causes = [];
    vm.causeList = {};
    vm.currentlySelectedLocation = '';
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
      type: 'select',
      key: 'cause',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Volunteer Cause:',
        options: vm.causes,
        valueProp: 'name',
        labelProp: 'value'
      }
    }, {
      className: 'row',
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
            expression: function(viewValue, modelValue) {
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
        className: 'col-md-12',
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
          if (scope.model.currentlystudying) {
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
          label: 'Currently Volunteering'
        }
      }]
    }, {
      type: 'input',
      key: 'organizationName',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Organization:',
        maxlength: 100
      }
    }, {
      key: 'location',
      type: 'ui-select',
      className: 'col-md-12',
      templateOptions: {
        label: 'Volunteering Location',
        valueProp: 'value',
        labelProp: 'label',
        options: [],
        refresh: refreshLocation,
        refreshDelay: 250
      },
      controller: function($scope) {
        if (vm.currentlySelectedLocation) {
          $scope.to.defaultValue = vm.currentlySelectedLocation;
        }
      }
    }, {
      type: 'input',
      key: 'duties',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Duties:',
        maxlength: 100
      }
    }, {
      key: 'skills',
      type: 'tag',
      className: 'col-md-12',
      templateOptions: {
        label: 'Skills',
        displayProperty: 'name',
        placeholder: "+ Add more skills",
        allowCustomInput: true,
        loadList: refreshSkills
      }
    }, {
      type: 'input',
      key: 'impact',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Impact:',
        maxlength: 100
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
    }];


    // Refresh Suggestion list for Location
    function refreshLocation(val, field) {
      // Detemine string of whitespaces
      var expression = /^\s+$/g;
      var regex = new RegExp(expression);

      if (!val.match(regex) && val.length > 0) {
        return new baseService()
          .setPath('coral', '/api/v1/cities/search/' + val)
          .execute().then(function(response) {
            var opt = [];
            angular.forEach(response, function(key, value) {
              this.push({
                label: value,
                value: key
              });
            }, opt);
            field.templateOptions.options = opt;
          });
      }else{
        return [];
      }
    }


    //Volunteer Cause Data
    function getCauses() {
      return new baseService()
        .setPath('coral', '/api/v1/volunteercause/list/en')
        .execute().then(function(response) {
          vm.causeList = response;
          angular.forEach(vm.causeList, function(value, key) {
            this.push({
              name: parseInt(key),
              value: value
            });
          }, vm.causes);
        });
    }

    // Refresh Suggestion list for Skills
    function refreshSkills(val){

      // Detemine string of whitespaces
      var expression = /^\s+$/g;
      var regex = new RegExp(expression);

      if (val && !val.match(regex)) {
        return new baseService()
          .setPath('coral', '/api/v1/skills/search/' + val)
          .execute().then(function(response){
            return response;
          });
      }else{
        return [];
      }
    }

    function init() {
      getCauses();
    }

    // Reset function 
    function reset(idx) {
      if (vm.content[idx].data.id) {
        vm.content[idx] = origModel;
        vm.content[idx].data.isEditable = false;
      } else {
        vm.content.splice(idx, 1);
      }
      vm.disabledAddMode = false;
      if (vm.content.length == 0) {
        vm.hasdata = false;
      }
    }


    // CRUD Methods

    /**
     * Create/Update Method of single Volunteers.
     * @param  {int} Array index of Volunteers Model
     * if vol.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateVolunteers(id) {
      if (vm.form.$valid) {
        vm.model = vm.content;
        var vol = vm.model[id];

        //Coverting skills Array of Obj (ngTagInput) into Plain Array.
        if(vol.data.skills){
          vol.data.skills = vol.data.skills.map(function(obj){
            return obj.name;
          });
        }

        if (vol.data.currentlystudying) {
          vol.data.toDate = '';
        }
        var postParams = {
          cause: vol.data.cause,
          description: vol.data.description,
          duties: vol.data.duties,
          fromDate: vol.data.fromDate,
          toDate: vol.data.toDate,
          location: vol.data.location,
          impact: vol.data.impact,
          skills: vol.data.skills,
          title: vol.data.title,
          organizationName: vol.data.organizationName,
          id: vol.data.id || ''
        };

        if (vol.data.id) {
          var editVolunteers = aboutService.updateSection(aboutService.SECTION.VOLUNTEER, postParams, vol.data.id);
          editVolunteers.execute().then(function() {
            vol.isEditable = false;
            vm.disabledAddMode = false;
          });
        } else {
          var saveVolunteers = aboutService.addSection(aboutService.SECTION.VOLUNTEER, postParams);
          saveVolunteers.execute().then(function(response) {
            vol.data.id = response.id;
            vol.isEditable = false;
            vol.addInProcess = false;
            vm.disabledAddMode = false;
          });
        }
      }
    }

    /**
     * Delete details of a single Volunteers.
     * @param  {int} Array index of Volunteers Model
     */
    function deleteVolunteers(id) {
      vm.model = vm.content;
      var vol = vm.model[id];
      if (vol.data.id) {
        var delVolunteers = aboutService.deleteSection(aboutService.SECTION.VOLUNTEER, vol.data.id);
        delVolunteers.execute().then(function() {
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
     * Edit details of a single Volunteers.
     * @param  {int} Array index of Volunteers Model
     */
    function editForm(md) {
      //Saving Data for Reset function
      origModel = angular.copy(md);

      vm.dateInit = {
        from: new Date(md.data.fromDate),
        to: new Date() || new Date(md.data.toDate)
      };

      vm.model = vm.content;
      vm.disabledAddMode = true;
      md.isEditable = !md.isEditable;
      vm.currentlySelectedLocation = md.data.location;
      if (md.data.toDate == null) {
        md.data.currentlystudying = true;
      }
    }

    function addVolunteersModel() {
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

    init();

  }
})();
