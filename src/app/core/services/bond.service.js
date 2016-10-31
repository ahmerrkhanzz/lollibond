(function() {
  'use strict';

  angular
    .module('lollibond.core')
    .factory('bondService', bondService);

  /** @ngInject */
  function bondService(baseService) {
    var requestType = {
      SEND: '',
      ACCEPT: 'accept',
      REJECT: 'reject',
      SPAM: 'spam'
    };

    // Service available function declarations
    return {
      requestType: requestType,
      loadRequests: loadRequests,
      bondRequest: bondRequest,
      bondRequestsSent: bondRequestsSent,
      deleteRequest: deleteRequest,
      getBondTypes: getBondTypes,
      addBondType: addBondType,
      deleteBondType: deleteBondType,
      deleteBond: deleteBond,
      getBond: getBond,
      deleteBondedBondType: deleteBondedBondType,
      addUserToNewBondType: addUserToNewBondType,
      addUsertoOldBondType: addUsertoOldBondType,
      followUser: followUser,
      unfollowUser: unfollowUser,
      isFollowing: isFollowing
    };

    /**
     * Loads the bond requests for the logged in user
     * @param  {string} count     Count of all requests to be loaded
     * @param  {string} lastId    Id of last loaded request
     * @param  {string} lastTime  Last timestamp for last loaded request
     * @return {obj}              bond requests list
     */
    function loadRequests(count, lastId, lastTime) {
      // Default values
      count = count || '100';
      lastId = lastId || '9223372036854775807';
      lastTime = lastTime || '9123145067622562815';

      return new baseService()
        .setPath('peacock','/bond-request')
        .setGetParams({
          count: count,
          lastId: lastId,
          lastTimestamp: lastTime
        })
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Loads the List of bond requests received for the logged in user
     * @param  {string} lastTime  Last timestamp for last loaded request
     * @param  {string} count     Count of all requests to be loaded
     * @param  {string} lastId    Id of last loaded request
     * @return {obj}              list of bond requests sent
     */
    function bondRequestsSent(lastTime, count, lastId) {
      // Default values
      lastTime = lastTime || '9123145067622562815';
      count = count || '4';
      lastId = lastId || '9223372036854775807';

      return new baseService()
        .setPath('peacock','/bond-request/sent')
        .setGetParams({
          lastTimestamp: lastTime,
          count: count,
          lastId: lastId
        })
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Bond request Handler (Send, Accept, Decline, Spam)
     * @param  {string} userId  ID of the user to handle request for
     * @param  {string} type    type of action to take on request
     * @return {bool}           status of request
     */
    function bondRequest(userId, type) {
      type = type || '';

      return new baseService()
        .setPath('peacock','/bond-request/' + userId + '/' + type)
        .setPostMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Delete the bond request sent to other user
     * @param  {string} userId  ID of the other user
     * @return {bool}           status of request
     */
    function deleteRequest(userId) {
      return new baseService()
        .setPath('peacock','/bond-request/' + userId)
        .setDeleteMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Get all the bond types for current user
     * @return {obj} List of all the bond types
     */
    function getBondTypes() {
      return new baseService()
        .setPath('peacock','/user/bond-types')
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Add new bond type
     * @param {obj} bondTypeName newly added bond type
     */
    function addBondType(bondTypeName) {
      return new baseService()
        .setPath('peacock','/user/bond-types/' + bondTypeName)
        .setPostMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Delete an exsisting bond type of logged in user
     * @param  {int} bondTypeId  Id of the bond type to delete
     * @return {bool}            status of request
     */
    function deleteBondType(bondTypeId) {
      return new baseService()
        .setPath('peacock','/user/bond-types/' + bondTypeId)
        .setDeleteMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Delete the bond to the other bonded user
     * @param  {string} userId  Id of the other bonded user
     * @return {bool}           status of request
     */
    function deleteBond(userId) {
      return new baseService()
        .setPath('peacock','/user/' + userId + '/bond')
        .setDeleteMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Check the bond type for a given user
     * @param  {string} userId  Id of the user to check bond for
     * @return {obj}            List of associated bond types
     */
    function getBond(userId) {
      return new baseService()
        .setPath('peacock','/user/' + userId + '/bond')
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Delete a bond type with other bonded user
     * @param  {string} userId      Id of the other bonded user
     * @param  {int}    bondTypeId  Id of the bond type
     * @return {bool}               status of request
     */
    function deleteBondedBondType(userId, bondTypeId) {
      return new baseService()
        .setPath('peacock','/user/' + userId + '/bond/' + bondTypeId)
        .setDeleteMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Add a bonded user to a newly created bond type
     * @param  {string} userId        Id of the bonded user
     * @param  {string} bondTypeName  New bond type name
     * @return {obj}                  newly created bond type
     */
    function addUserToNewBondType(userId, bondTypeName) {
      return new baseService()
        .setPath('peacock','/user/' + userId + '/bond/' + bondTypeName)
        .setPostMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Add a bonded user to a previously created bond type
     * @param {string}  userId        Id of the bonded user
     * @param {int}     bondTypeId    Id of the bond type
     */
    function addUsertoOldBondType(userId, bondTypeId) {
      return new baseService()
        .setPath('peacock','/user/' + userId + '/bond/' + bondTypeId)
        .setPutMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Follow a specific user
     * @param  {string} userId  Id of the user to follow
     * @return {bool}           Status of request
     */
    function followUser(userId) {
      return new baseService()
        .setPath('peacock','/user/' + userId + '/follow')
        .setPostMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Unfollow a specific user which logged in user is already following
     * @param  {string} userId  Id of the user to follow
     * @return {bool}           Status of request
     */
    function unfollowUser(userId) {
      return new baseService()
        .setPath('peacock','/user/' + userId + '/follow')
        .setDeleteMethod()
        .execute(function(res) {
          return res.data;
        });
    }

    /**
     * Check if the user is already being followed
     * @param  {string} userId  Id of the user to follow
     * @return {bool}           Status if user is following or not
     */
    function isFollowing(userId) {
      return new baseService()
        .setPath('peacock','/user/' + userId + '/follow')
        .execute(function(res) {
          return res.data;
        });
    }
  }
})();
