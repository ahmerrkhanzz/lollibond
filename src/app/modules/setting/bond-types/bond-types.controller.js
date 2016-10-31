(function() {
    'use strict';

    angular
      .module('lollibond.setting')
      .controller('BondTypesController', BondTypesController);

    /** @ngInject */
    function BondTypesController(baseService, $uibModal, toaster) {
      var vm = this;

      // Loader variable
      vm.postsLoading = true;

      // Get bond types list
      var getBondTypesData = new baseService();
      getBondTypesData
          .setPath('peacock', '/user/bond-types')
          .execute()
          .then(function(res) {
              vm.bondTypesData = res;
          })
          .finally(function() {
            // Hide the loader
            vm.postsLoading = false;
          });

      // Delete bond types
      function deletePostType(idx, id) {
        return new baseService()
              .setPath('peacock', '/user/bond-types/' + id)
              .setDeleteMethod()
              .execute()
              .then(function() {
                  vm.bondTypesData.splice(idx, 1);
                  toaster.error({ title: "Successfully deleted!", body: "Information has been successfully deleted." });
              });
      }

      // Edit bond types
      function editPostType() {}

      // Open create list modal
      function openModal() {

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/modules/setting/bond-types/bond-types-modal.html',
          controller: 'BondTypesModalController',
          controllerAs: 'vm'
        });

        modalInstance.result.then(function (addBondTypeData) {
          vm.bondTypesData.push(addBondTypeData);
        });
      }

      // Function assignment
      vm.deletePostType = deletePostType;
      vm.editPostType = editPostType;
      vm.openModal = openModal;
    }
})();
