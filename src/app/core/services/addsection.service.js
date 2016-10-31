(function() {
  'use strict';

  angular
    .module('lollibond')
    .service('AddSection', AddSection);

  /** @ngInject */
  function AddSection() {
    var unique = 1;

    // Service available function declarations
    return {
      copyFields: copyFields
    };

    /**
     * @param  {array} fields  Create a clone of the fields and adds random ID to each field
     * @return {array}   clone fields
     */
    function copyFields(fields) {
      fields = angular.copy(fields);
      addRandomIds(fields);
      return fields;
    }

    /**
     * @param  {array} fields    Takes and array of fields and update Id of each field
     * @return {array}           Returns fields with updated Random Ids
     */
    function addRandomIds(fields) {
      unique++;
      angular.forEach(fields, function(field, index) {
        if (field.fieldGroup) {
          addRandomIds(field.fieldGroup);
          return; // fieldGroups don't need an ID
        }
        if (field.templateOptions && field.templateOptions.fields) {
          addRandomIds(field.templateOptions.fields);
        }
        field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
      });
    }

    /**
     * @param  {int} fields    Takes two int for Min and Max and generate random number in between them
     * @return {int}           Returns random number
     */
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }
})();
