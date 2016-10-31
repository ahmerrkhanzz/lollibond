(function() {
  'use strict';

  // 3rdparty libraries
  angular
    .module('3rdparty', [
      'ngCookies',
      'ngTouch',
      'ngSanitize',
      'ngMessages',
      'ngAria',
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
      'mgo-angular-wizard',
      // Angular Slider input
      'rzModule',
      // Angular Affix and Scrollspy
      'sticky',
      'duScroll',
      'toaster',
      'ui.select',
      'ngTable'
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
      'lollibond.feed',
      'lollibond.setting',
      'lollibond.setup',
      'lollibond.companypage',
      'lollibond.pptraits'
    ]);

})();
