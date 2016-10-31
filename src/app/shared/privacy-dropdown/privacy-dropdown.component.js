(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('privacyDropdown', {
      bindings: {
        currentSelected: '='
      },
      controller: PrivacyDropdownController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/privacy-dropdown/privacy-dropdown.html'
    });

  function PrivacyDropdownController(authService) {
    var vm = this;
  
    vm.sectionPrivacyOpts = [{
      name: 'Public',
      icon: 'icon-earth',
      level: 3
    }, {
      name: 'Bonds',
      icon: 'icon-users',
      level: 1
    }, {
      name: 'Bonds of Bonds',
      icon: 'icon-collaboration',
      level: 2
    }, {
      name: 'Only me',
      icon: 'icon-lock',
      level: 0
    }];
  
    vm.selectedExpPrivacy = vm.sectionPrivacyOpts[0];


    function changeSectionPrivacy(opt) {
      vm.selectedExpPrivacy = opt;
      vm.currentSelected = checkPostPermission(opt);
    }

    function checkPostPermission(perm) {
      var permArr = [];

      switch (perm.name) {
        case 'Public':
          break;
        case 'Friends':
          permArr.push('d' + authService.UID);
          break;
        case 'Friends of Friends':
          permArr.push('i' + authService.UID);
          break;
        case 'Only me':
          permArr.push('n' +authService.UID);
          break;
      }

      return permArr;
    }

    //Expose the function to View
    vm.changeSectionPrivacy = changeSectionPrivacy;
  }
})();
