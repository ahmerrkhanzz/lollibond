(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('AboutController', AboutController);

  /** @ngInject */
  function AboutController($resource, $log, $http, baseService, $q, profileService) {
    var vm = this;


   

    
    //Create an instance of BASE Service
    var getAboutData = new baseService();
    getAboutData.setPath('http://dev1.bond.local:9999/user/' + profileService.profileId);
    getAboutData.execute().then(function (response) {
      vm.user = response || [];
      vm.aboutSections = [
        {
          id: "personal-profile",
          name:"Personal Profile",
          icon: "icon-user-tie",
          isActive: true
        },
        {
          id: "why-me",
          name:"Why Me",
          icon: "icon-user",
          isActive: vm.user.whyMe != null
        },
        {
          id: "education",
          name:"College",
          icon: "icon-graduation",
          isActive: vm.user.colleges.length > 0
        },
        {
          id: "school",
          name:"High School",
          icon: "icon-library2",
          isActive: vm.user.schools.length > 0
        },
        {
          id: "skills",
          name:"Skills",
          icon: "icon-quill2",
          isActive: true
        },
        {
          id: "language",
          name:"Language",
          icon: "icon-earth",
          isActive: vm.user.languageProficiencies.length > 0
        },
        {
          id: "experience",
          name:"Experience",
          icon: "icon-briefcase",
          isActive: vm.user.workExperiences.length > 0
        },
        {
          id: "award-honors",
          name:"Award Honors",
          icon: "icon-trophy2",
          isActive: vm.user.awards.length > 0
        },
        {
          id: "training-experience",
          name:"Training Experience",
          icon: "icon-copy",
          isActive: vm.user.trainingExperiences.length > 0
        },
        {
          id: "volunteering-experience",
          name:"Volunteering Experience",
          icon: "icon-droplet",
          isActive: vm.user.volunteers.length > 0
        },
        {
          id: "license-certification",
          name:"License Certification",
          icon: "icon-certificate",
          isActive: vm.user.certifications.length > 0
        },
        {
          id: "affiliations-memberships",
          name:"Affiliation Membership",
          icon: "icon-credit-card",
          isActive: vm.user.affiliations.length > 0
        },
        {
          id: "publication",
          name:"Publication Presentation",
          icon: "icon-book",
          isActive: vm.user.publications.length > 0
        }
      ];
      vm.colleges = vm.user.colleges.map(function(obj){ 
        return {
          data: obj,
          isEditable: false
        };
      });
      vm.schools = vm.user.schools.map(function(obj){ 
        return {
          data: obj,
          isEditable: false
        };
      });
      vm.affiliations = vm.user.affiliations.map(function(obj){ 
        return {
          data: obj,
          isEditable: false
        };
      });
      vm.awards = vm.user.awards.map(function(obj){ 
        return {
          data: obj,
          isEditable: false
        };
      });
      vm.experiences = vm.user.workExperiences.map(function(obj){ 
        return {
          data: obj,
          isEditable: false
        };
      });
      vm.languages = vm.user.languageProficiencies.map(function(obj){ 
        return {
          data: obj,
          isEditable: false
        };
      });
      vm.training = vm.user.trainingExperiences.map(function(obj){ 
        return {
          data: obj,
          isEditable: false
        };
      });
      vm.volunteers = vm.user.volunteers.map(function(obj){ 
        return {
          data: obj,
          isEditable: false
        };
      });
      vm.certifications = vm.user.certifications.map(function(obj){ 
        return {
          data: obj,
          isEditable: false
        };
      });
      vm.publications = vm.user.publications.map(function(obj){ 
        return {
          data: obj,
          isEditable: false
        };
      });

    });
    // Check if section available
    function sectionAvailablity(id) {
      $log.log("sectionAvailablity function called in About!" + id);
    }

    // Add section from dropdown
    function addSection(id) {
      $log.log("Add Section!" + id);
    }

    vm.addSectionCollpased = true;

    // Function Assignment
    vm.sectionAvailablity = sectionAvailablity;
    vm.addSection = addSection;
    vm.profileService = profileService;

  }
})();
