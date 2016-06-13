(function() {
  'use strict';

  angular
    .module('lollibond')
    .config(interceptConfig);

  /** @ngInject */
  function interceptConfig($httpProvider) {
    $httpProvider.interceptors.push('errorInterceptor');
    $httpProvider.interceptors.push('authInterceptor');
  }

})();
