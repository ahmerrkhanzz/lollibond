(function() {
  'use strict';

  angular
    .module('lollibond')
    .config(translateConfig);

  /** @ngInject */
  function translateConfig($translateProvider, tmhDynamicLocaleProvider) {
    $translateProvider.useMissingTranslationHandlerLog();

    // Asynchronous loading of translation files
    $translateProvider.useStaticFilesLoader({
      prefix: 'translations/locale-', // path to translations files
      suffix: '.json' // suffix, currently- extension of the translations
    });
    $translateProvider.preferredLanguage('en_US'); // is applied on first load
    $translateProvider.useLocalStorage(); // saves selected language to localStorage

    // Translation for general stuff (date, time etc)
    tmhDynamicLocaleProvider.localeLocationPattern('../bower_components/angular-i18n/angular-locale_{{locale}}.js');
  }

})();
