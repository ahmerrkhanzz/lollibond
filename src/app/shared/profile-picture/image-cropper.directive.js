(function() {
  'use strict';

  angular.module('lollibond.shared')
    .directive('lhCroppie', lhCroppie);

  /** @ngInject */
  function lhCroppie(lbUtilService) {
    return {
      restrict: 'E',
      scope: {
        src: '=',
        ngModel: '=',
        config: '=',
        setCroppieUrl: '=',
        photoType: '='
      },
      link: linker
    };

    function linker(scope, element) {

      /*if (!scope.src) {
        return;
      }*/

      // Container Height/Width according to PhotoType (ProfilePicture / CoverPhoto) 
      var VIEWPORT_DIMENSION = {};
      var BOUNDARY_DIMENSION = {};


      //Set Cordinates as per PhotoType 
      if (scope.photoType == 'profilePicture') {
        VIEWPORT_DIMENSION = { width: 200, height: 200 }
        BOUNDARY_DIMENSION = { width: 300, height: 300 }

      } else if (scope.photoType == 'coverPhoto') {
        VIEWPORT_DIMENSION = { width: 300, height: 64.2 }
        BOUNDARY_DIMENSION = { width: 500, height: 300 }
      }

      // Initiate Cropper 
      var c = new Croppie(element[0], {
        viewport: VIEWPORT_DIMENSION,
        boundary: BOUNDARY_DIMENSION,
        update: function() {
          c.result('canvas').then(function() {
            lbUtilService.safeApply.call(scope, function() {
              // scope.ngModel = img;
              scope.config = c.get();
            })
          });
        }
      });

      function setCroppieUrl(e) {
        // bind an image to croppie
        c.bind({
          url: e.target.result
        });
      }


      // Exposing functions to View
      scope.setCroppieUrl = setCroppieUrl;


    }
  }

})();
