(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('TrainingExperienceController', TrainingExperienceController);

  /** @ngInject */
  function TrainingExperienceController($http, countries, $resource, $scope, baseService, $q, profileService, AddSection) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateTraining = updateTraining;
    vm.deleteTraining = deleteTraining;
    vm.addTrainingModel = addTrainingModel;
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
      key: 'institute',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        required: true,
        label: 'Institute:'
      }
    }, {
      key: 'fromDate',
      type: 'datepickerformly',
      className: 'col-md-12',
      templateOptions: {
        label: 'From Date',
        type: 'text',
        datepickerPopup: 'dd-MMMM-yyyy'
      }
    }, {
      key: 'toDate',
      type: 'datepickerformly',
      className: 'col-md-12',
      templateOptions: {
        label: 'To Date',
        type: 'text',
        datepickerPopup: 'dd-MMMM-yyyy'
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
     * Create/Update Method of single Training.
     * @param  {int} Array index of Training Model  
     * if training.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateTraining(id) {
      vm.model = vm.content;
      var training = vm.model[id];
      var postParams = {
        "title": training.data.title,
        "institute": training.data.institute,
        "fromDate": training.data.fromDate,
        "toDate": training.data.toDate
      }
      if (training.data.id) {
        var editTraining = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/trainingExperiences/' + training.data.id)
          .setPutMethod()
          .setPostParams(postParams);
        editTraining.execute().then(function(response) {
          training.isEditable = false;
        });
      } else {
        var saveTraining = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/trainingExperiences/')
          .setPostMethod()
          .setPostParams(postParams);
        saveTraining.execute().then(function(response) {
          training.data.id = response.id;
          training.isEditable = false;
          vm.addInProcess = false;
        });
      }
    }

    /**
     * Delete details of a single Training.
     * @param  {int} Array index of Training Model  
     */
    function deleteTraining(id) {
      vm.model = vm.content;
      var deferred = $q.defer();
      var training = vm.model[id];
      if (training.data.id) {
        var delTraining = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/trainingExperiences/' + training.data.id)
          .setDeleteMethod();
        if (window.confirm("Are you sure you want to delete '" + training.data.schoolName + "' ?")) {
          delTraining.execute().then(function(response) {
            vm.model.splice(id, 1);
          });
        }
      } else {
        vm.model.splice(id, 1);
        vm.addInProcess = false;
      }
    }

    /**
     * Edit details of a single Training.
     * @param  {int} Array index of Training Model  
     */
    function editForm(md) {
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addTrainingModel() {
      vm.content.push({
        isEditable: true
      });
      vm.addInProcess = true;
    }

    /*** CRUD Methods End***/

  }
})();
