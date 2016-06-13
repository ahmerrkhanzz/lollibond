(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .directive('publication', publication);

  function publication() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        "sectionAvailablity" : '=',
        "content": "="
      },
      controller: 'PublicationController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/modules/profile/about/publication/publication.html'
    };
    return directive;
  }
})();
