(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .factory('postService', postService);

  /** @ngInject */
  function postService($http) {
    return {
      loadPosts: loadPosts,
      getPost: getPost,
      getComments: getComments,
      getReplies: getReplies,
      pushPostMyWall: pushPostMyWall,
      pushPostOtherWall: pushPostOtherWall,
      pushComment: pushComment,
      deleteComment: deleteComment,
      acePost: acePost,
      unAcePost: unAcePost,
      aceComment: aceComment,
      unAceComment: unAceComment
    };

    /**
     * Fetch the posts data with respect to last id
     * @param  {string} UID ID for user to fetch post for
     * @param  {int} lastId ID for last fetched post
     * @return {arr}        Array of all posts
     */
    function loadPosts(UID, lastId) {
      // If last ID is not there forward empty string
      lastId = lastId || '';

      return $http.get('http://dev1.bond.local:9999/user/' + UID + '/wall?lastPostId=' + lastId)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Fetch the specific post with respect to ID
     * @param  {string} postId  ID for the post to be fetched
     * @return {obj}            Post data
     */
    function getPost(postId) {
      return $http.get('http://dev1.bond.local:9999/post/' + postId)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Fetch the comments on a specific post
     * @param  {string} postId  ID for the post to be fetched
     * @return {obj}            Comments data
     */
    function getComments(postId, lastId) {
      // If last ID is not there forward empty string
      lastId = lastId || '';

      return $http.get('http://dev1.bond.local:9999/post/' + postId + '/comments?lastCommentId=' + lastId)
        .then(function(res) {
          return res.data;
        })
    }

    /**
     * Fetch the replies on a specific comment on a post
     * @param  {string} postId    ID for the post
     * @param  {string} commentId ID for the comment
     * @return {obj}              List of replies
     */
    function getReplies(postId, commentId, lastId) {
      // If last ID is not there forward empty string
      lastId = lastId || '';

      return $http.get('http://dev1.bond.local:9999/post/' + postId + '/' + commentId + '/comments?lastCommentId=' + lastId)
        .then(function(res) {
          return res.data;
        })
    }

    /**
     * Push comment data to a respective post
     * @param  {string} parent  parent post ID
     * @param  {obj}    data    data to be posted
     * @return {obj}            Comment ID and data
     */
    function pushComment(parent, data) {
      return $http.post('http://dev1.bond.local:9999/post/' + parent + '/comment', data)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Delete a specific comment with respect to post
     * @param  {string} parent    parent post ID
     * @param  {string} commentId comment ID to be deleted
     * @return {bool}             status
     */
    function deleteComment(parent, commentId) {
      return $http.delete('http://dev1.bond.local:9999/post/' + parent + '/comment/' + commentId)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Push the post to logged in user wall
     * @param  {obj} data data to be posted
     * @return {obj}      Post ID and data
     */
    function pushPostMyWall(data) {
      return $http.post('http://dev1.bond.local:9999/post/', data)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Push the post to other person wall
     * @param  {string} userId  user ID of the persons
     * @param  {obj}    data    data to be posted
     * @return {obj}            Post ID and data
     */
    function pushPostOtherWall(data, userId) {
      return $http.post('http://dev1.bond.local:9999/post/' + userId, data)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Updates the Post ACE count
     * @param  {int}  ID    ID for the post
     * @return {bool}       returns the post status
     */
    function acePost(ID) {
      return $http.post('http://dev1.bond.local:9999/post/' + ID + '/ace')
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Updates the Post ACE count
     * @param  {int}  ID    ID for the post
     * @return {bool}       returns the post status
     */
    function unAcePost(ID) {
      return $http.delete('http://dev1.bond.local:9999/post/' + ID + '/ace')
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Updates the Comment ACE count
     * @param  {int}  ID    ID for the Comment
     * @return {bool}       returns the Comment status
     */
    function aceComment(ID) {
      return $http.post('http://dev1.bond.local:9999/post/comment/' + ID + '/ace')
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Updates the Comment ACE count
     * @param  {int}  ID    ID for the Comment
     * @return {bool}       returns the Comment status
     */
    function unAceComment(ID) {
      return $http.delete('http://dev1.bond.local:9999/post/comment/' + ID + '/ace')
        .then(function(res) {
          return res.data;
        });
    }
  }
})();
