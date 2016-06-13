(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('LanguageController', LanguageController);

  /** @ngInject */
  function LanguageController($http, countries, $resource, $scope,languages, baseService, $q, profileService, AddSection) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateLanguage = updateLanguage;
    vm.deleteLanguage = deleteLanguage;
    vm.addLanguageModel = addLanguageModel;
    vm.copyFields = AddSection.copyFields;

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.addInProcess = false;

    // function definition
    vm.model = {};

    vm.fields = [{
      key: 'language',
      type: 'typeahead',
      templateOptions: {
        required: true,
        label: 'Language',
        options: languages
      }
    }, {
      className: 'section-label col-md-2',
      template: '<legend class="text-semibold"> Rate </legend>'
    }, {
      className: 'col-md-10',
      key: 'rate',
      type: 'slider',
      templateOptions: {
        sliderOptions: {
          floor: 0,
          ceil: 5
        }
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
     * Create/Update Method of single Language.
     * @param  {int} Array index of Language Model  
     * if lang.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateLanguage(id) {
      vm.model = vm.content;
      var lang = vm.model[id];
      var postParams = {
          "language": lang.data.language,
          "rate": lang.data.rate
        }
      if (lang.data.id) {
        var editLanguage = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/languageProficiencies/' + lang.data.id)
          .setPutMethod()
          .setPostParams(postParams);
        editLanguage.execute().then(function(response) {
          lang.isEditable = false;
        });
      } else {
        var saveLanguage = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/languageProficiencies/')
          .setPostMethod()
          .setPostParams(postParams);
        saveLanguage.execute().then(function(response) {
          lang.data.id = response.id;
          lang.isEditable = false;
          vm.addInProcess = false;
        });
      }
    }

    /**
     * Delete details of a single Language.
     * @param  {int} Array index of Language Model  
     */
    function deleteLanguage(id) {
      vm.model = vm.content;
      var deferred = $q.defer();
      var lang = vm.model[id];
      if (lang.data.id) {
        var delLanguage = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/languageProficiencies/' + lang.data.id)
          .setDeleteMethod();
        if (window.confirm("Are you sure you want to delete '" + lang.data.schoolName + "' ?")) {
          delLanguage.execute().then(function(response) {
            vm.model.splice(id, 1);
          });
        }
      } else {
        vm.model.splice(id, 1);
        vm.addInProcess = false;
      }
    }

    /**
     * Edit details of a single Language.
     * @param  {int} Array index of Language Model  
     */
    function editForm(md) {
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addLanguageModel() {
      vm.content.push({
        isEditable: true
      });
      vm.addInProcess = true;
    }

    /*** CRUD Methods End***/

  }
})();
