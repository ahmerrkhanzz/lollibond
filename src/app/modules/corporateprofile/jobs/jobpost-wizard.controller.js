(function () {
    'use strict';

    angular
        .module('lollibond.corporateprofile')
        .controller('JobPostWizardController', JobPostWizardController);

    /** @ngInject **/

    function JobPostWizardController(baseService, structureService, toaster, $log) {
        var vm = this;
        vm.jpTabs = ['Company Details', 'Job Description', 'Settings', 'Communications', 'Questionnaire']
        vm.companySizes = ['1-10', '11-30', '31-55', '56-100', '101-500', '501-1000', '1000+'];
        vm.companyTypes = ['Internet Consultancy', 'Computer Software'];
        vm.companyIndustries = ['Banking & Commerce', 'Hardware Networking', 'Sales & Marketing'];
        vm.duties = [];
        vm.degrees = [];
        vm.skills = [];
        vm.physicalAbilities = [];
        vm.certifications = [];
        vm.trainings = [];
        vm.language = {};


        // FUNCTION DEFINITION
        vm.tab = 1;

        function init() {
            getLanguages();
        }

        function setTab(newTab) {
            vm.tab = newTab;
        }

        function isSet(tabNum) {
            return vm.tab === tabNum;
        }

        function addEntity(item, arr) {
            arr.push(item);
        }

        function addLanguage(item) {
            vm.language[item.name.name] = item.proficiency;
        }

        // Get List of Languages
        function getLanguages() {
            return new baseService()
                .setPath('coral', '/api/v1/languages/list/en')
                .execute().then(function (response) {
                    vm.langObj = [];
                    angular.forEach(response, function (key, value) {
                        var langNewObj = {
                            code: value,
                            name: key
                        };
                        vm.langObj.push(langNewObj);
                        return vm.langObj;
                    });
                });
        }

        function selected(item) {
            $log.log(item);
        }

        function saveDraft() {
            var postParams = {
                jobPost: {
                    postForClient: vm.postForClient,
                    companyName: vm.companyName,
                    companyWebsite: vm.companyWebsite,
                    companySize: vm.companySize,
                    companyConfidential: vm.companyConfidential,
                    companyTagline: vm.companyTagline,
                    companyType: vm.companyType,
                    companyIndustry: vm.companyIndustry,
                    companyLogoKey: vm.companyLogoKey,
                    companyDescription: vm.companyDescription,
                    jobPostDescription: vm.jobPostDescription,
                    jobPurpose: vm.jobPurpose,
                    scopeOfWork: vm.scopeOfWork,
                    functionName: vm.functionName,
                    departmentName: vm.departmentName,
                    positionTitle: vm.positionTitle,
                    level: vm.level,
                    city: vm.city,
                    grade: vm.grade,
                    jobType: vm.jobType,
                    contractType: vm.contractType,
                    language: vm.language,
                    experienceRequired: vm.experienceRequired,
                    requiredExperienceInYears: vm.requiredExperienceInYears,
                    physicalAbilities: vm.physicalAbilities

                }
            }
            $log.log(postParams);
            // return new baseService()
            //     .setPath('ray', '/job-post/' + structureService.companyId)
            //     .setPostMethod()
            //     .setPostParams(postParams)
            //     .execute()
            //     .then(function (res) {
            //         $log.log(res);
            //         toaster.success({ title: "Successfully Updated!", body: "You have successfully updated company branch." });
            //     });
        }

        init();


        // FUNCTION ASSIGNMENTS

        vm.init = init;
        vm.selected = selected;
        vm.saveDraft = saveDraft;
        vm.isSet = isSet;
        vm.setTab = setTab;
        vm.addEntity = addEntity;
        vm.addLanguage = addLanguage;
        vm.getLanguages = getLanguages;
    }
})();
