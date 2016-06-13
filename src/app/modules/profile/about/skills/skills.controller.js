(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('SkillsController', SkillsController);

  /** @ngInject */
  function SkillsController($http,countriesPhoneCode) {
    var vm = this;

    // funcation assignment
    
    // variable assignment
    
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    init();
    vm.loadSkills = loadSkills;


    function loadSkills($query) {
      return $http.get('http://172.16.18.60:3004/skills', { cache: true}).then(function(response) {
        var skills = response.data;
        return skills.filter(function(skill) {
          return skill.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
      });
    }


    // function definition
    
   
    function init() {
      vm.model =  {
        "skills": [{
          "title": "PHP"
        }
      ]};


      vm.countriesPhoneCode = countriesPhoneCode;

      vm.fields = [{
        fieldGroup: [
          {
            key: 'skills',
            type: 'tag',
            templateOptions: {
              label: 'Skills',
              allowCustomInput: true,
              loadList: loadSkills,
              displayProperty: 'title'
            }
          }
        ]
      }];
    }
  }
})();
