(function() {
  'use strict';

  angular
    .module('lollibond.setting')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('personal.setting', {
        url: '/setting',
        templateUrl: 'app/modules/setting/setting.html',
        controller: 'SettingController',
        controllerAs: 'vm',
        resolve: {
          pageTitle: function() { return 'Settings | lollibond';}
        }
      })
      .state('personal.setting.accountinformation', {
        url: '/account-information',
        templateUrl: 'app/modules/setting/account-information/account-information.html',
        controller: 'AccountInformationController',
        controllerAs: 'vm',
        resolve: {
          pageTitle: function() { return 'Settings | Personal';}
        }
      })
      .state('personal.setting.privacysettings', {
        url: '/privacy-settings',
        templateUrl: 'app/modules/setting/privacy-settings/privacy-settings.html',
        controller: 'PrivacySettingsController',
        controllerAs: 'vm',
        resolve: {
          pageTitle: function() { return 'Settings | Privacy';}
        }
      })
      .state('personal.setting.bondtypes', {
        url: '/bond-types',
        templateUrl: 'app/modules/setting/bond-types/bond-types.html',
        controller: 'BondTypesController',
        controllerAs: 'vm',
        resolve: {
          pageTitle: function() { return 'Settings | Bond Types';}
        }
      });
  }
})();
