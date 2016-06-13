(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('awardsHonor', awardsHonor);

  /** @ngInject */
  function awardsHonor() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        content: "="
      },
      controller: 'AwardsHonorController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/awardshonor/awardshonor.html'
    };
    return directive;
  }
})();
