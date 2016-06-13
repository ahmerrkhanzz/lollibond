(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('skills', skills);

  /** @ngInject */
  function skills() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {},
      controller: 'SkillsController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/skills/skills.html'
    };
    return directive;
  }
})();
