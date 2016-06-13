(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('PersonalProfileController', PersonalProfileController);

  /** @ngInject */
  function PersonalProfileController($http, countries, $resource, $scope, baseService, $q, profileService, AddSection, bondService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateProfileInfo = updateProfileInfo;
    vm.copyFields = AddSection.copyFields;

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.addInProcess = false;

    // function definition
    vm.model = {};

    vm.fields = [{
      fieldGroup: [{
        type: 'input',
        className: 'col-md-4',
        key: 'website',
        ngModelElAttrs: {
          class: 'form-control input-xs'
        },
        templateOptions: {
          label: 'Website URL:'
        }
      }, {
        type: 'input',
        className: 'col-md-4',
        key: 'address',
        ngModelElAttrs: {
          class: 'form-control input-xs'
        },
        templateOptions: {
          label: 'Address:'
        }
      }, {
        type: 'select',
        className: 'col-md-4',
        key: 'gender',
        defaultValue: "",
        ngModelElAttrs: {
          class: 'form-control input-xs'
        },
        templateOptions: {
          label: 'Gender:',
          options: [{
            name: 'Select Gender',
            value: ""
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
        className: 'col-md-4',
        type: 'datepickerformly',
        templateOptions: {
          label: 'Birth Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy'
        }
      },{
        type: 'input',
        className: 'col-md-4',
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
        className: 'col-md-4',
        templateOptions: {
          label: 'Email'
        }
      }]
    }, {
      fieldGroup: [{
        key: 'residency',
        type: 'typeahead',
        className: 'col-md-4',
        templateOptions: {
          label: 'Residency',
          options: countries
        }
      }, {
        key: 'homeTown',
        type: 'typeahead',
        className: 'col-md-4',
        templateOptions: {
          label: 'Home Town',
          options: countries
        }
      }, {
        key: 'nationality',
        type: 'typeahead',
        className: 'col-md-4',
        templateOptions: {
          label: 'Nationality',
          options: countries
        }
      }]
    }];


    //Service calls
    function peopleList($query) {
      return $http.get('http://172.16.18.60:3004/people', { cache: true }).then(function(response) {
        var peoples = response.data;
        return peoples.filter(function(people) {
          return people.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
      });
    }

    function loadSkills($query) {
      return $http.get('http://172.16.18.60:3004/skills', { cache: true }).then(function(response) {
        var skills = response.data;
        return skills.filter(function(skill) {
          return skill.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
      });
    }

    // CRUD Methods 

    /**
     * Create/Update Method of single ProfileInfo.
     * @param  {int} Array index of ProfileInfo Model  
     * if proInfo.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateProfileInfo(id) {
      vm.model = vm.content;
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
        var saveProfileInfo = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/')
          .setPatchMethod()
          .setPostParams(postParams);
          console.log(postParams);
        saveProfileInfo.execute().then(function(response) {
          vm.isEditable = false;
          vm.addInProcess = false;
        });
    }

    /**
     * Edit details of a single ProfileInfo.
     * @param  {int} Array index of ProfileInfo Model  
     */
    function editForm() {
      vm.model = vm.content;
      vm.isEditable = !vm.isEditable;
    }

    


    /*** CRUD Methods End***/
    function unbondUser() {
      bondService.deleteBond(profileService.profileId).then(function() {
        vm.profileService.isBonded = false;
        vm.profileService.isFollowed = false;
      });
    }

    function bondUser() {
      bondService.bondRequest(profileService.profileId).then(function() {
        vm.profileService.isRequested = true;
      });
    }

    function cancelRequest() {
      bondService.deleteRequest(profileService.profileId).then(function() {
        vm.profileService.isRequested = false;
      })
    }

    function unfollowUser() {
      bondService.unfollowUser(profileService.profileId).then(function() {
        vm.profileService.isFollowed = false;
      });
    }

    function followUser() {
      bondService.followUser(profileService.profileId).then(function() {
        vm.profileService.isFollowed = true;
      });
    }

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

    /////////////////////////////
    vm.bondUser = bondUser;
    vm.unbondUser = unbondUser;
    vm.cancelRequest = cancelRequest;
    vm.followUser = followUser;
    vm.unfollowUser = unfollowUser;
    vm.unbondUser = unbondUser;

  }
})();
