(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('VolunteeringExperienceController', VolunteeringExperienceController);

  /** @ngInject */
  function VolunteeringExperienceController($http, countries, $resource, $scope, baseService, $q, profileService, AddSection) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateVolunteers = updateVolunteers;
    vm.deleteVolunteers = deleteVolunteers;
    vm.addVolunteersModel = addVolunteersModel;
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
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        required: true,
        label: 'Title:'
      }
    }, {
      type: 'input',
      key: 'cause',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Volunteer Cause:'
      }
    }, {
      className: 'row',
      fieldGroup: [{
        key: 'startdate',
        className: 'col-md-12',
        type: 'datepickerformly',
        templateOptions: {
          label: 'Start Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy'
        }
      }, {
        key: 'currentlystudying',
        className: 'col-md-12',
        type: 'checkbox',
        templateOptions: {
          label: 'Currently Volunteering'
        }
      }, {
        key: 'enddate',
        type: 'datepickerformly',
        className: 'col-md-12',
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
      type: 'input',
      key: 'organizationName',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Organization:'
      }
    }, {
      key: 'location',
      type: 'typeahead',
      className: 'col-md-12',
      templateOptions: {
        label: 'Volunteering Location',
        options: countries
      }
    }, {
      key: 'skills',
      type: 'tag',
      className: 'col-md-12',
      templateOptions: {
        label: 'Skills'
      }
    }, {
      type: 'input',
      key: 'duties',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Duties:'
      }
    }, {
      type: 'input',
      key: 'impact',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Impact:'
      }
    }, {
      type: 'textarea',
      key: 'description',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Description'
      }
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
     * Create/Update Method of single Volunteers.
     * @param  {int} Array index of Volunteers Model  
     * if vol.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateVolunteers(id) {
      vm.model = vm.content;
      var vol = vm.model[id];
      var postParams ={
        "cause": 0,
        "description": vol.data.description,
        "duties": vol.data.duties,
        "fromDate": vol.data.fromDate,
        "toDate": vol.data.toDate ,
        "location": vol.data.location,
        "impact": vol.data.impact,
        "title": vol.data.title,
        "organizationName": vol.data.organizationName
      }
      console.log(postParams);
      if (vol.data.id) {
        var editVolunteers = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/volunteers/' + vol.data.id)
          .setPutMethod()
          .setPostParams(postParams);
        editVolunteers.execute().then(function(response) {
          vol.isEditable = false;
        });
      } else {
        var saveVolunteers = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/volunteers/')
          .setPostMethod()
          .setPostParams(postParams);
        saveVolunteers.execute().then(function(response) {
          vol.data.id = response.id;
          vol.isEditable = false;
          vm.addInProcess = false;
        });
      }
    }

    /**
     * Delete details of a single Volunteers.
     * @param  {int} Array index of Volunteers Model  
     */
    function deleteVolunteers(id) {
      vm.model = vm.content;
      var deferred = $q.defer();
      var vol = vm.model[id];
      if (vol.data.id) {
        var delVolunteers = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/volunteers/' + vol.data.id)
          .setDeleteMethod();
        if (window.confirm("Are you sure you want to delete '" + vol.data.title + "' ?")) {
          delVolunteers.execute().then(function(response) {
            vm.model.splice(id, 1);
          });
        }
      } else {
        vm.model.splice(id, 1);
        vm.addInProcess = false;
      }
    }

    /**
     * Edit details of a single Volunteers.
     * @param  {int} Array index of Volunteers Model  
     */
    function editForm(md) {
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addVolunteersModel() {
      vm.content.push({
        isEditable: true
      });
      vm.addInProcess = true;
    }

    /*** CRUD Methods End***/

  }
})();
