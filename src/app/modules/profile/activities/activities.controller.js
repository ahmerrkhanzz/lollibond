(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('ActivitiesController', ActivitiesController);

  function ActivitiesController($http, $timeout) {
    var vm = this;

    // Chat Controller  Example 
    var polling = function() {
      var value = $http({
        method : 'GET',
        url : 'http://localhost:3004/chatData'
      });

      value.success(function(data, status, headers, config) {
        vm.chatData = data;
      });

      $timeout(function() {
        polling();
      }, 3000);
    };
    
    //Call function polling()
    polling();


  }
})();
