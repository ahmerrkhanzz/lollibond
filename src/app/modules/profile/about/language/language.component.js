(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('language', {
      bindings: {
        content: '<',
        hasdata: "="
      },
      controller: LanguageController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/language/language.html'
    });

  /** @ngInject */
  function LanguageController($window, profileService, AddSection, aboutService, baseService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateLanguage = updateLanguage;
    vm.deleteLanguage = deleteLanguage;
    vm.addLanguageModel = addLanguageModel;
    vm.copyFields = AddSection.copyFields;
    vm.reset = reset;
    vm.langObj = {};
    vm.currentlySelectedLang = '';
    vm.orderBy = "-data.rate";

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.disabledAddMode = false;
    vm.langArr = [
      "",
      "Elementary proficiency",
      "Limited working proficiency",
      "Professional working proficiency",
      "Full professional proficiency",
      "Native or bilingual proficiency"
    ];
    var origModel = {};

    // function definition
    vm.model = {};

    vm.fields = [{
      className: 'col-md-4 pt-20',
      key: 'language',
      type: 'ui-select',
      templateOptions: {
        required: true,
        valueProp: 'value',
        labelProp: 'label',
        label: 'Language',
        options: [],
        focus: true,
        refresh: refreshLanguages,
        refreshDelay: 250
      },
      controller: function($scope) {
        if(vm.currentlySelectedLang){
          $scope.to.defaultValue = vm.langObj[vm.currentlySelectedLang];// "controlll";
        }
      }
    },{
      className: 'col-md-8',
      key: 'rate',
      type: 'slider',
      defaultValue: 1,
      templateOptions: {
        sliderOptions: {
          floor: 1,
          ceil: 5
        }
      }
    }];

    // Reset function
    function reset(idx) {
      if(vm.content[idx].id){
        vm.content[idx] = origModel;
        vm.content[idx].isEditable = false;
      }else{
        vm.content.splice(idx, 1);
      }
      vm.disabledAddMode = false;
      vm.orderBy = "-data.rate";
      if(vm.content.length == 0){
          vm.hasdata = false;
      }
    }

    // Refresh Suggestion list
    function refreshLanguages(val, field){
      return new baseService()
        .setPath('coral', '/api/v1/languages/search/' + val)
        .execute().then(function(response){
          var opt = [];
          angular.forEach(response, function(key, value){
            var isLangAdded = checkIsLangExists(value);
            if(!isLangAdded){
              this.push({
                label: value,
                value: key
              });
            }
          }, opt);
          field.templateOptions.options = opt;
        });
    }

    // Check if Language already added
    function checkIsLangExists(key) {
      for (var i = 0; i < vm.model.length; i++) {
        if(vm.model[i].language === key){
          return true
        }
      }
      return false;
    }

    // Get List of Languages
    function getLanguages() {
      return new baseService()
        .setPath('coral', '/api/v1/languages/list/en')
        .execute().then(function(response) {
          vm.langObj = response;
        });
    }


    // Initializing base functions
    function init(){
      getLanguages();
    }


    // CRUD Methods

    /**
     * Create/Update Method of single Language.
     * @param  {int} Array index of Language Model
     * if lang.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateLanguage(id) {
      if (vm.form.$valid) {
        vm.model = vm.content;
        var lang = vm.model[id];
        var postParams = {
          language: lang.language,
          rate: lang.rate,
          id: lang.id || ''
        };
        if (lang.id) {
          var editLanguage = aboutService.updateSection(aboutService.SECTION.LANGUAGE, postParams, lang.id);
          editLanguage.execute().then(function() {
            lang.isEditable = false;
            vm.disabledAddMode = false;
            vm.currentlySelectedLang = '';
            vm.orderBy = "-data.rate";
          });

        } else {
          var postResponse = aboutService.addSection(aboutService.SECTION.LANGUAGE, postParams);
          postResponse.execute().then(function(response) {
            lang.id = response.id;
            lang.isEditable = false;
            lang.addInProcess = false;
            vm.disabledAddMode = false;
            vm.currentlySelectedLang = '';
            vm.orderBy = "-data.rate";
          });
        }
      }
    }

    /**
     * Delete details of a single Language.
     * @param  {int} Array index of Language Model
     */
    function deleteLanguage(id) {
      vm.model = vm.content;
      var lang = vm.model[id];
      if (lang.id) {
        var delLanguage = aboutService.deleteSection(aboutService.SECTION.LANGUAGE, lang.id);
        delLanguage.execute().then(function() {
          vm.model.splice(id, 1);
          vm.disabledAddMode = false;
          vm.orderBy = "-data.rate";
          if(vm.model.length == 0){
            vm.hasdata = false;
          }
        });
      } else {
        vm.model.splice(id, 1);
        vm.disabledAddMode = false;
        vm.orderBy = "-data.rate";
        if(vm.model.length == 0){
          vm.hasdata = false;
        }
      }
    }

    /**
     * Edit details of a single Language.
     * @param  {int} Array index of Language Model
     */
    function editForm(md) {
      //Saving Data for Reset function
      origModel = angular.copy(md);
      vm.disabledAddMode = true;
      vm.currentlySelectedLang = md.language;

      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addLanguageModel() {
      vm.content.push({
        isEditable: true,
        addInProcess: true
      });

      vm.model = vm.content;
      vm.hasdata = true;
      vm.disabledAddMode = true;
    }

    /*** CRUD Methods End***/

    init();
  }
})();
