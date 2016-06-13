(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('bondRequests', bondRequests);

  function bondRequests() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {},
      controller: BondRequestsController,
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/shared/main-header/bond-requests.html'
    };
    return directive;
  }

  /** @ngInject */
  function BondRequestsController($log, bondService) {
    var vm = this;

    vm.requestList = [];

    function approveRequest(uid, idx) {
      event.preventDefault();
      bondService.bondRequest(uid, bondService.requestType.ACCEPT).then(function() {
        vm.requestList.splice(idx, 1);
      });
    }

    function declineRequest(uid, idx) {
      event.preventDefault();
      bondService.bondRequest(uid, bondService.requestType.REJECT).then(function() {
        vm.requestList.splice(idx, 1);
      });
    }

    bondService.loadRequests().then(function(res) {
      vm.requestList = res;
    });

    ////////////////////////////////
    vm.approveRequest = approveRequest;
    vm.declineRequest = declineRequest;
  }
})();
