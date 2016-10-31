(function() {
  'use strict';

  angular.element(document).ready(function($window) {
    var keycloak = new Keycloak({
      'url': 'http://bondinco.dyndns.org:8080/auth',
      'realm': 'lollibond',
      'realm-public-key': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArWEvJv14u9IcdbGMbesY0ZSqjaZumjNB1Is18BoOHCNMvbnPTQmqddfNlJlSql3uZ3Qc0AhR/rnpaW51+4QA6T28RcY8kaIb30WrrloCvzmjI5q+XfESuIh2g4HAUD6yto7T00FMi5DECJOECltdYHvodYw/+58jfcSTMIlmhH8s/KZMKXto4nFZbgcvHTeJG5JCjmPto3D7qZRMnU0vHfsKL8rzfmbg4EoPi/4UKZDnTcv9LKu8CXMurI+6eR0C+STzyWT57beeIcU99U+tJzAmg3CXcx58FG7APvEJHGEgmiy6nT0BtDZtpv1S1vWhyLGEfjXTEbceNGPaTp5n5QIDAQAB',
      'ssl-required': 'none',
      'clientId': 'peacock',
      'public-client': true
    });

    // Initialize keycloak on every page load
    //
    // (A) Not a lollibond user: The application will start with
    //                           limited features.
    // (B) Registered User:      This is checked by localStorage.currentUser
    //                           if its present redirect to login page.
    // (C) Expired token:        localStorage.currentUser is present and
    //                           redirect to login page to retrieve token.
    keycloak.init().success(function(authenticated) {
      // authenticated is true when user is returned from keycloak
      if (authenticated) {
        keycloak.loadUserProfile().success(function(profile) {
          // Set the profile in localStorage
          localStorage.setItem('currentUser', profile);
          initiateApp(keycloak, profile);
        }).error(function() {
          $window.location.reload();
        });
      } else {
        if (localStorage.currentUser) {
          // Scenario (B) and (C)
          keycloak.login();
        } else {
          // Scenario (A)
          initiateApp(keycloak);
        }
      }
    }).error(function() {
      $window.location.reload();
    });

    // Initialize the angular application
    // and create the authentication service
    function initiateApp(keycloak, profile) {
      createAuthService(keycloak, profile);
      angular.bootstrap(document, ['lollibond']);
    }

    // Change the css files based on LTR or RTL layout
    changeCSS();
  });

  function createAuthService(keycloak, user) {
    var service = {
      keycloak: keycloak,
      user: user || false,
      UID: user || false,
      logout: logout,
      login: keycloak.login,
      verifyAuth: verifyAuth
    };

    function logout() {
      localStorage.removeItem('currentUser');
      keycloak.clearToken();
      keycloak.logout({
        redirectUri: keycloak.createLoginUrl()
      });
    }

    if (user) {
      // If lollibond ID is not present in user object fetch from starfish
      // Or if its present assign it to the service object
      service.UID = user.attributes ? user.attributes.lollibond_id[0] : getLollibondId();
    }

    // When the user is landed first time from keycloak (new user)
    // It needs to be authenticated from starfish to get Lollibond ID
    function getLollibondId() {
      var initInjector = angular.injector(['ng']);
      var $http = initInjector.get('$http');

      $http({
        'url': 'http://dev1.bond.local:9999/user/me',
        'method': 'GET',
        'headers': {
          'authorization': 'Bearer ' + keycloak.token
        }
      }).then(function(res) {
        // Assign the lollibond ID to the service UID
        // So it can be used throughout application
        service.UID = res.data.id;
      });
    }

    // Used when the page or action is
    // for only authorized users
    function verifyAuth(callbackFunc) {
      // Redirect the user to login screen
      if (!service.user) {
        callbackFunc();
        keycloak.login();
      }
    }

    // Create Auth
    angular
      .module('lollibond')
      .factory('authService', function() {
        return service;
      });
  }

  // CSS files for language direction
  var filesToMatch = /(bootstrap)|(core)|(appStyles)|(components.css)|(vendor)|(lollibond)/;

  function checkFile(file) {
    file = file.toString();
    return filesToMatch.test(file)
  }

  function replaceString(str) {
    if (localStorage.NG_TRANSLATE_LANG_KEY !== 'ar_AE') {
      return str.replace('-rtl.css', '.css');
    } else {
      return str.replace('.css', '-rtl.css');
    }
  }

  function changeCSS() {
    /* eslint angular/document-service: 0 */
    var stylesheets = document.getElementsByTagName('link');

    for (var i = stylesheets.length - 1; i >= 0; i--) {
      var file = stylesheets.item(i).getAttribute('href');

      if (checkFile(file)) {
        /* eslint angular/document-service: 0 */
        var newlink = document.createElement('link');
        newlink.setAttribute('rel', 'stylesheet');
        newlink.setAttribute('type', 'text/css');
        newlink.setAttribute('href', replaceString(file));

        /* eslint angular/document-service: 0 */
        document.getElementsByTagName('head').item(0).replaceChild(newlink, stylesheets.item(i));
      }
    }
  }
})();
