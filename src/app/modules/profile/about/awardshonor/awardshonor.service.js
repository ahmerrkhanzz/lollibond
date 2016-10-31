(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .service('awardsHonorService', awardsHonorService);

  /** @ngInject */
  function awardsHonorService(baseService) {

    return {
      occupationData: occupationData
    };

    function occupationData() {
      return new baseService()
        .setPath('peacock','/user/me')
        .execute().then(function (response) {           
          var expTitle = response.workExperiences.map(function(obj){
            return obj.title + ' at ' + obj.companyName;
          });

          var degreeTitle = response.colleges.map(function(obj){
            return obj.degree + ' from ' + obj.schoolName;
          });

          var schoolTitle = response.schools.map(function(obj){
            return obj.schoolName;
          });

          var total = expTitle.concat([], degreeTitle, schoolTitle);

          var tmpObj = total.map(function(item) {
            return {
              name: item,
              value: item
            };
          });

          tmpObj.unshift({
            name: 'Select Occupation',
            value: ''
          });

          return tmpObj;
        });
    }
  }    
})();