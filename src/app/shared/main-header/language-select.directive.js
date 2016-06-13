(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('languageSelect', languageSelect);

  function languageSelect() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {},
      controller: LanguageSelectController,
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/shared/main-header/language-select.html'
    };
    return directive;
  }

  /** @ngInject */
  function LanguageSelectController(LocaleService) {
    var vm = this;

    vm.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
    vm.localesDisplayNames = LocaleService.getLocalesDisplayNames();
    vm.visible = vm.localesDisplayNames && vm.localesDisplayNames.length > 1;

    vm.changeLanguage = function(locale) {
      LocaleService.setLocaleByDisplayName(locale);
      vm.currentLocaleDisplayName = locale;
    };
  }
})();
