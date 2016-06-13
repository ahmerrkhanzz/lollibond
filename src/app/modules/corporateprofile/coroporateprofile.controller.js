(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('CorporateProfileController', CorporateProfileController);

  /** @ngInject */
  function CorporateProfileController() {
    var vm = this;

    // Profile navigation collapse on small device
    vm.navbarCollapsed = true;

    // Profile navigation tabs
    vm.tabs = [{
      title: 'Post',
      icon: 'icon-magazine',
      route: 'corporateprofile.posts'
    }, {
      title: 'About',
      icon: 'icon-insert-template',
      route: 'corporateprofile.about'
    }, {
      title: 'Employees',
      icon: 'icon-collaboration',
      route: 'corporateprofile.network'
    }, {
      title: 'Jobs',
      icon: 'icon-images3',
      route: 'corporateprofile.gallery'
    }];
    vm.activeTab = 0;
  }
})();
