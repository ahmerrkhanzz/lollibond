(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .directive('lbUserSummary', lbUserSummary);

  /** @ngInject */
  function lbUserSummary($document, $window, $timeout) {
    var directive = {
      restrict: 'A',
      scope: {
        authorId: '@',
        userSummary: '='
      },
      controller: LbUserSummaryController,
      controllerAs: 'vm',
      bindToController: true,
      link: linker
    };
    return directive;

    function linker(scope, el) {
      var popupTimer;
      var populateInfo = true;

      // if Element is Clicked
      el.on('click', function(){
        populateInfo = false;
      });

      function showPopup() {
        popupTimer = $timeout(populatePopup.bind(this), 1000);
      }

      function populatePopup() {
        // If element is click, Don't populate info
        if(!populateInfo) return false;

        // Element box model and dimensions
        var elDimensions = this.getBoundingClientRect();

        // Layout contant variables
        var POPUP_WIDTH = 460;
        var POPUP_HEIGHT = 91;
        var HEADER_HEIGHT = 50;
        var TOP_MARGIN = 164;

        // Body and document dom nodes for easy access
        var body = $document[0].body;
        var docEl = $document[0].documentElement;

        var scrollTop = $window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = $window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        // Element offsets
        var elOffset = angular.element(this).offset();

        // Positions for the summary popup
        var popupPos = {};

        // Check if element is at top of screen
        if (elOffset.top - scrollTop > POPUP_HEIGHT + HEADER_HEIGHT) {
          popupPos = {
            x: elDimensions.left + scrollLeft - (POPUP_WIDTH / 2),
            y: elDimensions.top + scrollTop - TOP_MARGIN - POPUP_HEIGHT
          }
        } else {
          popupPos = {
            x: elDimensions.left + scrollLeft - (POPUP_WIDTH / 2),
            y: elDimensions.top + scrollTop - TOP_MARGIN + 86
          }
        }

        scope.vm.renderPopup(popupPos.x, popupPos.y);
      }

      function hidePopup(e) {
        $timeout.cancel(popupTimer);
        var target = angular.element(e.relatedTarget);

        if (!target.hasClass('summary-box__content')) {
          scope.vm.hidePopup();
        }

        scope.$apply();
      }

      function cleanup() {
        el.off('mouseenter', showPopup);
        el.off('mouseleave', hidePopup);

        // Hide summary popup on element destroy
        scope.vm.hidePopup();
      }

      // Event bindings
      el.on('mouseenter', showPopup);
      el.on('mouseleave', hidePopup);

      // Remove bindings on destroy
      scope.$on('$destroy', cleanup);
    }

    /** @ngInject */
    function LbUserSummaryController($scope, userSummaryService, authService, baseService, lbUtilService) {
      var vm = this;
      var MEDIA_SERVER_URL = 'https://s3-us-west-2.amazonaws.com/bondtestupload/c1400x300/';


      function renderPopup(xPos, yPos) {
        var styles = {
          transform: 'translate(' + xPos + 'px, ' + yPos + 'px)',
          visibility: 'visible'
        };

        // Use the provided summary or
        // load from pre-fetched data
        var summary = vm.userSummary || userSummaryService.loadedUsers[vm.authorId];

        if (summary) {
          setServiceData(summary, styles);
        } else {
          getData(vm.authorId).then(function(res) {
            setServiceData(res, styles);
            // The fetched data is saved in loadedUsers so
            // it can be used later without api call
            userSummaryService.loadedUsers[res.id] = res;
          });
        }

        $scope.$apply();
      }

      function setServiceData(summary, styles) {
       
        // User data
        userSummaryService.isData = summary;
        userSummaryService.isFollowed = summary.followed;
        userSummaryService.isBonded = summary.bondTypes.length > 0;
        userSummaryService.isRequested = summary.requestSent;
        userSummaryService.isReceived = summary.requestRecieved;
        userSummaryService.loggedInUserId = authService.UID;
        // Set Profile picture
        userSummaryService.isData.profilePicture = lbUtilService.setProfilePicture(summary.profilePicture, summary.gender);
        // Popup layout variables
        userSummaryService.popupStyles = styles;

        if (userSummaryService.isData.coverPhoto){
          userSummaryService.cover = MEDIA_SERVER_URL + userSummaryService.isData.coverPhoto;
        } else{
          userSummaryService.cover = 'assets/images/dummy/covers/cover-dummy.jpg';
        }
      }

      function getData(id) {
        return new baseService()
          .setPath('peacock', '/user/' + id + '/summary')
          .execute().then(function(res) {
            return res;
          });
      }

      //////////////////////////
      vm.renderPopup = renderPopup;
      vm.hidePopup = userSummaryService.hidePopup;
    }
  }
})();
