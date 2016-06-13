(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('aceButton', {
      bindings: {
        data: '<'
      },
      controller: AceProfileController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/ace-profile/ace-profile.html'
    });

  // @ngInject
  function AceProfileController() {
    var vm = this;

    vm.aceTypes = [{
      name: 'primary',
      value: vm.data.individualAceCount,
      icon: 'assets/images/individual.png',
      isBond: vm.data.individualBond
    }, {
      name: 'green',
      value: vm.data.corporateAceCount,
      icon: 'assets/images/epsn.png',
      isBond: vm.data.corporateBond
    }, {
      name: 'orange',
      value: vm.data.academicAceCount,
      icon: 'assets/images/apsn.png',
      isBond: vm.data.academicBond
    }];

    function giveAce(type) {
      var check = ''
      if (type == 'primary') {
        check = checkCount(vm.data.individualAce, vm.aceTypes[0].value);
        vm.data.individualAce = check.state;
        vm.aceTypes[0].value = check.count;
      } else if (type == 'green') {
        check = checkCount(vm.data.corporateAce, vm.aceTypes[1].value);
        vm.data.corporateAce = check.state;
        vm.aceTypes[1].value = check.count;
      } else if (type == 'orange') {
        check = checkCount(vm.data.academicAce, vm.aceTypes[2].value);
        vm.data.academicAce = check.state;
        vm.aceTypes[2].value = check.count;
      }
    }

    // Helper functions
    function checkCount(state, count) {
      // Check the current ACE state
      // and update the count
      if (state) {
        --count;
      } else {
        ++count;
      }
      // Update the ace state
      state = !state;

      return {
        state: state,
        count: count
      }
    }

    //////////////////////////
    vm.giveAce = giveAce;
  }
})();
