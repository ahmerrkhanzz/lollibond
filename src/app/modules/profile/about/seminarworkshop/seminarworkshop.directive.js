(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('seminarWorkshop', seminarWorkshop);

  /** @ngInject */
  function seminarWorkshop() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {},
      controller: 'SeminarWorkshopController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/seminarworkshop/seminarworkshop.html'
    };
    return directive;
  }
})();
