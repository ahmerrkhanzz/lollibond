(function() {
  'use strict';

  angular
    .module('lollibond.search')
    .factory('searchService', searchService);

  /** @ngInject */
  function searchService(baseService) {
    return {
      searchUserQuery: searchUserQuery
    };

    /**
     * Fetch the specific post with respect to ID
     * @param  {string} postId  ID for the post to be fetched
     * @return {obj}            Post data
     */
    function searchUserQuery(page, params) {
      var newParams = angular.copy(params);

      // Wrap the keyword in asterik for loose match
      if (angular.isDefined(newParams['keywords'])) newParams['keywords'] = '*' + newParams['keywords'] + '*';

      newParams.page = page;

      return new baseService()
        .setPath('peacock', '/user/search')
        .setGetParams(newParams)
        .execute(function(res) {
          return res.data;
        });
    }
  }
})();
