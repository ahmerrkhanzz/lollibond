(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('lbUtilConfirmModal', lbUtilConfirmModal);

  /** @ngInject */
  function lbUtilConfirmModal($uibModal) {
    var directive = {
      restrict: 'A',
      scope: {
        confirmAction: "&"
      },
      link: linker
    };
    return directive;

    function ModalInstanceCtrl($scope, $uibModalInstance) {
      $scope.ok = function() {
        $uibModalInstance.close();
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    }

    function linker(scope, el, attrs) {
      // Confirm Modal creation
      function openConfirmModal() {
        var message = attrs.ngReallyMessage || "Are you sure ?";

        var modalHtml = '<div class="modal-body">' + message + '</div>' +
          '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';

        var modalInstance = $uibModal.open({
          template: modalHtml,
          controller: ModalInstanceCtrl
        });

        modalInstance.result.then(function() {
          scope.confirmAction();
        });
      }

      el.bind('click', openConfirmModal);

      // Unbinding event on modal destroy
      scope.$on('$destroy', function() {
        el.unbind('click', openConfirmModal);
      });
    }
  }
})();
