(function () {
  'use strict';

  angular
    .module('lollibond.setting')
    .controller('CreateCompanyModalController', CreateCompanyModalController);

  /** @ngInject */
  function CreateCompanyModalController(baseService, $uibModalInstance, toaster) {
    var vm = this;

    //Submit modal
    function submit() {
      var postParams = {
        name: vm.companyName
      }
      return new baseService()
        .setPath('ray', '/company')
        .setPostMethod()
        .setPostParams(postParams)
        .execute()
        .then(function (res) {
          $uibModalInstance.close(res)
          toaster.success({ title: "Successfully Added!", body: "You have successfully created company." });
        });
    }

    // Hide modal
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    //Function assignment
    vm.submit = submit;
    vm.cancel = cancel;
  }
})();