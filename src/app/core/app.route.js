(function() {
  'use strict';

  angular
    .module('lollibond')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('personal', {
        url: '/personal',
        abstract: true,
        template: "<main-header></main-header> \
                   <sub-header-blue></sub-header-blue>\
                   <div ui-view class='margin-topbar'></div>",
        data: {
          bodyClasses: 'individual',
          styleName: 'blue'
        }
      })
      .state('corporate', {
        url: '/corporate',
        abstract: true,
        template: "<main-header-green></main-header-green> \
                   <sub-header-green></sub-header-green>\
                   <div ui-view class='margin-topbar'></div>",
        data: {
          bodyClasses: 'corporate',
          styleName: 'green'
        }
      });

    $urlRouterProvider.otherwise('/personal/feed');
  }
})();
