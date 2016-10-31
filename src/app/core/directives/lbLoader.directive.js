(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('lbLoader', lbLoader);

  function lbLoader() {
    var directive = {
      restrict: 'AE',
      scope: {
        name: '@?',
        group: '@?',
        show: '=?',
        imgSrc: '@?',
        register: '@?',
        onLoaded: '&?',
        onShow: '&?',
        onHide: '&?'
      },
      transclude: true,
      controller: lbLoaderController,
      controllerAs: 'vm',
      bindToController: true,
      template: [
        '<span ng-show="vm.show">',
        '  <img ng-show="vm.imgSrc" ng-src="{{vm.imgSrc}}"/>',
        '  <span ng-transclude></span>',
        '</span>'
      ].join('')
    };
    return directive;
  }

  /** @ngInject */
  function lbLoaderController(loaderService) {
    var vm = this;

    // register should be true by default if not specified.
    if (!vm.hasOwnProperty('register')) {
      vm.register = true;
    } else {
      vm.register = !!vm.register;
    }

    // Declare a mini-API to hand off to our service so the
    // service doesn't have a direct reference to this
    // directive's scope.
    var api = {
      name: vm.name,
      group: vm.group,
      show: function() {
        vm.show = true;
      },
      hide: function() {
        vm.show = false;
      },
      toggle: function() {
        vm.show = !vm.show;
      }
    };

    // Register this spinner with the spinner service.
    if (vm.register === true) {
      loaderService._register(api);
    }

    // If an onShow or onHide expression was provided,
    // register a watcher that will fire the relevant
    // expression when show's value changes.
    if (vm.onShow || vm.onHide) {
      vm.$watch('show', function(show) {
        if (show && vm.onShow) {
          vm.onShow({
            loaderService: loaderService,
            spinnerApi: api
          });
        } else if (!show && vm.onHide) {
          vm.onHide({
            loaderService: loaderService,
            spinnerApi: api
          });
        }
      });
    }

    // This spinner is good to go.
    // Fire the onLoaded expression if provided.
    if (vm.onLoaded) {
      vm.onLoaded({
        loaderService: loaderService,
        spinnerApi: api
      });
    }
  }
})();
