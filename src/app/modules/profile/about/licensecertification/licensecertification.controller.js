(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('LicenseCertificationController', LicenseCertificationController);

  /** @ngInject */
  function LicenseCertificationController($http, countries, $resource, $scope, baseService, $q, profileService, AddSection) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateCertifications = updateCertifications;
    vm.deleteCertifications = deleteCertifications;
    vm.addCertificationsModel = addCertificationsModel;
    vm.copyFields = AddSection.copyFields;

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.addInProcess = false;

    // function definition
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
        label: 'Title:'
      }
    }, {
      type: 'input',
      key: 'number',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        required: true,
        label: 'Number:'
      }
    }, {
      type: 'input',
      key: 'authority',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Authority:'
      }
    }, {
      type: 'input',
      key: 'url',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'url:'
      }
    }, {
      key: 'expires',
      type: 'checkbox',
      className: 'col-md-12',
      templateOptions: {
        label: 'Certification Expires'
      }
    }, {
      fieldGroup: [{
        key: 'fromDate',
        className: 'col-md-12',
        type: 'datepickerformly',
        templateOptions: {
          label: 'Start Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy'
        }
      }, {
        key: 'certificationInProcess',
        className: 'col-md-12',
        type: 'checkbox',
        templateOptions: {
          label: 'In process'
        }
      }, {
        key: 'toDate',
        type: 'datepickerformly',
        className: 'col-md-12',
        templateOptions: {
          label: 'End Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy',
          //this houdl override datepicker format on formlyConfig and it did
          datepickerOptions: {
            format: 'dd-MMMM-yyyy'
          }
        },
        expressionProperties: {
          'templateOptions.disabled': 'model.certificationInProcess'
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
     * Create/Update Method of single Certifications.
     * @param  {int} Array index of Certifications Model  
     * if cert.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateCertifications(id) {
      vm.model = vm.content;
      var cert = vm.model[id];
      var postParams = {
        "title": cert.data.title,
        "authority": cert.data.authority,
        "number": cert.data.number,
        "url": cert.data.url,
        "fromDate": cert.data.fromDate ,
        "toDate": cert.data.toDate,
        "expires": cert.data.expires
      };
      if (cert.data.id) {
        var editCertifications = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/certifications/' + cert.data.id)
          .setPutMethod()
          .setPostParams(postParams);
        editCertifications.execute().then(function(response) {
          cert.isEditable = false;
        });
      } else {
        var saveCertifications = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/certifications/')
          .setPostMethod()
          .setPostParams(postParams);
        saveCertifications.execute().then(function(response) {
          cert.data.id = response.id;
          cert.isEditable = false;
          vm.addInProcess = false;
        });
      }
    }

    /**
     * Delete details of a single Certifications.
     * @param  {int} Array index of Certifications Model  
     */
    function deleteCertifications(id) {
      vm.model = vm.content;
      var deferred = $q.defer();
      var cert = vm.model[id];
      if (cert.data.id) {
        var delCertifications = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/certifications/' + cert.data.id)
          .setDeleteMethod();
        if (window.confirm("Are you sure you want to delete '" + cert.data.title + "' ?")) {
          delCertifications.execute().then(function(response) {
            vm.model.splice(id, 1);
          });
        }
      } else {
        vm.model.splice(id, 1);
        vm.addInProcess = false;
      }
    }

    /**
     * Edit details of a single Certifications.
     * @param  {int} Array index of Certifications Model  
     */
    function editForm(md) {
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addCertificationsModel() {
      vm.content.push({
        isEditable: true
      });
      vm.addInProcess = true;
    }

    /*** CRUD Methods End***/

  }
})();
