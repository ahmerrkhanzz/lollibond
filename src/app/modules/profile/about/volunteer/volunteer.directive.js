(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('volunteeringExperience', volunteeringExperience);

  /** @ngInject */
  function volunteeringExperience() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        content: '='
      },
      controller: 'VolunteeringExperienceController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/volunteer/volunteer.html'
    };
    return directive;
  }
})();
