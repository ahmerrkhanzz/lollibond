(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .service('aboutService', aboutService);

  /** @ngInject */
  function aboutService(baseService) {
    var SECTION = {
      AFFILLIATION: 'affiliations',
      AWARD: 'awards',
      COLLEGE_EDUCATION: 'collegeEducations',
      EXPERIENCE: 'workExperiences',
      LANGUAGE: 'languageProficiencies',
      CERTIFICATIONS: 'certifications',
      PUBLICATION: 'publications',
      SCHOOL: 'schoolEducations',
      TRAINING: 'trainingExperiences',
      VOLUNTEER: 'volunteers',
      PHONE: 'phones'
    };

    // Service available function declarations
    return {
      SECTION: SECTION,
      addSection: addSection,
      deleteSection: deleteSection,
      updateSection: updateSection,
      getSection: getSection,
      updateUser: updateUser
    };

    //Post
    function addSection(sectionName, postParams) {
      return new baseService()
        .setPath('peacock','/user/me/' + sectionName + '/')
        .setPostMethod()
        .setPostParams(postParams);
    }

    //Delete
    function deleteSection(sectionName, sectionID) {
      return new baseService()
        .setPath('peacock','/user/me/' + sectionName + '/' + sectionID)
        .setDeleteMethod();
    }

    //patch call
    function updateUser(postParams) {
      return new baseService()
        .setPath('peacock','/user/me/')
        .setPatchMethod()
        .setPostParams(postParams);
    }

    //Put
    function updateSection(sectionName, postParams, sectionID) {
      return new baseService()
        .setPath('peacock','/user/me/' + sectionName + '/' + sectionID)
        .setPutMethod()
        .setPostParams(postParams);
    }

    //Get
    function getSection(sectionName, sectionID) {
      return new baseService()
        .setPath('peacock','/user/me/' + sectionID + '/' + sectionName);
    }
  }
})();
