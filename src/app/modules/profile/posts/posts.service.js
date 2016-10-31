(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .factory('postService', postService);

  /** @ngInject */
  function postService(baseService) {
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

      return new baseService()
        .setPath('peacock', '/user/' + UID + '/wall')
        .setGetParams({ lastPostId: lastId })
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Fetch the specific post with respect to ID
     * @param  {string} postId  ID for the post to be fetched
     * @return {obj}            Post data
     */
    function getPost(postId) {
      return new baseService()
        .setPath('peacock', '/post/' + postId)
        .execute(function(res) {
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

      return new baseService()
        .setPath('peacock', '/post/' + postId + '/comments')
        .setGetParams({ lastCommentId: lastId })
        .execute(function(res) {
          return res.data;
        });
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

      return new baseService()
        .setPath('peacock', '/post/' + postId + '/' + commentId + '/comments')
        .setGetParams({ lastCommentId: lastId })
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Push comment data to a respective post
     * @param  {string} parent  parent post ID
     * @param  {obj}    data    data to be posted
     * @return {obj}            Comment ID and data
     */
    function pushComment(parent, data) {
      return new baseService()
        .setPath('peacock', '/post/' + parent + '/comment')
        .setPostMethod()
        .setPostParams(data)
        .execute(function(res) {
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
      return new baseService()
        .setPath('peacock', '/post/' + parent + '/comment/' + commentId)
        .setDeleteMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Push the post to logged in user wall
     * @param  {obj} data data to be posted
     * @return {obj}      Post ID and data
     */
    function pushPostMyWall(data, postType) {
      var q = { type: postType || 1 };

      return new baseService()
        .setPath('peacock', '/post/')
        .setPostMethod()
        .setGetParams(q)
        .setPostParams(data)
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Push the post to other person wall
     * @param  {string} userId  user ID of the persons
     * @param  {obj}    data    data to be posted
     * @return {obj}            Post ID and data
     */
    function pushPostOtherWall(data, userId, postType) {
      var q = { type: postType || 1 };

      return new baseService()
        .setPath('peacock', '/post/' + userId)
        .setPostMethod()
        .setGetParams(q)
        .setPostParams(data.post)
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Updates the Post ACE count
     * @param  {int}  ID    ID for the post
     * @return {bool}       returns the post status
     */
    function acePost(ID) {
      return new baseService()
        .setPath('peacock', '/post/' + ID + '/ace')
        .setPostMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Updates the Post ACE count
     * @param  {int}  ID    ID for the post
     * @return {bool}       returns the post status
     */
    function unAcePost(ID) {
      return new baseService()
        .setPath('peacock', '/post/' + ID + '/ace')
        .setDeleteMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Updates the Comment ACE count
     * @param  {int}  ID    ID for the Comment
     * @return {bool}       returns the Comment status
     */
    function aceComment(ID) {
      return new baseService()
        .setPath('peacock', '/post/comment/' + ID + '/ace')
        .setPostMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Updates the Comment ACE count
     * @param  {int}  ID    ID for the Comment
     * @return {bool}       returns the Comment status
     */
    function unAceComment(ID) {
      return new baseService()
        .setPath('peacock', '/post/comment/' + ID + '/ace')
        .setDeleteMethod()
        .execute(function(res) {
          return res.data;
        });
    }
  }
})();
