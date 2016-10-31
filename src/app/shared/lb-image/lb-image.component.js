(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('lbImage', {
      bindings: {
        src: '@',
        width: '@',
        height: '@',
        imgType: '@',
        imgClass: '@?',
        isLoading: '=?'
      },
      controller: LbImage,
      controllerAs: 'vm',
      template: '<img ng-src="{{vm.loadedImg}}" ng-class="vm.imgClass">'
    });

  /** @ngInject */
  function LbImage($scope, $element, lbUtilService) {
    var vm = this;
    var MEDIA_SERVER_URL = 'https://s3-us-west-2.amazonaws.com/bondtestupload/';
    var STATIC_PATH_REGEX = /^assets/;
    var type = vm.imgType || 'p';

    function getUrl(width, height, key) {
      var dimensions = type + width + 'x' + height + '/';

      if (key < 1) return;

      if (STATIC_PATH_REGEX.test(key)) return key;

      if (!width) {
        return MEDIA_SERVER_URL + key;
      } else {
        return MEDIA_SERVER_URL + dimensions + key;
      }
    }

    angular.element($element)
      .find('img')
      .on('load', function() {
        lbUtilService.safeApply.call($scope, function() {
          vm.isLoading = false;
        });
      });

    $scope.$watch('vm.src', function(mediaKey) {
      var img = getUrl(vm.width, vm.height, mediaKey);
      vm.loadedImg = img;
    });
  }
})();
