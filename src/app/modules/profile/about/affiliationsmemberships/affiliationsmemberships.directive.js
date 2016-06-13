(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('affiliationsMemberships', affiliationsMemberships);

  /** @ngInject */
  function affiliationsMemberships() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        content: '='
      },
      controller: 'AffiliationsMembershipsController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/affiliationsmemberships/affiliationsmemberships.html'
    };
    return directive;
  }
})();
