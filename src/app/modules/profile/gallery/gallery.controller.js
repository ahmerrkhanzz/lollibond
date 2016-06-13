(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .controller('GalleryController', GalleryController);

  /** @ngInject */
  function GalleryController($resource) {
    var vm = this;

    var photos = $resource('http://localhost:3004/photosdata/');

    photos.query(function(data) {
      vm.galleryPhotos = data;
    });
  }
})();
