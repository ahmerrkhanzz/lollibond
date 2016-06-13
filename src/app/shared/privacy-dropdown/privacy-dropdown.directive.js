(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('privacyDropdown', privacyDropdown);

  function privacyDropdown() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        currentSelected: "="
      },
      link: linker,
      templateUrl: 'app/shared/privacy-dropdown/privacy-dropdown.html'
    };
    return directive;

    function linker(scope) {
      function changeSectionPrivacy(opt) {
        scope.currentSelected = opt.id;
      }

      scope.sectionPrivacyOpts = [{
        id: 0,
        icon: "icon-earth",
        text: "Public"
      }, {
        id: 1,
        icon: "icon-collaboration",
        text: "Bonds"
      }, {
        id: 2,
        icon: "icon-users",
        text: "Bonds of bonds"
      }, {
        id: 3,
        icon: "icon-lock4",
        text: "Only me"
      }, {
        id: 4,
        icon: "icon-gear",
        text: "Custom"
      }];

      //Expose the function to View
      scope.changeSectionPrivacy = changeSectionPrivacy;
    }
  }
})();
