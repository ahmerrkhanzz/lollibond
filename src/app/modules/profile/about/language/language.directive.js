(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('language', language);

  /** @ngInject */
  function language() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        "sectionAvailablity" : '=',
        "content" : '='
      },
      controller: 'LanguageController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/language/language.html'
    };
    return directive;

  }
})();
