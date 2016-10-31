(function() {
  'use strict';

  angular
    .module('lollibond.shared')
    .component('lbRequestCard', {
      bindings: {
        cardData: '<',
        cardType: '<',
        spliceUserList: '&'
      },
      controller: LbRequestCardController,
      controllerAs: 'vm',
      templateUrl: 'app/shared/lb-user-card/lb-bond-card.html'
    });

  /** @ngInject */
  function LbRequestCardController(bondService, baseService, lbUtilService, toaster) {
    var vm = this;
    vm.bondTypeDropdown = {
      isopen: false
    };
    vm.bondTypes = [];

    // If Profile Picture Empty, Set Placeholder according to Gender
    vm.cardData.profilePicture = lbUtilService.setProfilePicture(vm.cardData.profilePicture, vm.cardData.gender);

    function approveRequest(uid, event) {
      event.preventDefault();
      toaster.success({ title: "Successfully bonded!", body: "Successfully bonded with " + vm.cardData.firstName + ' ' + vm.cardData.lastName });
      bondService.bondRequest(uid, bondService.requestType.ACCEPT).then(function() {
        vm.spliceUserList();
      });
    }

    function declineRequest(uid, event) {
      event.preventDefault();
      bondService.bondRequest(uid, bondService.requestType.REJECT).then(function() {
        vm.spliceUserList();
      });
    }

    function deleteRequest(uid, event) {
      event.preventDefault();
      bondService.deleteRequest(uid).then(function() {
        vm.spliceUserList();
      });
    }

    function listBondTypes(uid) {
      var getBondTypes = new baseService();
      getBondTypes.setPath('peacock','/user/bond-types/');
      getBondTypes.execute().then(function(response) {
        vm.allBondTypes = response;
        var getBondTypesbyUID = new baseService();
        getBondTypesbyUID.setPath('peacock','/user/' + uid + '/bond/');
        getBondTypesbyUID.execute().then(function(response) {
          vm.bondTypesbyUID = response;
          vm.bondTypes = equalsArr(vm.allBondTypes, vm.bondTypesbyUID);

        });
      });
    }

    function addBondType(uid) {
      if(vm.newBondType){
        return new baseService()
          .setPath('peacock','/user/' + uid + '/bond/' + vm.newBondType)
          .setPostMethod()
          .execute().then(function(res) {
            res.isActive = true;
            vm.bondTypes.push(res);
            vm.newBondType = '';
          });
      }
    }

    function addTypetoUser(status, uid, bondTypeId) {
      if (status) {
        return new baseService()
          .setPath('peacock','/user/' + uid + '/bond/' + bondTypeId)
          .setPutMethod()
          .execute();
      } else {
        return new baseService()
          .setPath('peacock','/user/' + uid + '/bond/' + bondTypeId)
          .setDeleteMethod()
          .execute();
      }
    }

    function equalsArr(arr1, arr2) {
      var tmp = [];
      for (var i = 0; i <= arr1.length - 1; i++) {
        for (var j = 0; j <= arr2.length - 1; j++) {
          if (arr1[i].bondTypeId == arr2[j].bondTypeId) {
            arr1[i].isActive = true;
          }
        }
        tmp.push(arr1[i]);
      }
      return tmp;
    }

    //Function Assignment
    vm.approveRequest = approveRequest;
    vm.declineRequest = declineRequest;
    vm.deleteRequest = deleteRequest;
    vm.listBondTypes = listBondTypes;
    vm.addBondType = addBondType;
    vm.addTypetoUser = addTypetoUser;
  }
})();
