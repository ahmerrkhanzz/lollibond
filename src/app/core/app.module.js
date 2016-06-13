(function() {
  'use strict';

  // 3rdparty libraries
  angular
    .module('3rdparty', [
      'ngAnimate',
      'ngCookies',
      'ngTouch',
      'ngSanitize',
      'ngMessages',
      'ngAria',
      'ngResource',
      'ui.router',
      'ui.bootstrap',
      'ngTagsInput',
      'ngFileUpload',
      // Angular translate (localization)
      'pascalprecht.translate',
      'tmh.dynamicLocale',
      // Formly (Used to make reuseable forms and apply validations)
      'formly',
      'formlyBootstrap',
      // Angular Slider input
      'rzModule',
      // Angular Affix and Scrollspy
      'sticky',
      'duScroll',
      // OCLazyload
      'oc.lazyLoad'
    ]);

  angular
    .module('lollibond.core', []);

  // Lollibond modules
  angular
    .module('lollibond', [
      '3rdparty',
      'lollibond.core',
      'lollibond.shared',
      'lollibond.profile',
      'lollibond.search',
      'lollibond.corporateprofile',
      'lollibond.feed'
    ]);

})();
