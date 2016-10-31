(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .component('publication', {
      bindings: {
        content: '<',
        hasdata: "="
      },
      controller: PublicationController,
      controllerAs: 'vm',
      templateUrl: 'app/modules/profile/about/publication/publication.html'
    });

  /** @ngInject */
  function PublicationController($window, $http, profileService, AddSection, aboutService, baseService, lbUtilService) {
    var vm = this;

    // funcation assignment
    vm.profileService = profileService;
    vm.editForm = editForm;
    vm.updatePublication = updatePublication;
    vm.deletePublication = deletePublication;
    vm.addPublicationModel = addPublicationModel;
    vm.copyFields = AddSection.copyFields;
    vm.reset = reset;
    vm.dateInit = {
      from: ''
    };

    // variable assignment
    vm.options = {};
    vm.originalFields = angular.copy(vm.fields);
    vm.disabledAddMode = false;
    var origModel = {};  

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
        label: 'Publication Title:',
        required: true,
        maxlength: 100,
        focus: true
      }
    }, {
      type: 'input',
      key: 'publisher',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Publisher:',
        required: true,
        maxlength: 100
      }
    }, {
      key: 'publicationDate',
      className: 'col-md-12',
      type: 'datepickerformly',
      templateOptions: {
        label: 'Publication Date',
        type: 'text',
        datepickerPopup: 'dd-MMMM-yyyy'
      },
      controller: function($scope) {
        $scope.to.datepickerOptions.initDate = vm.dateInit.from;
      }
    }, {
      key: 'author',
      type: 'tag',
      className: 'col-md-12',
      templateOptions: {
        label: 'Author',
        displayProperty: 'name',
        placeholder: "+ Add more authors",
        loadList: authorList
      }
    }, {
      type: 'input',
      key: 'url',
      className: 'col-md-12',
      ngModelElAttrs: {
        class: 'form-control input-xs'
      },
      templateOptions: {
        label: 'Website:',
        maxlength: 100
      },
      validators: {
        urlAddress: {
          expression: function($viewValue, $modelValue) {
            var value = $modelValue || $viewValue;
            if($modelValue){
              var regexPattern = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@%_\+.~#?&//=]*)/g;
              return regexPattern.test(value);
            }else{
              return true;
            }
          },
          message: '$viewValue + " is not valid"'
        }
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
     * Create/Update Method of single Publication.
     * @param  {int} Array index of Publication Model
     * if pub.data.id exists then it updates the object
     * Else it will create a new object and save the details
     */
    function updatePublication(id) {
      if (vm.form.$valid) {
        vm.model = vm.content;
        var pub = vm.model[id];

        var authors = {
          int: [],
          ext: []
        };
        if(pub.data.author){
          // Fetching Internal and external author on the basis of Lollibond ID
          pub.data.author.reduce(function(prev, next){ 
            if(next.id){
              prev['int'].push(next.id);
            }else{
              prev['ext'].push(next.name);
            }
            return prev;
          }, authors);
        }


        var postParams = {
          title: pub.data.title,
          publisher: pub.data.publisher,
          description: pub.data.description,
          publicationDate: pub.data.publicationDate,
          url: pub.data.url,
          internalAuthors: authors.int || [],
          externalAuthors: authors.ext || [],
          id: pub.data.id || ''
        };

        if (pub.data.id) {
          var editPublication = aboutService.updateSection(aboutService.SECTION.PUBLICATION, postParams, pub.data.id);
          editPublication.execute().then(function() {
            pub.isEditable = false;
            vm.disabledAddMode = false;
          });
        } else {
          var savePublication = aboutService.addSection(aboutService.SECTION.PUBLICATION, postParams);
          savePublication.execute().then(function(response) {
            pub.data.id = response.id;
            pub.isEditable = false;
            pub.addInProcess = false;
            vm.disabledAddMode = false;
          });
        }
      }
    }

    /**
     * Delete details of a single Publication.
     * @param  {int} Array index of Publication Model
     */
    function deletePublication(id) {
      vm.model = vm.content;
      var pub = vm.model[id];
      if (pub.data.id) {
        var delPublication = aboutService.deleteSection(aboutService.SECTION.PUBLICATION, pub.data.id);        
        delPublication.execute().then(function() {
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
     * Edit details of a single Publication.
     * @param  {int} Array index of Publication Model
     */
    function editForm(md) {
      //Saving Data for Reset function
      origModel = angular.copy(md);
      vm.dateInit = {
        from: new Date(md.data.publicationDate)
      };
      vm.disabledAddMode = true;
      
      
      // Set Empty array Author 
      var authorTemp = [];
      if(md.data.externalAuthors){
        //Set External/Internal Author into one field
        md.data.externalAuthors.map(function(val){
          authorTemp.push({
            name:val
          });
        })
      }

      if(md.data.internalAuthors){
        //Set Internal Author into one field
        md.data.internalAuthors.map(function(obj){
          authorTemp.push({
            id: obj.id,
            name: obj.firstName,
            image: obj.profilePicture
          });
        })
      }

      //Set Formly model with data
      vm.model = md.data;
      vm.model.author = authorTemp;

      md.isEditable = !md.isEditable;
    }

    function addPublicationModel() {
      vm.dateInit = {
        from: new Date()
      };

      vm.content.push({
        isEditable: true,
        addInProcess: true
      });
      vm.disabledAddMode = true;
      vm.hasdata = true;
    }

    /*** CRUD Methods End***/
    function authorList(val){
      // Detemine string of whitespaces
      var expression = /^\s+$/g;
      var regex = new RegExp(expression);

      if (!val.match(regex)) {
        return new baseService()
          .setPath('peacock', '/user/me/bonds?count=10&cursor=1')
          .execute().then(function(response){
            return response.values
              .map(function(user) {
                user.profilePicture = lbUtilService.setProfilePicture(user.profilePicture, user.gender);
                return {
                  id: user.id,
                  name: user.firstName,
                  image: user.profilePicture
                } ;
              });
          });
      }else{
        return [];
      }
    }

  }
})();
