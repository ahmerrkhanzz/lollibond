(function() {
  'use strict';

  angular
    .module('lollibond.profile')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('personal.profile', {
        url: '/u/:uid',
        templateUrl: 'app/modules/profile/profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm',
        abstract: true,
        resolve: {
          pageTitle: function() { return null;}
        },
        onEnter: ['$stateParams', '$state', function($stateParams, $state) {
          // If state param (uid) string is empty
          // redirect to feed page
          if (!$stateParams.uid) {
            $state.go('personal.feed');
          }
        }]
      })
      .state('personal.profile.posts', {
        url: '/posts',
        templateUrl: 'app/modules/profile/posts/posts.html',
        controller: 'PostsController',
        controllerAs: 'vm'
      })
      .state('personal.profile.about', {
        url: '/about',
        templateUrl: 'app/modules/profile/about/about.html',
        controller: 'AboutController',
        controllerAs: 'vm'
      })
      .state('personal.profile.gallery', {
        url: '/gallery',
        templateUrl: 'app/modules/profile/gallery/gallery.html',
        controller: 'GalleryController',
        controllerAs: 'vm'
      })
      .state('personal.profile.network', {
        url: '/network',
        templateUrl: 'app/modules/profile/network/network.html',
        controller: 'NetworkController',
        controllerAs: 'vm',
        params: {
          activeTab: 0
        }
      })
      .state('personal.profile.activities', {
        url: '/activities',
        templateUrl: 'app/modules/profile/activities/activities.html',
        controller: 'ActivitiesController',
        controllerAs: 'vm'
      })
      .state('personal.profile.gallery.album', {
        url: '/albums',
        templateUrl: 'app/modules/profile/gallery/album/album.html',
        controller: 'AlbumController',
        controllerAs: 'vm'
      })
      .state('personal.profile.gallery.singlealbum', {
        url: '/albums/:aid',
        templateUrl: 'app/modules/profile/gallery/album/singlealbum.html',
        controller: 'SingleAlbumController',
        controllerAs: 'vm'
      })
      .state('personal.profile.gallery.profilepic', {
        url: '/profilepic',
        templateUrl: 'app/modules/profile/gallery/profilepic/profilepic.html',
        controller: 'ProfilePicController',
        controllerAs: 'vm'
      })
      .state('personal.profile.gallery.coverphoto', {
        url: '/coverphoto',
        templateUrl: 'app/modules/profile/gallery/coverphoto/coverphoto.html',
        controller: 'CoverPhotoController',
        controllerAs: 'vm'
      });
  }
})();
