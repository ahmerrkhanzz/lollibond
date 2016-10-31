(function() {
    'use strict';

    angular
      .module('lollibond.setting')
      .controller('SettingController', SettingController);

    /** @ngInject */
    function SettingController() {
      var vm = this;

      // Account setting navigation collapse on small device
      vm.navbarCollapsed = true;

      // Account setting navigation tabs
      vm.tabs = [{
        title: 'Account Information',
        route: 'personal.setting.accountinformation'
      }, {
        title: 'Privacy Settings',
        route: 'personal.setting.privacysettings'
      }, {
        title: 'Bond Types',
        route: 'personal.setting.bondtypes'
      }];
      vm.activeTab = 0;
    
    }
})();
