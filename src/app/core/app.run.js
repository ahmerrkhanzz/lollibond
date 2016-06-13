(function() {
  'use strict';

  angular
    .module('lollibond')
    .run(runBlock);

  /** @ngInject */
  function runBlock(formlyConfig, formlyValidationMessages) {
    formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
    formlyValidationMessages.addStringMessage('required', 'This field is required');
  }

})();
