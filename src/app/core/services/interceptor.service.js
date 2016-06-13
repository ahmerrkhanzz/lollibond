(function() {
  'use strict';

  angular
    .module('lollibond')
    .service('authInterceptor', authInterceptor);

  /** @ngInject */
  function authInterceptor($q, authService) {
    return {
      request: request
    };

    //////////////////////////////////
    function request(config) {
      var deferred = $q.defer();

      // For a user who is not logged in or not a user
      // He can view some of the public viewable content
      if (!authService.user) {
        config.headers = config.headers || {};
        // TODO: Replace the token when starfish is updated
        config.headers.Authorization = 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIzNzBiOThhMS03NWQzLTQ4ZDQtYmE5NS0xMjc1OWQ5ZGM5NzAiLCJleHAiOjE0NjUyMTE0MTUsIm5iZiI6MCwiaWF0IjoxNDY0Nzc5NDE1LCJpc3MiOiJodHRwOi8vZGV2MS5ib25kLmxvY2FsOjgwODAvYXV0aC9yZWFsbXMvbG9sbGlib25kIiwiYXVkIjoicGVhY29jayIsInN1YiI6ImExODBkNWNlLTQ1ZDgtNGY2OC05MjJiLTZlYjEzMzkzNWEyNSIsInR5cCI6IkJlYXJlciIsImF6cCI6InBlYWNvY2siLCJub25jZSI6ImMxYWVmMzI5LWQxYmQtNDY0OS05YjE2LTY5OThlY2MyZjI3OSIsInNlc3Npb25fc3RhdGUiOiJjMDRjNzBmMS02NmFlLTRiMzItYjllNC0yMjIyNGVjM2RkYjYiLCJjbGllbnRfc2Vzc2lvbiI6IjAyNWI1NjNjLTVkMjUtNGVlYS04NzUyLTc4ODQ1ZWEzODk0ZiIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50Iiwidmlldy1wcm9maWxlIl19fSwibmFtZSI6IldhcWFyIEFsaSIsInByZWZlcnJlZF91c2VybmFtZSI6IndhcWFyIiwibG9sbGlib25kX2lkIjotOTEyMzE0NTA2NzYyMjU2MjgxNSwiZ2l2ZW5fbmFtZSI6IldhcWFyIiwiZmFtaWx5X25hbWUiOiJBbGkiLCJlbWFpbCI6IndhcWFyLmFAYm9uZGluY28uY29tIn0.L4esvhiU17MCWzDduNEGKno_polRvn8MqjCeE1pezipCh7G3IkeSpMuGKY8tuRSSGbdzm2ZlYdvCLuWRG8wM4zOHd8SICPNt78VmVIy_rcfOuPdo7UFudRipoVZI89RniDddtF7wmwmeB6tv63vlBrqKWbBu3H284XOyDygE9_KSLTnezB6vx5_uzWsqrNOeHfHErTBVEfsdLF-_MBIWmVgGZi85SrsWeYVzw43E0eX1ECTSGmTvJg6FSOOokU0_BAazEwWz-I94igV75KPWATt8wv1iRMfGQisJEZ_oLhmdxD7eqkWreHDQUaMimR6efwEoSEpXPfe72YLvPctE6w';
        deferred.resolve(config);
      }
      // For a registered logged in user
      // Use the bearer token from keycloak
      else {
        if (authService.keycloak.token) {
          authService.keycloak.updateToken(5).success(function() {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + authService.keycloak.token;

            deferred.resolve(config);
          }).error(function() {
            deferred.reject('Failed to refresh token');
          });
        }
      }
      return deferred.promise;
    }
  }
})();
