(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('AboutController', AboutController);

  /** @ngInject */
  function AboutController($log, $http, baseService, $stateParams, $state, $q, profileService, authService) {
    var vm = this;
    var paramId = !$stateParams.uid ? authService.UID : $stateParams.uid;


    // Check for the UID in params
    // If no UID is there, use logged-in UID
    profileService.checkProfile(paramId);

    // Check if uid is of the logged-in user
    vm.profileService = profileService;


    function loadAboutSection() {
      vm.aboutLoading = true;
      if (profileService.ownProfile) {
        vm.ownProfile = true;
      } else {
        vm.ownProfile = false;
      }

      //Create an instance of BASE Service
      var getAboutData = new baseService();
      getAboutData.setPath('peacock','/user/' + profileService.profileId);
      getAboutData.execute().then(function (response) {
        vm.user = response || [];
        vm.aboutSections = [
          {
            id: "personal-profile",
            name: "Personal Information",
            icon: "icon-user-tie",
            isActive: true
          },
          {
            id: "why-me",
            name: "Why Me",
            icon: "icon-user",
            isActive: vm.user.whyMe != null
          },
          {
            id: "education",
            name: "College",
            icon: "icon-graduation",
            isActive: vm.user.colleges.length > 0
          },
          {
            id: "school",
            name: "High School",
            icon: "icon-library2",
            isActive: vm.user.schools.length > 0
          },
          {
            id: "skills",
            name: "Skills",
            icon: "icon-quill2",
            isActive: false
          },
          {
            id: "language",
            name: "Language",
            icon: "icon-earth",
            isActive: vm.user.languageProficiencies.length > 0
          },
          {
            id: "experience",
            name: "Experience",
            icon: "icon-briefcase",
            isActive: vm.user.workExperiences.length > 0
          },
          {
            id: "award-honors",
            name: "Awards & Honors",
            icon: "icon-trophy2",
            isActive: vm.user.awards.length > 0
          },
          {
            id: "training-experience",
            name: "Training Experience",
            icon: "icon-copy",
            isActive: vm.user.trainingExperiences.length > 0
          },
          {
            id: "volunteering-experience",
            name: "Volunteers & Hounors",
            icon: "icon-droplet",
            isActive: vm.user.volunteers.length > 0
          },
          {
            id: "license-certification",
            name: "License & Certifications",
            icon: "icon-certificate",
            isActive: vm.user.certifications.length > 0
          },
          {
            id: "affiliations-memberships",
            name: "Affiliations",
            icon: "icon-credit-card",
            isActive: vm.user.affiliations.length > 0
          },
          {
            id: "publication",
            name: "Publication Presentation",
            icon: "icon-book",
            isActive: vm.user.publications.length > 0
          },
          {
            id: "contactinfo",
            name: "ContactInfo",
            icon: "icon-briefcase",
            isActive: vm.user.phones.length > 0
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
        vm.languages = vm.user.languageProficiencies.sort(function(lang1, lang2) {
            return parseFloat(lang2.rate) - parseFloat(lang1.rate);
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
      })
      .then(function(){
        return new baseService()
          .setPath('peacock', '/user/' + profileService.profileId + '/skills')
          .execute()
          .then(function(res) {
            vm.skills = res;
            if(vm.skills.length > 0){
              vm.aboutSections[4].isActive = true;
            }
          })
      })
      .finally(function() {
        // Hide the loader
        vm.aboutLoading = false;
      });
    }

    // Check if section available
    function sectionAvailablity(id) {
      $log.log("sectionAvailablity function called in About!" + id);
    }

    // Add section from dropdown
    function addSection(id) {
      $log.log("Add Section!" + id);
    }

    loadAboutSection();

    vm.addSectionCollpased = true;

    // Function Assignment
    vm.sectionAvailablity = sectionAvailablity;
    vm.addSection = addSection;
    vm.profileService = profileService;
  }
})();
