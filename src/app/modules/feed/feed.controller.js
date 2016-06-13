(function() {
  'use strict';

  angular
    .module('lollibond.feed')
    .controller('FeedController', FeedController);

  /** @ngInject */
  function FeedController(authService, postService) {
    var vm = this;
    var lastLoadedPostID = '';

    vm.wallPosts = [];

    function loadPostData(ID) {
      postService.loadPosts(authService.UID, ID)
        .then(function(data) {
          vm.wallPosts.push(data);
          // Flatten the array
          vm.wallPosts = [].concat.apply([], vm.wallPosts);
        });
    }

    function loadMore() {
      var totalPosts = vm.wallPosts.length - 1;
      var lastPostId = vm.wallPosts[totalPosts].post.id;
      loadPostData(lastPostId);
    }

    function init() {
      loadPostData(lastLoadedPostID);
    }

    function shareMethod(data) {
      return authService.ownProfile ?
        postService.pushPostMyWall(data) :
        postService.pushPostOtherWall(data, authService.UID);
    }

    init();

    ////////////////////////////////////
    vm.loadMore = loadMore;
    vm.shareMethod = shareMethod;
  }
})();
