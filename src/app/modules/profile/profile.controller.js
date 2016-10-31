(function() {
    'use strict';

    angular
        .module('lollibond.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($scope, $window, $rootScope, $stateParams, baseService, $state, profileService, authService, bondService, lbUtilService, $uibModal) {
        var vm = this;
        var paramId = !$stateParams.uid ? authService.UID : $stateParams.uid;
        var MEDIA_SERVER_URL = 'https://s3-us-west-2.amazonaws.com/bondtestupload/c1400x300/';


        // Loader variable
        vm.postsLoading = true;
        vm.isProfilePicLoading = false;
        vm.isCoverPhotoLoading = false;
        vm.profilePictureExists = false;
        vm.coverPhotoExists = false;
        vm.coverPhoto = false;


        


        // Check for the UID in params
        // If no UID is there, use logged-in UID
        profileService.checkProfile(paramId);

        // Check if uid is of the logged-in user
        vm.profileService = profileService;

        function init() {

          // Show the loader while loading posts
          vm.postsLoading = true;

          var userSummary = new baseService();
          userSummary
              .setPath('peacock', '/user/' + paramId + '/summary')
              .execute()
              .then(setUserInfo)
              .finally(function() {
                  // Hide the loader
                  vm.postsLoading = false;
              });
        }

        function setUserInfo(userData) {
            vm.username = userData.firstName + ' ' + userData.lastName;
            vm.latestWorkExperience = userData.latestWorkExperience;
            vm.profilePicture = lbUtilService.setProfilePicture(userData.profilePicture, userData.gender);
            if (userData.profilePicture) vm.profilePictureExists = true;

            if (userData.coverPhoto) {
                vm.coverPhoto = MEDIA_SERVER_URL + userData.coverPhoto;
                vm.coverPhotoExists = true;
            } else {
                vm.coverPhoto = 'assets/images/dummy/covers/cover-dummy.jpg';
            }

            vm.profileService.isFollowed = userData.followed;
            vm.profileService.isBonded = userData.bondTypes.length > 0;
            vm.profileService.isRequested = userData.requestSent;
            vm.profileService.isReceived = userData.requestRecieved;

            $rootScope.pageTitle = userData.firstName + ' ' + userData.lastName;
        }

        function unbondUser() {
            bondService.deleteBond(profileService.profileId).then(function() {
                vm.profileService.isBonded = false;
                vm.profileService.isFollowed = false;
            });
        }

        function bondUser() {
            bondService.bondRequest(profileService.profileId).then(function() {
                vm.profileService.isRequested = true;
            });
        }

        function cancelRequest() {
            bondService.deleteRequest(profileService.profileId).then(function() {
                vm.profileService.isRequested = false;
            })
        }

        function unfollowUser() {
            bondService.unfollowUser(profileService.profileId).then(function() {
                vm.profileService.isFollowed = false;
            });
        }

        function followUser() {
            bondService.followUser(profileService.profileId).then(function() {
                vm.profileService.isFollowed = true;
            });
        }

        function approveRequest() {
            bondService
                .bondRequest(profileService.profileId, bondService.requestType.ACCEPT)
                .then(function() {
                    vm.profileService.isReceived = false;
                    vm.profileService.isBonded = true;
                });
        }

        function rejectRequest() {
            bondService
                .bondRequest(profileService.profileId, bondService.requestType.REJECT)
                .then(function() {
                    vm.profileService.isReceived = false;
                    vm.profileService.isBonded = false;
                });
        }

        // Open create list modal
        function openProfilePictureModal() {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/shared/profile-picture/profile-picture-modal.html',
                controller: 'ProfilePicModalController',
                controllerAs: 'vm',
                size: 'lg'
            });

            modalInstance.result.then(function(result) {
                vm.isProfilePicLoading = true;
                vm.profilePicture = result;
                vm.profilePictureExists = true;
            });
        }


        // Open create list modal
        function openCoverPhotoModal() {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/shared/lb-cover-photo-modal/lb-cover-photo-modal.html',
                controller: 'LbCoverPhotoModalController',
                controllerAs: 'vm',
                size: 'lg'
            });

            modalInstance.result.then(function(result) {
                vm.isCoverPhotoLoading = true;
                vm.coverPhotoExists = true;

                var coverImg = new Image();
                coverImg.src = MEDIA_SERVER_URL + result;
                coverImg.onload = function() {
                    vm.isCoverPhotoLoading = false;
                    lbUtilService.safeApply.call($scope, function() {
                        vm.coverPhoto = coverImg.src;
                    })
                }
            });
        }

        function removeProfilePicture() {
            return new baseService()
                .setPath('peacock', '/user/me/profilePicture')
                .setDeleteMethod()
                .execute()
                .then(function() {
                    $window.location.reload();
                });
        }

        function deleteCoverPhoto() {
            return new baseService()
                .setPath('peacock', '/user/me/coverPhoto')
                .setDeleteMethod()
                .execute()
                .then(function() {
                    $window.location.reload();
                });
        }


        // Profile navigation collapse on small device
        vm.navbarCollapsed = true;

        // Profile navigation tabs
        vm.tabs = [{
            title: 'Post',
            icon: 'icon-magazine',
            route: 'personal.profile.posts'
        }, {
            title: 'About',
            icon: 'icon-insert-template',
            route: 'personal.profile.about'
        }, {
            title: 'Network',
            icon: 'icon-collaboration',
            route: 'personal.profile.network'
        }, {
            title: 'Gallery',
            icon: 'icon-images3',
            route: 'personal.profile.gallery.album'
        }];


        /*, {
          title: 'Recent Activities',
          icon: 'icon-droplets',
          route: 'personal.profile.activities'
        }
        */
        vm.activeTab = 0;

        // ace button
        // vm.aceUser = {
        //   individualAce: true,
        //   corporateAce: false,
        //   academicAce: false,
        //   individualAceCount: 200,
        //   corporateAceCount: 122,
        //   academicAceCount: 365,
        //   individualBond: true,
        //   corporateBond: false,
        //   academicBond: true
        // };

        init();

        //////////////////////////////
        vm.bondUser = bondUser;
        vm.unbondUser = unbondUser;
        vm.cancelRequest = cancelRequest;
        vm.followUser = followUser;
        vm.unfollowUser = unfollowUser;
        vm.rejectRequest = rejectRequest;
        vm.approveRequest = approveRequest;
        vm.openProfilePictureModal = openProfilePictureModal;
        vm.openCoverPhotoModal = openCoverPhotoModal;
        vm.removeProfilePicture = removeProfilePicture;
        vm.deleteCoverPhoto = deleteCoverPhoto;
    }
})();
