(function() {
  'use strict';

  angular
    .module('lollibond.feed')
    .controller('FeedController', FeedController);

  /** @ngInject */
  function FeedController($scope, feedService, postService, authService) {
    var vm = this;
    var lastLoadedPostID = 0;

    var DTO_TYPE = {
      POST: 'class com.lollibond.starfish.dto.post.PostDTO',
      USER: 'class com.lollibond.starfish.dto.user.UserSummaryDTO',
      COMMENT: 'class com.lollibond.starfish.dto.comment.CommentDTO'
    };

    vm.wallPosts = [];
    vm.postsLoading = true;
    vm.postAvailable = true;
    vm.currentSnapshot = '';

    function loadPostData(index, snapshot) {
      // Show the loader while loading posts
      vm.postsLoading = true;

      feedService.loadFeed(index, snapshot)
        .then(function(data) {
          // When there are no more feeds the data.activities would be null
          if (!data.activities) {
            vm.postAvailable = false;
            return false;
          }

          // Save the snapshot in model
          vm.currentSnapshot = data.snapshot;
          vm.wallPosts.push(data.activities);
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
      // This will stop from making another request
      // if a request is already in process
      if (vm.postsLoading) {
        return false;
      }
      lastLoadedPostID += 10;
      loadPostData(lastLoadedPostID, vm.currentSnapshot);
    }

    function init() {
      loadPostData(lastLoadedPostID);
    }

    // This method is shared to the create post component
    // and called when share button is triggered
    // to update the feed list
    function postUpdate(data) {
      var arr = [];
      arr.object = data;
      // Add the verb and object type to newly created data
      arr.verb = 'created';
      arr.objectType = DTO_TYPE.POST;
      arr.targetType = DTO_TYPE.USER;
      vm.wallPosts.unshift(arr);
    }

    // This method is shared to the create post component
    // and called when share button is triggered
    // to decide which service method to use
    function shareMethod(data, type) {
      return postService.pushPostMyWall(data, type);
    }

    function getUserName(userInfo, loggedUserPlaceholder, otherUserPlaceholder) {
      if (authService.UID === userInfo.id) return loggedUserPlaceholder;
      else if (otherUserPlaceholder) return otherUserPlaceholder;
      else return userInfo.firstName + ' ' + userInfo.lastName;
    }

    function isPosted(activity) {
      return activity.verb === 'created' &&
        activity.objectType === DTO_TYPE.POST &&
        activity.targetType === DTO_TYPE.USER;
    }

    function isCommented(activity) {
      return activity.verb === 'created' &&
        activity.objectType === DTO_TYPE.COMMENT &&
        activity.targetType === DTO_TYPE.POST;
    }

    function isAcedPost(activity) {
      return activity.verb === 'aced' &&
        activity.objectType === DTO_TYPE.POST &&
        activity.targetType === DTO_TYPE.USER;
    }

    function isAcedComment(activity) {
      return activity.verb === 'aced' &&
        activity.objectType === DTO_TYPE.COMMENT &&
        activity.targetType === DTO_TYPE.POST;
    }

    function isBonded(activity) {
      return activity.verb === 'bonded' &&
        activity.objectType === DTO_TYPE.USER &&
        activity.targetType === null;
    }

    init();

    ////////////////////////////////////
    vm.loadMore = loadMore;
    vm.shareMethod = shareMethod;
    vm.postUpdate = postUpdate;
    vm.isPosted = isPosted;
    vm.isCommented = isCommented;
    vm.isAcedPost = isAcedPost;
    vm.isAcedComment = isAcedComment;
    vm.isBonded = isBonded;
    vm.getUserName = getUserName;
  }
})();
