(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('ytPlayer', ytPlayer);

  /** @ngInject */
  function ytPlayer($window, $document) {
    var directive = {
      restrict: 'EA',
      scope: {
        width: '@',
        height: '@',
        videoId: '@'
      },
      link: linker,
      template: '<div></div>'
    };
    return directive;

    function linker(scope, el) {
      var checkScript = $document.querySelectorAll('script[src="https://www.youtube.com/iframe_api"]');

      if (checkScript.length === 0) {
        var tag = $document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = $document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      /* eslint-disable */
      var player;

      $window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player(el.children()[0], {
          playerVars: {
            autoplay: 0,
            html5: 1,
            theme: 'light',
            modesbranding: 0,
            color: "white",
            iv_load_policy: 3,
            showinfo: 1,
            controls: 1,
            origin: 'http://localhost:3000'
          },
          height: scope.height,
          width: scope.width,
          videoId: scope.videoId
        });
      };
    }
  }
})();
