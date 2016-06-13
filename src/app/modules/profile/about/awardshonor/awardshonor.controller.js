(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('AwardsHonorController', AwardsHonorController);

  /** @ngInject */
  function AwardsHonorController($http, countries, $resource, $scope, baseService, $q, profileService, AddSection) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateAwards = updateAwards;
    vm.deleteAwards = deleteAwards;
    vm.addAwardsModel = addAwardsModel;
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
      type: 'select',
      key: 'occupation',
      className: 'col-md-12',
      defaultValue: "",
      ngModelElAttrs: {
        class: 'form-control input-xs' // <-- this is it!
      },
      templateOptions: {
        label: 'Occupation :',
        options: [{
          name: 'Select Occupation ',
          value: ''
        }, {
          name: 'Project Manager',
          value: 'ProjectManager'
        }, {
          name: 'Project Builder',
          value: 'ProjectBuilder'
        }, {
          name: 'Engineering Manager',
          value: 'EngineeringManager'
        }, {
          name: 'Production Manager',
          value: 'ProductionManager'
        }, {
          name: 'Medical Administrator',
          value: 'MedicalAdministrator'
        }, {
          name: 'Internal Auditor',
          value: 'InternalAuditor'
        }, {
          name: 'Actuary',
          value: 'Actuary'
        }, {
          name: 'Land Economist',
          value: 'LandEconomist'
        }, {
          name: 'Architect',
          value: 'Architect'
        }]
      }
    }, {
      type: 'input',
      key: 'issuer',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        required: true,
        label: 'Issued By:'
      }
    }, {
      key: 'issuedDate',
      type: 'datepickerformly',
      className: 'col-md-12',
      templateOptions: {
        label: 'Issue Date',
        type: 'text',
        datepickerPopup: 'dd-MMMM-yyyy'
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
     * Create/Update Method of single Awards.
     * @param  {int} Array index of Awards Model  
     * if awr.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateAwards(id) {
      vm.model = vm.content;
      var awr = vm.model[id];
      var postParams = {
          "occupation": awr.data.occupation,
          "title": awr.data.title,
          "issuer": awr.data.issuer,
          "issuedDate": awr.data.issuedDate,
          "description": awr.data.description 
        }
      if (awr.data.id) {
        var editAwards = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/awards/' + awr.data.id)
          .setPutMethod()
          .setPostParams(postParams);
        editAwards.execute().then(function(response) {
          awr.isEditable = false;
        });
      } else {
        var saveAwards = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/awards/')
          .setPostMethod()
          .setPostParams(postParams);
        saveAwards.execute().then(function(response) {
          awr.data.id = response.id;
          awr.isEditable = false;
          vm.addInProcess = false;
        });
      }
    }

    /**
     * Delete details of a single Awards.
     * @param  {int} Array index of Awards Model  
     */
    function deleteAwards(id) {
      vm.model = vm.content;
      var deferred = $q.defer();
      var awr = vm.model[id];
      if (awr.data.id) {
        var delAwards = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/awards/' + awr.data.id)
          .setDeleteMethod();
        if (window.confirm("Are you sure you want to delete '" + awr.data.title + "' ?")) {
          delAwards.execute().then(function(response) {
            vm.model.splice(id, 1);
          });
        }
      } else {
        vm.model.splice(id, 1);
        vm.addInProcess = false;
      }
    }

    /**
     * Edit details of a single Awards.
     * @param  {int} Array index of Awards Model  
     */
    function editForm(md) {
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addAwardsModel() {
      vm.content.push({
        isEditable: true
      });
      vm.addInProcess = true;
    }

    /*** CRUD Methods End***/

  }
})();
