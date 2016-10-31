(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('GalleryController', GalleryController);

  /** @ngInject */
  function GalleryController() {
    var vm = this;

    //Gallery navigation collapse on small device
    vm.navbarCollapsed = true;

    //Gallery navigation tabs
    vm.tabs = [{
      title: 'Albums',
      route: 'personal.profile.gallery.album'
    }, {
      title: 'Profile Pictures',
      route: 'personal.profile.gallery.profilepic'
    }, {
      title: 'Cover Photos',
      route: 'personal.profile.gallery.coverphoto'
    }];
  }
})();
