(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('lbAutocompleteLocation', lbAutocompleteLocation);

  /** @ngInject */
  function lbAutocompleteLocation($document, $log) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {},
      link: linker,
      template: '<div class="form-group"><input id="autocomplete" placeholder="Enter your location" class="form-control" ng-focus="geolocate()" type="text"></input></div>'
    };
    return directive;

    function linker(scope) {
      var GMAP_API = 'AIzaSyBWFp9hmUDLmOeECE9qbcjBrbceckotR1w';
      var autocomplete;

      // Inject Google map script
      (function(d, script) {
        script = d.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = initAutocomplete;
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + GMAP_API + '&libraries=places';
        d.getElementsByTagName('head')[0].appendChild(script);
      }($document[0]));

      function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
          /** @type {!HTMLInputElement} */
          ($document[0].getElementById('autocomplete')), { types: ['geocode'] }
        );

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', catchLocation);
      }

      function catchLocation() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace(),
          lat = place.geometry.location.lat(),
          long = place.geometry.location.lng();

        $log.log({
          lat: lat,
          long: long
        });
      }

      // Bias the autocomplete object to the user's geographical location,
      // as supplied by the browser's 'navigator.geolocation' object.
      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      }

      // Expose the functions to view
      scope.geolocate = geolocate;
    }
  }
})();
