(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('personalProfile', personalProfile);

  /** @ngInject */
  function personalProfile() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        content: '='
      },
      controller: 'PersonalProfileController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/personalprofile/personalprofile.html'
    };
    return directive;

  }
})();
