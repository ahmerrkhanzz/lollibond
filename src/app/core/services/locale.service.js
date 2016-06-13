(function() {
  'use strict';

  angular
    .module('lollibond')
    .service('LocaleService', LocaleService);

  /** @ngInject */
  function LocaleService($translate, LOCALES, $rootScope, tmhDynamicLocale, $log, $document) {
    // PREPARING LOCALES INFO
    var localesObj = LOCALES.locales;

    // locales and locales display names
    var _LOCALES = Object.keys(localesObj);
    if (!_LOCALES || _LOCALES.length === 0) {
      $log.error('There are no _LOCALES provided');
    }
    var _LOCALES_DISPLAY_NAMES = [];
    _LOCALES.forEach(function(locale) {
      _LOCALES_DISPLAY_NAMES.push(localesObj[locale]);
    });

    // STORING CURRENT LOCALE
    var currentLocale = $translate.proposedLanguage() || $translate.use(); // because of async loading

    // METHODS
    var checkLocaleIsValid = function(locale) {
      return _LOCALES.indexOf(locale) !== -1;
    };

    var setLocale = function(locale) {
      if (!checkLocaleIsValid(locale)) {
        $log.error('Locale name "' + locale + '" is invalid');
        return;
      }
      // if the changed lang is same as current
      if (currentLocale === locale) {
        return;
      }
      currentLocale = locale; // updating current locale
      // asking angular-translate to load and apply proper translations
      $translate.use(locale).then(function() {
        location.reload();
      });
    };

    // Method for checking the direction for document
    function setDocAttrs(locale) {
      var direction = locale === 'ar_AE' ? 'rtl' : 'ltr';
      locale = locale || $translate.use();
      $document.context.documentElement.setAttribute('lang', locale); // sets "lang" attribute to html
      $document.context.documentElement.setAttribute('dir', direction); // sets "dir" attribute to html
    }

    return {
      getLocaleDisplayName: function() {
        setDocAttrs(currentLocale);
        return localesObj[currentLocale];
      },
      setLocaleByDisplayName: function(localeDisplayName) {
        setLocale(
          _LOCALES[
            _LOCALES_DISPLAY_NAMES.indexOf(localeDisplayName) // get locale index
          ]
        );
      },
      getLocalesDisplayNames: function() {
        return _LOCALES_DISPLAY_NAMES;
      }
    };
  }
})();
