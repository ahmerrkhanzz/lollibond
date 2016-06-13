(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .controller('PhotoController', PhotoController);

  /** @ngInject */
  function PhotoController(moment, $resource, $log) {
    var vm = this;

    // Post actions dropdown functionality
    vm.postActions = [{
      title: 'Remove this photo',
      icon: 'icon-user-lock',
      action: removePhoto
    }];

    function removePhoto() {
      $log.log('Hide user post');
    }
  }
})();
