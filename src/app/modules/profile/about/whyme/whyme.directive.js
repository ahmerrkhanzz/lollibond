(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('whyMe', whyMe);

  /** @ngInject */
  function whyMe() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        content: '='
      },
      controller: 'WhyMeController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/whyme/whyme.html'
    };
    return directive;
  }
})();
