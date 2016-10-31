(function() {
  'use strict';

  angular
    .module('lollibond')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $timeout, $interval, $state, formlyConfig, formlyValidationMessages, authService) {
    var statesRequireAuth = ['personal.feed', 'personal.setting'];

    function onStateChangeSuccess() {
      // Updates the browser page title <title>...</title>
      updatePageTitle();
    }

    function onStateChangeStart(event, toState) {
      if (isVerficationNeeded(toState.name)) {
        authService.verifyAuth(function() {
          event.preventDefault();
        });
      }
    }

    function updatePageTitle() {
      var title = $state.$current.locals.globals.pageTitle;
      // For default title
      if (angular.isUndefined(title)) title = 'lollibond';

      $timeout(function() {
        if (title) $rootScope.pageTitle = title;
      }, 0, false);
    }

    function isVerficationNeeded(stateName) {
      return statesRequireAuth.indexOf(stateName) > -1;
    }

    // Formly error handlers
    formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
    formlyValidationMessages.addStringMessage('required', 'This field is required');

    // Route events
    var stateSuccesListner = $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
    var stateStartListner = $rootScope.$on('$stateChangeStart', onStateChangeStart);
    // Keycloak events
    authService.keycloak.onAuthLogout = function() {
      authService.login();
    };

    // Remove listners
    $rootScope.$on('$destroy', function() {
      stateSuccesListner();
      stateStartListner();
    });
  }
})();
