(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('ExperienceController', ExperienceController);

  /** @ngInject */
  function ExperienceController($http, countries, $resource, $scope, baseService, $q, profileService, AddSection) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateWorkExperience = updateWorkExperience;
    vm.deleteWorkExperience = deleteWorkExperience;
    vm.addWorkExperienceModel = addWorkExperienceModel;
    vm.copyFields = AddSection.copyFields;

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.addInProcess = false;

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
        label: 'Title:'
      }
    }, {
      type: 'input',
      key: 'companyName',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Company Name'
      }
    }, {
      type: 'input',
      key: 'location',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Location:'
      }
    }, {
      type: 'input',
      key: 'duties',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Duties:'
      }
    }, {
      type: 'input',
      key: 'achievements',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Achievements'
      }
    }, {
      type: 'textarea',
      key: 'description',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Description:'
      }
    }, {
      fieldGroup: [{
        key: 'fromDate',
        className: 'col-md-6',
        type: 'datepickerformly',
        templateOptions: {
          label: 'Start Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy'
        }
      }, {
        key: 'toDate',
        type: 'datepickerformly',
        className: 'col-md-6',
        templateOptions: {
          label: 'End Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy',
          //this houdl override datepicker format on formlyConfig and it did
          datepickerOptions: {
            format: 'dd-MMMM-yyyy'
          }
        },
        expressionProperties: {
          'templateOptions.disabled': 'model.currentlystudying'
        }
      }]
    }, {
      type: 'select',
      key: 'currentSelectedPrivacy',
      defaultValue: "public",
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs' // <-- this is it!
      },
      templateOptions: {
        label: 'Who can view this?',
        required: true,
        options: [{
          name: 'Public',
          value: 0
        }, {
          name: 'Bonds',
          value: 1
        }, {
          name: 'Bonds of bonds',
          value: 2
        }, {
          name: 'Only me',
          value: 3
        }, {
          name: 'Custom',
          value: 4
        }]
      }
    }, {
      hideExpression: 'model.currentSelectedPrivacy != 4',
      fieldGroup: [{
        key: 'visibleTo',
        type: 'tag',
        className: 'col-md-12',
        templateOptions: {
          label: 'Make this visible to:',
          allowCustomInput: true,
          loadList: peopleList,
          displayProperty: "name"
        },
        ngModelElAttrs: {
          class: 'tag-input-scroll form-control bootstrap-tagsinput input-xs' // <-- this is it!
        }
      }]
    }];


    //Service calls
    function peopleList($query) {
      return $http.get('http://172.16.18.60:3004/people', { cache: true }).then(function(response) {
        var peoples = response.data;
        return peoples.filter(function(people) {
          return people.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
      });
    }

    function loadSkills($query) {
      return $http.get('http://172.16.18.60:3004/skills', { cache: true }).then(function(response) {
        var skills = response.data;
        return skills.filter(function(skill) {
          return skill.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
      });
    }

    // CRUD Methods 

    /**
     * Create/Update Method of single WorkExperience.
     * @param  {int} Array index of WorkExperience Model  
     * if exp.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateWorkExperience(id) {
      vm.model = vm.content;
      var exp = vm.model[id];
      var postParams = {
        "companyName": exp.data.companyName,
        "title": exp.data.title,
        "location": exp.data.location,
        "fromDate": exp.data.fromDate,
        "toDate": exp.data.toDate ,
        "description": exp.data.description,
        "duties": exp.data.duties,
        "achievements": exp.data.achievements
      }
      if (exp.data.id) {
        var editWorkExperience = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/workExperiences/' + exp.data.id)
          .setPutMethod()
          .setPostParams(postParams);
        editWorkExperience.execute().then(function(response) {
          exp.isEditable = false;
        });
      } else {
        var saveWorkExperience = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/workExperiences/')
          .setPostMethod()
          .setPostParams(postParams);
        saveWorkExperience.execute().then(function(response) {
          exp.data.id = response.id;
          exp.isEditable = false;
          vm.addInProcess = false;
        });
      }
    }

    /**
     * Delete details of a single WorkExperience.
     * @param  {int} Array index of WorkExperience Model  
     */
    function deleteWorkExperience(id) {
      vm.model = vm.content;
      var deferred = $q.defer();
      var exp = vm.model[id];
      if (exp.data.id) {
        var delWorkExperience = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/workExperiences/' + exp.data.id)
          .setDeleteMethod();
        if (window.confirm("Are you sure you want to delete '" + exp.data.schoolName + "' ?")) {
          delWorkExperience.execute().then(function(response) {
            vm.model.splice(id, 1);
          });
        }
      } else {
        vm.model.splice(id, 1);
        vm.addInProcess = false;
      }
    }

    /**
     * Edit details of a single WorkExperience.
     * @param  {int} Array index of WorkExperience Model  
     */
    function editForm(md) {
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addWorkExperienceModel() {
      vm.content.push({
        isEditable: true
      });
      vm.addInProcess = true;
    }

    /*** CRUD Methods End***/

  }
})();
