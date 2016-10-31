(function() {
  'use strict';

  angular
    .module('lollibond.companypage')
    .controller('CompanyGalleryController', CompanyGalleryController);

  /** @ngInject */
  function CompanyGalleryController() {
    var vm = this;

    //Company gallery navigation collapse on small device
    vm.navbarCollapsed = true;

    //Gallery navigation tabs
    vm.tabs = [{
      title: 'Album',
      route: 'personal.companypage.gallery.album'
    }, {
      title: 'Profile Picture',
      route: 'personal.companypage.gallery.profilepic'
    }, {
      title: 'Cover Photo',
      route: 'personal.companypage.gallery.coverphoto'
    }];
  }
})();
