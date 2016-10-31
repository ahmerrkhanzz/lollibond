(function() {
  'use strict';

  angular
      .module('lollibond.core')
      .service('socketService', socketService);

  /** @ngInject */
  function socketService(baseService, $q, $timeout) {
  
    // Get OTP and connect the Socket 
    function getOtpAndConnect(){
      var deferred = $q.defer();
      return  getOTP()
                .then(function(res) {
                    service.reconnecting = true;

                    var otp = res;
                    var socketIns = connectSocket(otp);
                    socketIns.on("connect", function() {
                        service.reconnecting = false;
                    });
                    socketIns.on("connect_error", function() { 
                        socketIns.disconnect();
                        // Reconnect call after 1 minute
                        $timeout(function() {
                          getOtpAndConnect();
                        }, 10000, false);
                    });

                    deferred.resolve(socketIns);
                    return deferred.promise;
                    
                })
    }


    function connectSocket(otpObj) {
      var sock = io.connect(otpObj.serverUrl + '?otp=' + otpObj.otp);
      return sock;
    }

    /*
     * GetOTP from Pigeon
     * Return {obj} ServerURL, OTP
     */
    function getOTP() {
        return new baseService()
            .setPath('pigeon', '/getotp')
            .execute(function(res) {
                return res.data;
            });
    }

    function getSocketInstance(){
      if(service.socket){
        return service.socket;
      }else{
        service.socket = getOtpAndConnect()
        return service.socket;
      }
    }

    // Service available functions
    var service = {
        socket: getOtpAndConnect(),
        reconnecting: false,
        getSocketInstance: getSocketInstance
    }
    return service;

    

  }
})();
