(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('awardsHonor', {
      bindings: {
        content: '<',
        hasdata: "="
      },
      controller: AwardsHonorController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/awardshonor/awardshonor.html'
    });


  /** @ngInject */
  function AwardsHonorController($window, profileService, AddSection, aboutService, awardsHonorService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateAwards = updateAwards;
    vm.deleteAwards = deleteAwards;
    vm.addAwardsModel = addAwardsModel;
    vm.copyFields = AddSection.copyFields;
    vm.reset = reset;

    vm.dateInit = {
      from: ''
    }


    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.disabledAddMode = false;
    var origModel = {};
    var today = new Date();

    vm.model = {};

    vm.fields = [{
      type: 'input',
      key: 'title',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        required: true,
        label: 'Title:',
        maxlength: 100,
        focus: true
      }
    }, {
      type: 'select',
      key: 'occupation',
      className: 'col-md-12',
      defaultValue: "",
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Occupation :',
        options: []
      },
      controller: function($scope) {
        awardsHonorService.occupationData().then(function(response){
          var lastValue = {
            name: "Other",
            value: "Other"
          };
          response.push(lastValue);
          $scope.to.options = response;
        });
      }
    }, {
      type: 'input',
      key: 'issuer',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        required: true,
        label: 'Issued By:',
        maxlength: 100
      }
    }, {
      key: 'issuedDate',
      type: 'datepickerformly',
      className: 'col-md-12',
      templateOptions: {
        label: 'Issue Date',
        maxDate: today,
        type: 'text',
        datepickerPopup: 'dd-MMMM-yyyy'
      },
      controller: function($scope) {
        $scope.to.datepickerOptions.initDate = vm.dateInit.from;
      }
    }, {
      type: 'textarea',
      key: 'description',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Description',
        maxlength: 500
      }
    }];

    // Reset function
    function reset(idx) {
      if(vm.content[idx].data.id){
        vm.content[idx] = origModel;
        vm.content[idx].data.isEditable = false;
      }else{
        vm.content.splice(idx, 1);
      }
      vm.disabledAddMode = false;
      if(vm.content.length == 0){
          vm.hasdata = false;
      }
    }

    // CRUD Methods

    /**
     * Create/Update Method of single Awards.
     * @param  {int} Array index of Awards Model
     * if awr.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateAwards(id) {
      if (vm.form.$valid) {
        vm.model = vm.content;
        var awr = vm.model[id];
        var postParams = {
          occupation: awr.data.occupation,
          title: awr.data.title,
          issuer: awr.data.issuer,
          issuedDate: awr.data.issuedDate,
          description: awr.data.description,
          id: awr.data.id || ''
        };
        if (awr.data.id) {
          var editAwards = aboutService.updateSection(aboutService.SECTION.AWARD, postParams, awr.data.id);
          editAwards.execute().then(function() {
            awr.isEditable = false;
            vm.disabledAddMode = false;
          });
        } else {
          var saveAwards = aboutService.addSection(aboutService.SECTION.AWARD, postParams);
          saveAwards.execute().then(function(response) {
            awr.data.id = response.id;
            awr.isEditable = false;
            awr.addInProcess = false;
            vm.disabledAddMode = false;
          });
        }
      }
    }

    /**
     * Delete details of a single Awards.
     * @param  {int} Array index of Awards Model
     */
    function deleteAwards(id) {
      vm.model = vm.content;
      var awr = vm.model[id];
      if (awr.data.id) {
        var delAwards = aboutService.deleteSection(aboutService.SECTION.AWARD, awr.data.id);        
        delAwards.execute().then(function() {
          vm.model.splice(id, 1);
          vm.disabledAddMode = false;
          if(vm.model.length == 0){
            vm.hasdata = false;
          }
        });        
      } else {
        vm.model.splice(id, 1);
        vm.disabledAddMode = false;
        if(vm.model.length == 0){
          vm.hasdata = false;
        }
      }
    }

    /**
     * Edit details of a single Awards.
     * @param  {int} Array index of Awards Model
     */
    function editForm(md) {
      //Saving Data for Reset function
      origModel = angular.copy(md);

      vm.dateInit = {
        from: new Date(md.data.issuedDate)
      };

      vm.disabledAddMode = true;
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addAwardsModel() {
      vm.dateInit = {
        from: new Date()
      };

      vm.content.push({
        isEditable: true,
        addInProcess: true
      });
      vm.hasdata = true;
      vm.disabledAddMode = true;
    }

    /*** CRUD Methods End***/
  }
})();
