(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('SchoolController', SchoolController);

  /** @ngInject */
  function SchoolController($http, countries, $resource, $scope, baseService, $q, profileService, AddSection) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateSchool = updateSchool;
    vm.deleteSchool = deleteSchool;
    vm.addSchoolModel = addSchoolModel;
    vm.copyFields = AddSection.copyFields;

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.addInProcess = false;

    // function definition
    vm.model = {};

    vm.fields = [{
      type: 'input',
      key: 'schoolName',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'School Name',
        required: true
      }
    }, {
      type: 'textarea',
      key: 'description',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Description'
      }
    }, {
      fieldGroup: [{
        key: 'fromDate',
        className: 'col-md-6',
        type: 'datepickerformly',
        templateOptions: {
          label: 'Start Date',
          type: 'text',
          datepickerPopup: 'dd-MMMM-yyyy'
        }
      }, {
        key: 'toDate',
        type: 'datepickerformly',
        className: 'col-md-6',
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
          'templateOptions.disabled': 'model.currentlystudying'
        }
      }]
    }, {
      type: 'select',
      key: 'currentSelectedPrivacy',
      defaultValue: "public",
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs' // <-- this is it!
      },
      templateOptions: {
        label: 'Who can view this?',
        required: true,
        options: [{
          name: 'Public',
          value: 0
        }, {
          name: 'Bonds',
          value: 1
        }, {
          name: 'Bonds of bonds',
          value: 2
        }, {
          name: 'Only me',
          value: 3
        }, {
          name: 'Custom',
          value: 4
        }]
      }
    }, {
      hideExpression: 'model.currentSelectedPrivacy != 4',
      fieldGroup: [{
        key: 'visibleTo',
        type: 'tag',
        className: 'col-md-12',
        templateOptions: {
          label: 'Make this visible to:',
          allowCustomInput: true,
          loadList: peopleList,
          displayProperty: "name"
        },
        ngModelElAttrs: {
          class: 'tag-input-scroll form-control bootstrap-tagsinput input-xs' // <-- this is it!
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
     * Create/Update Method of single School.
     * @param  {int} Array index of School Model  
     * if sch.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateSchool(id) {
      vm.model = vm.content;
      var sch = vm.model[id];
      var postParams = {
        "activities": sch.data.activities,
        "degree": sch.data.degree,
        "description": sch.data.description,
        "fieldOfStudy": sch.data.fieldOfStudy,
        "fromDate": sch.data.fromDate,
        "grade": sch.data.grade,
        "schoolId": sch.data.schoolId,
        "schoolName": sch.data.schoolName,
        "toDate": sch.data.toDate
      }
      if (sch.data.id) {
        var editSchool = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/schoolEducations/' + sch.data.id)
          .setPutMethod()
          .setPostParams(postParams);
        editSchool.execute().then(function(response) {
          sch.isEditable = false;
        });
      } else {
        var saveSchool = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/schoolEducations/')
          .setPostMethod()
          .setPostParams(postParams);
        saveSchool.execute().then(function(response) {
          sch.data.id = response.id;
          sch.isEditable = false;
          vm.addInProcess = false;
        });
      }
    }

    /**
     * Delete details of a single School.
     * @param  {int} Array index of School Model  
     */
    function deleteSchool(id) {
      vm.model = vm.content;
      var deferred = $q.defer();
      var sch = vm.model[id];
      if (sch.data.id) {
        var delSchool = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/schoolEducations/' + sch.data.id)
          .setDeleteMethod();
        if (window.confirm("Are you sure you want to delete '" + sch.data.schoolName + "' ?")) {
          delSchool.execute().then(function(response) {
            vm.model.splice(id, 1);
          });
        }
      } else {
        vm.model.splice(id, 1);
        vm.addInProcess = false;
      }
    }

    /**
     * Edit details of a single School.
     * @param  {int} Array index of School Model  
     */
    function editForm(md) {
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addSchoolModel() {
      vm.content.push({
        isEditable: true
      });
      vm.addInProcess = true;
    }

    /*** CRUD Methods End***/

  }
})();
