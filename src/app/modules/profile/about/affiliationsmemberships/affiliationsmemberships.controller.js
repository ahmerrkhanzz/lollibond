(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('AffiliationsMembershipsController', AffiliationsMembershipsController);

  /** @ngInject */
  function AffiliationsMembershipsController($http, countries, $resource, $scope, baseService, $q, profileService, AddSection) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateAffiliation = updateAffiliation;
    vm.deleteAffiliation = deleteAffiliation;
    vm.addAffiliationModel = addAffiliationModel;
    vm.copyFields = AddSection.copyFields;

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.addInProcess = false;

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
        label: 'Your Role:'
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
        label: 'Organization Name:'
      }
    }, {
      className: "row",
      fieldGroup: [{
        key: 'fromDate',
        className: 'col-md-12',
        type: 'datepickerformly',
        templateOptions: {
          label: 'Start Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy'
        }
      }, {
        key: 'currentlyaffiliated',
        className: 'col-md-12',
        type: 'checkbox',
        templateOptions: {
          label: 'Currently Affiliated'
        }
      }, {
        key: 'toDate',
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
          'templateOptions.disabled': 'model.currentlyaffiliated'
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
     * Create/Update Method of single Affiliation.
     * @param  {int} Array index of Affiliation Model  
     * if aff.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateAffiliation(id) {
      vm.model = vm.content;
      var aff = vm.model[id];

      var postParams = {
        "organization": aff.data.organization,
        "role": aff.data.role,
        "fromDate": aff.data.fromDate,
        "toDate": aff.data.toDate ,
        "description": aff.data.description,
        "duties": aff.data.duties,
        "achievements": aff.data.achievements
      }
      if (aff.data.id) {
        var editAffiliation = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/affiliations/' + aff.data.id)
          .setPutMethod()
          .setPostParams(postParams);
        editAffiliation.execute().then(function(response) {
          aff.isEditable = false;
          console.log(response);
        });
      } else {
        var saveAffiliation = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/affiliations/')
          .setPostMethod()
          .setPostParams(postParams);
        saveAffiliation.execute().then(function(response) {
          aff.data.id = response.id;
          console.log(response);
          aff.isEditable = false;
          vm.addInProcess = false;
        });
      }
    }

    /**
     * Delete details of a single Affiliation.
     * @param  {int} Array index of Affiliation Model  
     */
    function deleteAffiliation(id) {
      vm.model = vm.content;
      var deferred = $q.defer();
      var aff = vm.model[id];
      if (aff.data.id) {
        var delAffiliation = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/affiliations/' + aff.data.id)
          .setDeleteMethod();
        if (window.confirm("Are you sure you want to delete '" + aff.data.role + "' ?")) {
          delAffiliation.execute().then(function(response) {
            vm.model.splice(id, 1);
          });
        }
      } else {
        vm.model.splice(id, 1);
        vm.addInProcess = false;
      }
    }

    /**
     * Edit details of a single Affiliation.
     * @param  {int} Array index of Affiliation Model  
     */
    function editForm(md) {
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addAffiliationModel() {
      vm.content.push({
        isEditable: true
      });
      vm.addInProcess = true;
    }

    /*** CRUD Methods End***/

  }
})();
