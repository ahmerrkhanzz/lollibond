(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('experience', experience);

  /** @ngInject */
  function experience() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        "sectionAvailablity" : '=',
        "content" : '='
      },
      controller: 'ExperienceController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/experience/experience.html'
    };
    return directive;


  }
})();
