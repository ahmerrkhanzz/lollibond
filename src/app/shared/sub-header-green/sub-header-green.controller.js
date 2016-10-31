(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .controller('SubHeaderGreenController', SubHeaderGreenController);

  /** @ngInject */
  function SubHeaderGreenController() {
    var vm = this;

    vm.subHeaderCollapsed = true;
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
      route: 'corporate.employees'
    }, {
      title: 'Jobs',
      icon: 'icon-images3',
      route: 'corporate.jobs'
    },
     {
      title: 'Branches',
      icon: 'icon-home4',
      route: 'corporate.branches'
    },
    {
      title: 'Structure',
      icon: 'icon-home4',
      route: 'corporate.structure'
    }];
    vm.activeTab = 0;
  }
})();
