(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('personalProfile', {
      bindings: {
        content: '<',
        hasdata: "="
      },
      controller: PersonalProfileController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/personalprofile/personalprofile.html'
    });

  /** @ngInject */
  function PersonalProfileController(countries, profileService, AddSection, bondService, aboutService, baseService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateProfileInfo = updateProfileInfo;
    vm.copyFields = AddSection.copyFields;
    vm.reset = reset;

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.disabledAddMode = false;
    vm.currentlySelectedResidency = '';
    vm.currentlySelectedHometown = '';
    vm.nationalitiesObj = {};
    var origModel = {};

    // Adding a day in current date
    var today = new Date();
    today.setDate(today.getDate() - 1);

    // function definition
    vm.model = {};

    vm.fields = [{
      fieldGroup: [{
        type: 'input',
        className: 'col-md-12',
        key: 'website',
        ngModelElAttrs: {
          class: 'form-control input-xs'
        },
        templateOptions: {
          label: 'Website URL:',
          placeholder: 'http://www.example.com',
          focus: true
        },
        validators: {
          urlAddress: {
            expression: function($viewValue, $modelValue) {
              var value = $modelValue || $viewValue;
              if ($modelValue) {
                var regexPattern = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@%_\+.~#?&//=]*)/g;
                return regexPattern.test(value);
              } else {
                return true;
              }
            },
            message: '" Invalid URL "'
          }
        }
      }, {
        type: 'input',
        className: 'col-md-12',
        key: 'address',
        ngModelElAttrs: {
          class: 'form-control input-xs'
        },
        templateOptions: {
          label: 'Address:'
        }
      }, {
        type: 'select',
        className: 'col-md-12',
        key: 'gender',
        defaultValue: "",
        ngModelElAttrs: {
          class: 'form-control input-xs'
        },
        templateOptions: {
          label: 'Gender:',
          options: [{
            name: 'Select Gender',
            value: null
          }, {
            name: 'Male',
            value: 0
          }, {
            name: 'Female',
            value: 1
          }]
        }
      }]
    }, {
      fieldGroup: [{
        key: 'birthdate',
        className: 'col-md-12',
        type: 'datepickerformly',
        templateOptions: {
          label: 'Birth Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy',
          maxDate: today
        }
      }, {
        type: 'input',
        className: 'col-md-12',
        key: 'postalCode',
        ngModelElAttrs: {
          class: 'form-control input-xs'
        },
        templateOptions: {
          label: 'Postal Code:'
        }
      }, {
        key: 'email',
        type: 'input',
        className: 'col-md-12',
        templateOptions: {
          label: 'Email',
          type: 'email',
          disabled: true
        }
      }]
    }, {
      fieldGroup: [{
        className: 'col-md-12',
        key: 'residency',
        type: 'ui-select',
        templateOptions: {
          valueProp: 'value',
          labelProp: 'label',
          label: 'Residency',
          options: [],
          refresh: refreshResidency,
          refreshDelay: 250
        },
        controller: function($scope) {
          if (vm.currentlySelectedResidency) {
            $scope.to.defaultValue = vm.currentlySelectedResidency;
          }
        }
      }, {
        className: 'col-md-12',
        key: 'homeTown',
        type: 'ui-select',
        templateOptions: {
          valueProp: 'value',
          labelProp: 'label',
          label: 'Home Town',
          options: [],
          refresh: refreshResidency,
          refreshDelay: 250
        },
        controller: function($scope) {
          if (vm.currentlySelectedHometown) {
            $scope.to.defaultValue = vm.currentlySelectedHometown;
          }
        }
      }, {
        className: 'col-md-12',
        key: 'nationality',
        type: 'ui-select',
        templateOptions: {
          valueProp: 'value',
          labelProp: 'label',
          label: 'Nationality',
          options: [],
          refresh: refreshNationalities,
          refreshDelay: 250
        },
        controller: function($scope) {
          if (vm.currentlySelectedNationality) {
            $scope.to.defaultValue = vm.nationalitiesObj[vm.currentlySelectedNationality]; // "controlll";
          }
        }
      }]
    }];


    // Refresh Suggestion list for Residency
    function refreshResidency(val, field) {
      // Detemine string of whitespaces
      var expression = /^\s+$/g;
      var regex = new RegExp(expression);

      if (!val.match(regex) && val.length > 0) {
        return new baseService()
          .setPath('coral', '/api/v1/cities/search/' + val)
          .execute().then(function(response) {
            var opt = [];
            angular.forEach(response, function(key, value) {
              this.push({
                label: value,
                value: key
              });
            }, opt);
            field.templateOptions.options = opt;
          });
      }else{
        return [];
      }
    }

  // Refresh Suggestion list for Nationalities
    function refreshNationalities(val, field) {
      // Detemine string of whitespaces
      var expression = /^\s+$/g;
      var regex = new RegExp(expression);

      if (!val.match(regex)  && val.length > 0) {
        return new baseService()
          .setPath('coral', '/api/v1/countries/search/' + val)
          .execute().then(function(response) {
            var opt = [];
            angular.forEach(response, function(key, value) {
              this.push({
                label: value,
                value: key
              });
            }, opt);
            field.templateOptions.options = opt;
          });
      }else{
        return [];
      }
    }


    // Get name of the Nationality
    function getNationality() {
      return new baseService()
        .setPath('coral', '/api/v1/countries/list/en')
        .execute().then(function(response) {
          vm.nationalitiesObj = response;
        });
    }
    
    // Initializing base functions
    function init(){
      getNationality();
    }

    // Reset function 
    function reset() {
      vm.content = origModel;
      vm.isEditable = false;
    }

    function updateProfileInfo() {
      vm.model = vm.content;
      if (vm.form.$valid) {
        var postParams = {
          gender: vm.content.gender,
          website: vm.content.website,
          residency: vm.content.residency,
          homeTown: vm.content.homeTown,
          address: vm.content.address,
          nationality: vm.content.nationality,
          postalCode: vm.content.postalCode,
          birthdate: vm.content.birthdate
        }
        var saveProfileInfo = aboutService.updateUser(postParams);
        saveProfileInfo.execute().then(function() {
          vm.isEditable = false;
          vm.disabledAddMode = false;
        });
      }
    }

    /**
     * Edit details of a single ProfileInfo.
     * @param  {int} Array index of ProfileInfo Model
     */
    function editForm() {
      //Saving Data for Reset function
      origModel = angular.copy(vm.content);

      vm.model = vm.content;

      vm.currentlySelectedResidency = vm.model.residency;
      vm.currentlySelectedHometown = vm.model.homeTown;
      vm.currentlySelectedNationality = vm.model.nationality;
      vm.isEditable = !vm.isEditable;
    }

    /*** CRUD Methods End***/

    // ace button
    vm.aceUser = {
      individualAce: true,
      corporateAce: false,
      academicAce: false,
      individualAceCount: 200,
      corporateAceCount: 122,
      academicAceCount: 365,
      individualBond: true,
      corporateBond: false,
      academicBond: true
    };

    init();
  }
})();