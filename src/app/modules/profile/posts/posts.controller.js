(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('PostsController', PostsController);

  /** @ngInject */
  function PostsController(profileService, postService) {
    var vm = this;
    var lastLoadedPostID = '';

    vm.wallPosts = [];
    vm.profileService = profileService;

    function loadPostData(ID) {
      postService.loadPosts(profileService.profileId, ID)
        .then(function(data) {
          vm.wallPosts.push(data);
          // Flatten the array
          vm.wallPosts = [].concat.apply([], vm.wallPosts);
        });
    }

    function loadMore() {
      var totalPosts = vm.wallPosts.length - 1;
      var lastPostId = vm.wallPosts[totalPosts].id;
      loadPostData(lastPostId);
    }

    function init() {
      loadPostData(lastLoadedPostID);
    }

    function shareMethod(data) {
      return profileService.ownProfile ?
        postService.pushPostMyWall(data) :
        postService.pushPostOtherWall(data, profileService.profileId);
    }

    init();

    ////////////////////////////////////
    vm.loadMore = loadMore;
    vm.shareMethod = shareMethod;
  }
})();
