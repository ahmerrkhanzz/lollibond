(function() {
  'use strict';

  angular
    .module('lollibond.pptraits')
    .controller('PPTraitsController', PPTraitsController);

  /** @ngInject */
  function PPTraitsController(authService, baseService) {
    var vm = this;

    /*
    |--------------------------------------------------------------------------
    | Current User ID
    |--------------------------------------------------------------------------
    */

    var currentUserId = authService.UID;

    /*
    |--------------------------------------------------------------------------
    | Question JSON
    |--------------------------------------------------------------------------
    */

    /*vm.ppTraits = {
      questionnaireCategory: '',
      quetionnaireTitle: '',
      questions: [{
        questionType: '',
        questionTitle: '',
        required: '',
        priority: '',
        sectionId: '',
        sectionName: '',
        choices: [{
          id: '',
          choiceTitle: '',
          grade: '',
          sortOrder: '',
          questionId: ''
        }, {
          id: '',
          choiceTitle: '',
          grade: '',
          sortOrder: '',
          questionId: ''
        }, {
          id: '',
          choiceTitle: '',
          grade: '',
          sortOrder: '',
          questionId: ''
        }, {
          id: '',
          choiceTitle: '',
          grade: '',
          sortOrder: '',
          questionId: ''
        }, {
          id: '',
          choiceTitle: '',
          grade: '',
          sortOrder: '',
          questionId: ''
        }]
      }]
    }*/

    /*
    |--------------------------------------------------------------------------
    | Get All Question Of Personality Profile Traits
    |--------------------------------------------------------------------------
    */

    function init() {
      var ppTraits = new baseService();
      ppTraits
        .setPath('ray', '/pp-assessment/generate/' + currentUserId)
        .execute()
        .then(function(res){
          vm.ppTraits = res;          
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Save Personality Profile Traits Assesment
    |--------------------------------------------------------------------------
    |
    | First create variable of selected choices array.
    | apply map in current JSON of question
    | and apply filter in question choices 
    | and push that data to selected choice array.
    |
    */

    vm.selectedChoicesArray = {
      submittedChoices: []
    }

    function savePPTraitsAssessment() {
      vm.ppTraits.questions.map(function(object) {
        object.choices.filter(function (obj) {
          if(object.selected_id == obj.id){
            vm.selectedChoicesArray.submittedChoices.push({          
              choiceTitle: obj.choiceTitle,
              grade: obj.grade,
              id: obj.id,
              questionId: obj.questionId,
              sortOrder: obj.sortOrder
            });
          }
        });
      });     

      var savePPTraits = new baseService();
      savePPTraits
        .setPath('ray', '/pp-assessment/evaluate/' + vm.ppTraits.id)
        .setPostMethod()
        .setPostParams(vm.selectedChoicesArray)
        .execute().then(function(res) {
          vm.evaluatePPTraits = res;
        }); 
    }
    
    init(); 

    /*
    |--------------------------------------------------------------------------
    | Function Assignment
    |--------------------------------------------------------------------------
    */

    vm.savePPTraitsAssessment = savePPTraitsAssessment;
  }
})();
