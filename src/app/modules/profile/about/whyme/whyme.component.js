(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('whyMe', {
      bindings: {
        content: '<'
      },
      controller: WhyMeController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/whyme/whyme.html'
    });

  /** @ngInject */
  function WhyMeController(profileService, aboutService) {
    var vm = this;
    vm.textLimit = 70;


    // function assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateWhyMe = updateWhyMe;

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.disabledAddMode = false;

    // function definition
    vm.model = {};

    vm.fields = [{
      type: 'textarea',
      key: 'whyMe',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        focus: true
      }
    }];

    // CRUD Methods

    /**
     * Create/Update Method of single WhyMe.
     * @param  {int} Array index of WhyMe Model
     * if proInfo.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateWhyMe() {
      vm.model = vm.content;
      var postParams = {
        whyMe: vm.content.whyMe
      }
      var saveWhyMe = aboutService.updateUser(postParams);
      saveWhyMe.execute().then(function() {
        vm.isEditable = false;
        vm.disabledAddMode = false;
      });
    }

    /**
     * Edit details of a single WhyMe.
     * @param  {int} Array index of WhyMe Model
     */
    function editForm() {
      vm.model = vm.content;
      vm.isEditable = !vm.isEditable;
    }

    function showMore() {
      if(vm.textLimit > 70){
        vm.textLimit = 70;
      }else{
        vm.textLimit = vm.content.whyMe.length;
      }
    }

    vm.showMore = showMore;

    /*** CRUD Methods End***/
  }
})();
