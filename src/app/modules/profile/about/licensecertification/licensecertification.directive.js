(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('licenseCertification', licenseCertification);

  /** @ngInject */
  function licenseCertification() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        content: "=",
      },
      controller: 'LicenseCertificationController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/licensecertification/licensecertification.html'
    };
    return directive;
  }
})();
