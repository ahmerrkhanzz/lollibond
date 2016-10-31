(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('lbUtilDetectLink', lbUtilDetectLink);

  /** @ngInject */
  function lbUtilDetectLink() {
    var directive = {
      restrict: 'A',
      scope: {
        callOnDetect: '&',
        isUsing: '='
      },
      link: linker
    };
    return directive;

    function linker(scope, el) {
      var REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
      var KEYCODE_SPACE = 32;
      var ignoreList = [];

      var clearIgnoreList = scope.$on('clearIgnoreList', function() {
        ignoreList = [];
      });

      function checkOnType(event) {
        var matchedUrls = this.value.match(REGEX);
        var key = event.which || event.keyCode || event.charCode;

        if (key === KEYCODE_SPACE && matchedUrls && !scope.isUsing) {
          var result = unique(matchedUrls, ignoreList);
          if (result.length === 0) return;

          scope.callOnDetect({ url: result[0] });
          ignoreList.push(result[0]);
        }

        if (event.target.value.length === 0) {
          ignoreList = [];
        }
      }

      function unique(arr1, arr2) {
        return arr1.filter(function(item) {
          return arr2.indexOf(item) < 0;
        });
      }

      function checkOnPaste(event) {
        var matchedUrls = event.originalEvent.clipboardData.getData('text').match(REGEX);

        if (matchedUrls && !scope.isUsing) {
          var result = unique(matchedUrls, ignoreList);
          if (result.length === 0) return;

          scope.callOnDetect({ url: result[0] });
          ignoreList.push(result[0]);
        }
      }

      function cleanup() {
        el.off('keyup', checkOnType);
        el.off('paste', checkOnPaste);
        clearIgnoreList();
      }

      // Event Bindings
      el.on('keyup', checkOnType);
      el.on('paste', checkOnPaste);

      // Remove bindings on destroy
      scope.$on('$destroy', cleanup);
    }
  }
})();
