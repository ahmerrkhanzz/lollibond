(function() {
  'use strict';

  angular
    .module('lollibond.core')
    .factory('imageService', imageService);

  /** @ngInject */
  function imageService($http, $q) {
    var IMG_SERVER_ENDPOINT = 'http://172.16.18.73:8080/imageUpload';

    var service = {
      uploadProfilePic: uploadProfilePic,
      uploadAlbumPic: uploadAlbumPic
    };

    // Service available functions
    return service;

    /////////////////////////
    function uploadProfilePic(xPos, yPos, width, height, type, file) {
      var fd = new FormData();

      fd.append('uploadfile', file);
      fd.append('crop-x', xPos);
      fd.append('crop-y', yPos);
      fd.append('crop-width', width);
      fd.append('crop-height', height);
      fd.append('image-profile', type);
      fd.append('token', 'f2956f214d23e7a05475d0ffb99e5fb7');

      return $http.post('http://172.16.18.73:8080/imageUpload', fd, {
        headers: { 'Content-Type': undefined }
      }).then(function(res) {
        return res.data;
      });
    }

    function uploadAlbumPic(imgFile) {
      var deferred = $q.defer();
      var fd = new FormData();
      fd.append('uploadfile', imgFile);
      fd.append('image-profile', 'album-photo');
      fd.append('token', 'f2956f214d23e7a05475d0ffb99e5fb7');

      $http.post(IMG_SERVER_ENDPOINT, fd, {
        headers: { 'Content-Type': undefined }
      }).then(function(res){
        if (/invalid/.test(res.data)) {
          deferred.reject('Invalid image format.');
        } else {
          deferred.resolve(res);
        }
      }, function(err){
        deferred.reject('Failed upload ' + err);
      });

      return deferred.promise;
    }
  }
})();
