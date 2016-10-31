(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('lbMediaLink', {
      bindings: {
        mediaData: '<',
        deleteMedia: '&?'
      },
      controller: LbMediaLink,
      controllerAs: 'vm',
      templateUrl: 'app/shared/lb-media-link/lb-media-link.html'
    });

  /** @ngInject */
  function LbMediaLink($sce) {
    var vm = this;

    vm.videoPlaying = false;
    vm.playerWidth = 360;
    vm.playerHeight = 215;

    function trustUrl(url) {
      var urlTrusted;

      if (url.indexOf('youtube') >= 0) {
        urlTrusted = url.replace('watch?v=', 'embed/');
      } else if (url.indexOf('vimeo') >= 0) {
        urlTrusted = url.replace('vimeo.com/', 'player.vimeo.com/video/');
      } else if (url.indexOf('dailymotion') >= 0) {
        urlTrusted = url.replace('video/', 'embed/video/');
      }

      return $sce.trustAsResourceUrl(urlTrusted);
    }

    /*function urlCheck(url){
      var findUrlName;

      if (url.indexOf('youtube') >= 0) {
        findUrlName = 'youtube';
      } else if (url.indexOf('vimeo') >= 0) {
        findUrlName = 'vimeo';
      } else if (url.indexOf('dailymotion') >= 0) {
        findUrlName = 'dailymotion';
      }  

      return findUrlName;
    }*/

    /////////////////////////////
    vm.trustUrl = trustUrl;
    //vm.urlCheck = urlCheck; 
  }
})();
