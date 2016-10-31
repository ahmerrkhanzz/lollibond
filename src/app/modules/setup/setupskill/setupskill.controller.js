(function() {
  'use strict';

  angular
    .module('lollibond.setup')
    .controller('SetupSkillController', SetupSkillController);

  /** @ngInject */
  function SetupSkillController($state) {
    var vm = this;

    vm.options = {};
    vm.model = {};

    function loadSkills() {
      var skillsTag = [{
        id: "1",
        title: "PHP"
      }, {
        id: "2",
        title: "HTML5"
      }, {
        id: "3",
        title: "CSS3"
      }, {
        id: "4",
        title: "JavaScript"
      }, {
        id: "5",
        title: "MobileApplication"
      }, {
        id: "6",
        title: "Java"
      }, {
        id: "7",
        title: "Architect"
      }, {
        id: "8",
        title: "Marketing"
      }];

      return skillsTag;
    }

    // Formly Configuration Model
    vm.fields = [{
      fieldGroup: [{
        key: 'skills',
        type: 'tag',
        templateOptions: {
          label: 'Skills',
          displayProperty: 'title',
          loadList: loadSkills
        }
      }]
    }];


    function addSkills() {
      $state.go('setup.setupcontact');
    }

    // Function Assignment 
    vm.addSkills = addSkills;

  }
})();
