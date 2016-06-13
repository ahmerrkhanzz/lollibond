(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('school', school);

  /** @ngInject */
  function school() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        "sectionAvailablity" : '=',
        "content": "="
      },
      controller: 'SchoolController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/school/school.html'
    };
    return directive;


  }
})();
