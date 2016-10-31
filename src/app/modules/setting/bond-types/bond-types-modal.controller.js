(function() {
    'use strict';

    angular
      .module('lollibond.setting')
      .controller('BondTypesModalController', BondTypesModalController);

    /** @ngInject */
    function BondTypesModalController(baseService, $uibModalInstance, toaster, lbUtilService) {
      var vm = this;

      //Submit modal
      function submit() {
        var encodeUrl = lbUtilService.urlEncode(vm.bondTypeName);
        return new baseService()
          .setPath('peacock', '/user/bond-types/' + encodeUrl)
          .setPostMethod()
          .execute()
          .then(function(res) {
            $uibModalInstance.close(res)
            toaster.success({ title: "Successfully saved!", body: "Bond type has been successfully added." });
          });
      }

      // Hide modal
      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      // Show list of member in autocomplete
      function bondsList($query) {
        var getUsers = new baseService();
        getUsers.setPath('peacock', '/user/me/bonds?count=10&cursor=1');

        return getUsers.execute().then(function(response) {
          return response.values
            .map(function(user) {
              return {
                name: user.firstName + ' ' + user.lastName,
                id: user.id
              };
            })
            .filter(function(user) {
              return user.name.toLowerCase().indexOf($query.toLowerCase()) != -1
            });
        });
      }

      //Function assignment
      vm.bondsList = bondsList;
      vm.submit = submit;
      vm.cancel = cancel;
    }
})();