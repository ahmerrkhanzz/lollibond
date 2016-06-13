(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('EducationController', EducationController);

  /** @ngInject */
  function EducationController($http, countries, $resource, $scope, baseService, $q, profileService, AddSection) {
    var vm = this;
    
    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updateEducation = updateEducation;
    vm.deleteEducation = deleteEducation;
    vm.addEducationModel = addEducationModel;
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
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'College Name',
        required: true
      },
      validators: {
        notBar: "$viewValue !== 'notBob'"
      }
    }, {
      type: 'input',
      key: 'fieldOfStudy',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Field of Study'
      }
    }, {
      type: 'input',
      key: 'degree',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Degree Name:'
      }
    }, {
      type: 'input',
      key: 'grade',
      className: 'col-md-6',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Grade:'
      }
    }, {
      type: 'input',
      key: 'activities',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'activities:'
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
        key: 'currentlystudying',
        className: 'col-md-12',
        type: 'checkbox',
        templateOptions: {
          label: 'Currently Studying'
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
          'templateOptions.disabled': 'model.currentlystudying'
        }
      }]
    },
    {
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
      type: 'select',
      key: 'currentSelectedPrivacy',
      className: 'col-md-12',
      defaultValue: "public",
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
     * Create/Update Method of single Education.
     * @param  {int} Array index of Education Model  
     * if edu.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updateEducation(id) {
      vm.model = vm.content;
      var edu = vm.model[id];
      var postParams = {
        "activities": edu.data.activities,
        "degree": edu.data.degree,
        "description": edu.data.description,
        "fieldOfStudy": edu.data.fieldOfStudy,
        "fromDate": edu.data.fromDate,
        "grade": edu.data.grade,
        "schoolId": edu.data.schoolId,
        "schoolName": edu.data.schoolName,
        "toDate": edu.data.toDate
      }
      if (edu.data.id) {
        var editEducation = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/collegeEducations/' + edu.data.id)
          .setPutMethod()
          .setPostParams(postParams);
        editEducation.execute().then(function(response) {
          edu.isEditable = false;
        });
      } else {
        var saveEducation = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/collegeEducations/')
          .setPostMethod()
          .setPostParams(postParams);
        saveEducation.execute().then(function(response) {
          edu.data.id = response.id;
          edu.isEditable = false;
          vm.addInProcess = false;
        });
      }
    }

    /**
     * Delete details of a single education.
     * @param  {int} Array index of Education Model  
     */
    function deleteEducation(id) {
      vm.model = vm.content;
      var deferred = $q.defer();
      var edu = vm.model[id];
      if (edu.data.id) {
        var delEducation = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/collegeEducations/' + edu.data.id)
          .setDeleteMethod();
        if (window.confirm("Are you sure you want to delete '" + edu.data.schoolName + "' ?")) {
          delEducation.execute().then(function(response) {
            vm.model.splice(id, 1);
          });
        }
      }else{
        vm.model.splice(id, 1);
        vm.addInProcess = false;
      }
    }

    /**
     * Edit details of a single education.
     * @param  {int} Array index of Education Model  
     */
    function editForm(md) {
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addEducationModel() {
      vm.content.push({
        isEditable: true
      });
      vm.addInProcess = true;
    }

    /*** CRUD Methods End***/

  }
})();
