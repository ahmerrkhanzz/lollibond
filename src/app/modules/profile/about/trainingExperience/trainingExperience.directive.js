(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('trainingExperience', trainingExperience);

  /** @ngInject */
  function trainingExperience() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        content: "="
      },
      controller: 'TrainingExperienceController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/trainingExperience/trainingExperience.html'
    };
    return directive;
  }
})();
