(function() {
  'use strict';

  angular
    .module('lollibond.companypage')
    .controller('CompanyPageController', CompanyPageController);

  /** @ngInject */
  function CompanyPageController() {
    var vm = this;
    
    //Company page navigation collapse on small device
    vm.navbarCollapsed = true;

    //Company page navigation tabs
    vm.tabs = [{
      title: 'Post',
      icon: 'icon-magazine',
      route: 'personal.companypage.posts({ cid: "789456123" })'
    }, {
      title: 'About',
      icon: 'icon-insert-template',
      route: 'personal.companypage.about'
    }, {
      title: 'Gallery',
      icon: 'icon-images3',
      route: 'personal.companypage.gallery.album'
    }];
    
    vm.activeTab = 0;
  }
})();
