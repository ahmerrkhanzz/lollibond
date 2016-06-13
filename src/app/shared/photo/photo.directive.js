(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('photo', photo);

  function photo() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        photoData: '='
      },
      controller: 'PhotoController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/shared/photo/photo.html'
    };
    return directive;
  }
})();
