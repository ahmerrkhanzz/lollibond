(function() {
  'use strict';

  angular
    .module('lollibond.core')
    .factory('bondService', bondService);

  /** @ngInject */
  function bondService($http) {
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
     * @param  {string} lastTime  Last timestamp for last loaded request
     * @param  {string} count     Count of all requests to be loaded
     * @param  {string} lastId    Id of last loaded request
     * @return {obj}              bond requests list
     */
    function loadRequests(lastTime, count, lastId) {
      // Default values
      lastTime = lastId || '9123145067622562815';
      count = count || '4';
      lastId = lastId || '9223372036854775807';

      return $http.get('http://dev1.bond.local:9999/bond-request?lastTimestamp=' + lastTime + '&count=' + count + '&lastId=' + lastId)
        .then(function(res) {
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

      return $http.post('http://dev1.bond.local:9999/bond-request/' + userId + '/' + type)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Delete the bond request sent to other user
     * @param  {string} userId  ID of the other user
     * @return {bool}           status of request
     */
    function deleteRequest(userId) {
      return $http.delete('http://dev1.bond.local:9999/bond-request/' + userId)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Get all the bond types for current user
     * @return {obj} List of all the bond types
     */
    function getBondTypes() {
      return $http.get('http://dev1.bond.local:9999/user/bond-types')
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Add new bond type
     * @param {obj} bondTypeName newly added bond type
     */
    function addBondType(bondTypeName) {
      return $http.post('http://dev1.bond.local:9999/user/bond-types/' + bondTypeName)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Delete an exsisting bond type of logged in user
     * @param  {int} bondTypeId  Id of the bond type to delete
     * @return {bool}            status of request
     */
    function deleteBondType(bondTypeId) {
      return $http.delete('http://dev1.bond.local:9999/user/bond-types/' + bondTypeId)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Delete the bond to the other bonded user
     * @param  {string} userId  Id of the other bonded user
     * @return {bool}           status of request
     */
    function deleteBond(userId) {
      return $http.delete('http://dev1.bond.local:9999/user/' + userId + '/bond')
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Check the bond type for a given user
     * @param  {string} userId  Id of the user to check bond for
     * @return {obj}            List of associated bond types
     */
    function getBond(userId) {
      return $http.get('http://dev1.bond.local:9999/user/' + userId + '/bond')
        .then(function(res) {
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
      return $http.delete('http://dev1.bond.local:9999/user/' + userId + '/bond/' + bondTypeId)
        .then(function(res) {
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
      return $http.post('http://dev1.bond.local:9999/user/' + userId + '/bond/' + bondTypeName)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Add a bonded user to a previously created bond type
     * @param {string}  userId        Id of the bonded user
     * @param {int}     bondTypeId    Id of the bond type
     */
    function addUsertoOldBondType(userId, bondTypeId) {
      return $http.put('http://dev1.bond.local:9999/user/' + userId + '/bond/' + bondTypeId)
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Follow a specific user
     * @param  {string} userId  Id of the user to follow
     * @return {bool}           Status of request
     */
    function followUser(userId) {
      return $http.post('http://dev1.bond.local:9999/user/' + userId + '/follow')
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Unfollow a specific user which logged in user is already following
     * @param  {string} userId  Id of the user to follow
     * @return {bool}           Status of request
     */
    function unfollowUser(userId) {
      return $http.delete('http://dev1.bond.local:9999/user/' + userId + '/follow')
        .then(function(res) {
          return res.data;
        });
    }

    /**
     * Check if the user is already being followed
     * @param  {string} userId  Id of the user to follow
     * @return {bool}           Status if user is following or not
     */
    function isFollowing(userId) {
      return $http.get('http://dev1.bond.local:9999/user/' + userId + '/follow')
        .then(function(res) {
          return res.data;
        });
    }
  }
})();
