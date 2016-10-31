(function() {
  'use strict';

  angular
    .module('lollibond.feed')
    .factory('feedService', feedService);

  /** @ngInject */
  function feedService(baseService) {
    return {
      loadFeed: loadFeed
    };

    /**
     * Load the user feeds
     * @param  {int} index Snapshot index
     * @return {arr}       List of user feeds
     */
    function loadFeed(index, snapshot) {
      var data = {};

      if (snapshot) {
        data.snapshot = snapshot;
      }
      data.index = index || '0';

      return new baseService()
        .setPath('peacock','/user/me/feed')
        .setGetParams(data)
        .execute(function(res) {
          return res.data;
        });
    }
  }
})();
