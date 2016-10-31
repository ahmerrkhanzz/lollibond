(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('skills', {
      bindings: {
        userSkills: '=content',
        hasSkillsData: "=hasdata"
      },
      controller: SkillsController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/skills/skills.html'
    });


  function SkillsController($http, baseService, profileService) {
    var vm = this;

    vm.profileService = profileService;
    vm.isEditable = false;
    
    function actionAce(isAced, skillId, idx) {
      if (isAced) {
        unAceSkill(skillId, idx);
      } else {
        aceSkill(skillId, idx);
      }
    }

    function unAceSkill(skillId, idx) {
      return new baseService()
        .setPath('peacock', '/user/me/skills/' + skillId + '/ace')
        .setDeleteMethod()
        .execute()
        .then(function() {
          vm.userSkills[idx].aced = false;
          vm.userSkills[idx].aceCount = vm.userSkills[idx].aceCount - 1;
        });
    }

    function aceSkill(skillId, idx) {
      return new baseService()
        .setPath('peacock', '/user/me/skills/' + skillId + '/ace')
        .setPostMethod()
        .setPostParams(skillId)
        .execute()
        .then(function() {
          vm.userSkills[idx].aced = true;
          vm.userSkills[idx].aceCount = vm.userSkills[idx].aceCount + 1;
        });
    }

    function deleteSkills(skillId, index) {
      return new baseService()
        .setPath('peacock', '/user/me/skills/' + skillId)
        .setDeleteMethod()
        .execute()
        .then(function() {
          vm.userSkills.splice(index, 1);
        });
    }

    function toggleAddView() {
      vm.isEditable = !vm.isEditable;
    }

    function addSkill() {
      var skill = vm.skillsModel;
      var checkSkill = checkIsSkillExists(skill.name);

      if (!checkSkill) {
        return new baseService()
          .setPath('peacock', '/user/me/skills/')
          .setPostMethod()
          .setPostParams(skill)
          .execute()
          .then(function(response) {
            updatedSkillsList(response);
            vm.skillsModel.name = "";
            vm.skillsForm.$setPristine();
          });
      } else {
        alert("skill already exist");
      }
    }

    


    function updatedSkillsList(newSkill) {
      vm.userSkills.unshift(freshSkill(newSkill));
    }

    function freshSkill(newSkill) {
      return {
        id: newSkill.id,
        name: newSkill.name,
        aceCount: 0,
        aced: false

      }
    }

    function checkIsSkillExists(skill) {
      for (var i = 0; i < vm.userSkills.length; i++) {
        if (vm.userSkills[i].name === skill) {
          return true
        }
      }
      return false;
    }

    // Refresh Suggestion list for Skills
    function refreshSkills(val) {
      // Detemine string of whitespaces
      var expression = /^\s+$/g;
      var regex = new RegExp(expression);

      if (!val.match(regex)) {
        return new baseService()
          .setPath('coral', '/api/v1/skills/search/' + val)
          .execute()
          .then(function(response) {
            return response;
          });
      } else {
        return [];
      }
    }

    ////////////////////
    vm.actionAce = actionAce;
    vm.deleteSkills = deleteSkills;
    vm.toggleAddView = toggleAddView;
    vm.addSkill = addSkill
    vm.refreshSkills = refreshSkills;
  }
})();
