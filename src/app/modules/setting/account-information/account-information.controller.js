(function() {
    'use strict';

    angular
      .module('lollibond.setting')
      .controller('AccountInformationController', AccountInformationController);

    /** @ngInject */
    function AccountInformationController(aboutService, authService, baseService, toaster) {
      var vm = this;

      vm.formLoading = false;
      vm.lastUpdatedName = {};

      var userSummary = new baseService();
      userSummary
          .setPath('peacock', '/user/' + authService.UID + '/summary')
          .execute()
          .then(function(res) {
              vm.summary = {
                  firstName: res.firstName,
                  lastName: res.lastName
              };
              vm.lastUpdatedName = angular.copy(vm.summary)
          });

      //Reset function
      function reset() {
          vm.summary = angular.copy(vm.lastUpdatedName);
      }

      // API Function
      function updateProfileInfo(summary) {
          var postParams = summary;
          var saveProfileInfo = aboutService.updateUser(postParams);
          saveProfileInfo.execute()
              .then(function(res) {
                  // Show the loading spinner
                  vm.formLoading = true;
                  vm.lastUpdatedName = {
                      firstName: res.firstName,
                      lastName: res.lastName
                  };
                  toaster.success({ title: "Successfully saved!", body: "Information has been successfully saved." });
              })
              .finally(function() {
                  // Hide the loading spinner
                  vm.formLoading = false;
              });
      }

      // Functions Assignments
      vm.updateProfileInfo = updateProfileInfo;
      vm.reset = reset;
    }
})();
