(function() {
  'use strict';

  angular
    .module('lollibond.search')
    .controller('SetupController', SetupController);

  /** @ngInject */
  function SetupController($state, $scope) {
    var vm = this;
    vm.state = $state.current;

    vm.wizardSteps = [{
      name: "Basic Information",
      state: "setup.basicinformation"
    }, {
      name: "Education",
      state: "setup.setupeducation"
    }, {
      name: "Experience",
      state: "setup.setupexperience"
    }, {
      name: "Skills",
      state: "setup.setupskill"
    }, {
      name: "Import Contacts",
      state: "setup.setupcontact"
    }];



    var wizardStatesArr = vm.wizardSteps.map(function(obj) {
      return obj.state;
    });

    var currentState = wizardStatesArr.indexOf(vm.state.name);

    var locationChange = $scope.$on('$stateChangeSuccess', function(event, toState) {
      vm.currentState = wizardStatesArr.indexOf(toState.name);
    });

    vm.currentState = currentState;

    function cleanup() {
      locationChange();
      locationChange = null;
    }

    $scope.$on("$destroy", cleanup);
  }
})();
