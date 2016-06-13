(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('PublicationController', PublicationController);

  /** @ngInject */
  function PublicationController($http, countries, $resource, $scope, baseService, $q, profileService, AddSection) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updatePublication = updatePublication;
    vm.deletePublication = deletePublication;
    vm.addPublicationModel = addPublicationModel;
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
        label: 'Publication Title:'
      }
    }, {
      type: 'input',
      key: 'publisher',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Publisher:'
      }
    }, {
      key: 'publicationDate',
      className: 'col-md-12',
      type: 'datepickerformly',
      templateOptions: {
        label: 'Publication Date',
        type: 'text',
        datepickerPopup: 'dd-MMMM-yyyy'
      }
    }, {
      type: 'input',
      key: 'url',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'URL:'
      }
    }, {
      type: 'input',
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
     * Create/Update Method of single Publication.
     * @param  {int} Array index of Publication Model  
     * if pub.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updatePublication(id) {
      vm.model = vm.content;
      var pub = vm.model[id];
      var postParams = {
        "publisher": pub.data.publisher ,
        "description": pub.data.description,
        "publicationDate": pub.data.publicationDate,
        "url": pub.data.url
      };
      if (pub.data.id) {
        var editPublication = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/publications/' + pub.data.id)
          .setPutMethod()
          .setPostParams(postParams);
        editPublication.execute().then(function(response) {
          pub.isEditable = false;
        });
      } else {
        var savePublication = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/publications/')
          .setPostMethod()
          .setPostParams(postParams);
        savePublication.execute().then(function(response) {
          pub.data.id = response.id;
          pub.isEditable = false;
          vm.addInProcess = false;
        });
      }
    }

    /**
     * Delete details of a single Publication.
     * @param  {int} Array index of Publication Model  
     */
    function deletePublication(id) {
      vm.model = vm.content;
      var deferred = $q.defer();
      var pub = vm.model[id];
      if (pub.data.id) {
        var delPublication = new baseService()
          .setPath('http://dev1.bond.local:9999/user/me/publications/' + pub.data.id)
          .setDeleteMethod();
        if (window.confirm("Are you sure you want to delete '" + pub.data.publisher + "' ?")) {
          delPublication.execute().then(function(response) {
            vm.model.splice(id, 1);
          });
        }
      } else {
        vm.model.splice(id, 1);
        vm.addInProcess = false;
      }
    }

    /**
     * Edit details of a single Publication.
     * @param  {int} Array index of Publication Model  
     */
    function editForm(md) {
      vm.model = vm.content;
      md.isEditable = !md.isEditable;
    }

    function addPublicationModel() {
      vm.content.push({
        isEditable: true
      });
      vm.addInProcess = true;
    }

    /*** CRUD Methods End***/

  }
})();
