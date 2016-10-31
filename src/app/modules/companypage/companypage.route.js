(function() {
  'use strict';

  angular
    .module('lollibond.companypage')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('personal.companypage', {
        url: '/cp/:cid',
        templateUrl: 'app/modules/companypage/companypage.html',
        controller: 'CompanyPageController',
        controllerAs: 'vm'
      })
      .state('personal.companypage.posts', {
        url: '/posts',
        templateUrl: 'app/modules/companypage/posts/posts.html',
        controller: 'CompanyPostsController',
        controllerAs: 'vm'
      })
      .state('personal.companypage.about', {
        url: '/about',
        templateUrl: 'app/modules/companypage/about/about.html',
        controller: 'CompanyAboutController',
        controllerAs: 'vm'
      })
      .state('personal.companypage.gallery', {
        url: '/gallery',
        templateUrl: 'app/modules/companypage/gallery/gallery.html',
        controller: 'CompanyGalleryController',
        controllerAs: 'vm'
      })
      .state('personal.companysetup', {
        url: '/company-setup',
        templateUrl: 'app/modules/companypage/companysetup.html',
        controller: 'CompanySetupController',
        controllerAs: 'vm'
      })
      .state('personal.companypage.gallery.album', {
        url: '/album',
        templateUrl: 'app/modules/companypage/gallery/album/album.html',
        controller: 'CompanyAlbumController',
        controllerAs: 'vm'
      })
      .state('personal.companypage.gallery.profilepic', {
        url: '/profilepic',
        templateUrl: 'app/modules/companypage/gallery/profilepic/profilepic.html',
        controller: 'CompanyProfilePicController',
        controllerAs: 'vm'
      })
      .state('personal.companypage.gallery.coverphoto', {
        url: '/coverphoto',
        templateUrl: 'app/modules/companypage/gallery/coverphoto/coverphoto.html',
        controller: 'CompanyCoverPhotoController',
        controllerAs: 'vm'
      });
  }
})();
