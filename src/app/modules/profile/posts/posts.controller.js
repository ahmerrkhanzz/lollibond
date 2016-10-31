(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('PostsController', PostsController);

  /** @ngInject */
  function PostsController($scope, profileService, postService) {
    var vm = this;
    var lastLoadedPostID = '';

    vm.wallPosts = [];
    vm.profileService = profileService;
    vm.postsLoading = true;
    vm.postAvailable = true;

    function loadPostData(ID) {
      // Show the loader while loading posts
      vm.postsLoading = true;
      postService.loadPosts(profileService.profileId, ID)
        .then(function(data) {
          // Check for post availability
          if (data.length === 0) {
            vm.postAvailable = false;
            return false;
          }

          vm.wallPosts.push(data);
          // Flatten the array
          vm.wallPosts = [].concat.apply([], vm.wallPosts);
        }, function() {
          // Error handling on feed
          vm.postAvailable = false;
        })
        .finally(function() {
          // Hide the loader
          vm.postsLoading = false;
          // Infinite scroll function that is called
          // to check if lb-infinite-scroll is visible on view
          if (vm.postAvailable) {
            $scope.$broadcast('visibleOnView');
          }
        });
    }

    function loadMore() {
      // Check if loading call already made
      // if yes then do not make another call
      if (vm.postsLoading) {
        return false;
      }
      var totalPosts = vm.wallPosts.length - 1;
      var lastPostId = vm.wallPosts[totalPosts].id;
      loadPostData(lastPostId);
    }

    function init() {
      loadPostData(lastLoadedPostID);
    }

    // This method is shared to the create post component
    // and called when share button is triggered
    // to update the posts list
    function postUpdate(data) {
      vm.wallPosts.unshift(data);
    }

    // This method is shared to the create post component
    // and called when share button is triggered
    // to decide which service method to use
    function shareMethod(data, type) {
      return profileService.ownProfile ?
        postService.pushPostMyWall(data, type) :
        postService.pushPostOtherWall(data, profileService.profileId, type);
    }

    init();

    ////////////////////////////////////
    vm.loadMore = loadMore;
    vm.shareMethod = shareMethod;
    vm.postUpdate = postUpdate;
  }
})();
