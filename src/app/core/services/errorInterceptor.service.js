(function() {
  'use strict';

  angular
    .module('lollibond')
    .service('errorInterceptor', errorInterceptor);

  /** @ngInject */
  function errorInterceptor($q, authService, $log) {
    return function(promise) {
      return promise.then(function(response) {
        return response;
      }, function(response) {
        if (response.status == 401) {
          $log.log('session timeout?');
          authService.logout();
        } else if (response.status == 403) {
          alert("Forbidden");
        } else if (response.status == 404) {
          alert("Not found");
        } else if (response.status) {
          if (response.data && response.data.errorMessage) {
            alert(response.data.errorMessage);
          } else {
            alert("An unexpected server error has occurred");
          }
        }
        return $q.reject(response);
      });
    };
  }
})();
