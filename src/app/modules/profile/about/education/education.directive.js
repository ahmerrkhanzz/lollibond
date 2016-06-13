(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('education', education);

  /** @ngInject */
  function education() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        "sectionAvailablity" : '=',
        "content": "="
      },
      controller: 'EducationController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/education/education.html'
    };
    return directive;


  }
})();
