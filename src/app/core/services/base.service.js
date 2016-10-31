(function() {
  'use strict';

  angular
    .module('lollibond')
    .service('baseService', baseService);

  /** @ngInject */
  function baseService($http, $q, $log, toaster){

    /**
     * Supported HTTP methods
     */
    var httpMethods = {
        DELETE: 'DELETE',
        GET: 'GET',
        PATCH: 'PATCH',
        POST: 'POST',
        PUT: 'PUT'
    };

    /**
     *  Base API URLs 
     */

    var ApiPath = {
        PEACOCK: 'http://bondinco.dyndns.org:9999',
        CORAL: 'http://bondinco.dyndns.org:9998',
        RAY: 'http://bondinco.dyndns.org:9997',
        PIGEON: 'http://bondinco.dyndns.org:9996'
    }


    /* This is for making direct CORS calls to api server. This object will hold the api server url and auth stuff
     * like csrftoken/sessionid/userid. Eventually we will move to a single token auth mechanism like JWT which can be
     * stored here as well.
     */
    var apiAuthInfo = {};
    var apiHeaderInfo = {};

    /**
     * Mechanism to ignore results of stale api calls.
     * Consider the scenario where 2 back to back calls to an endpoint is made within a few seconds.
     * The call2 is made when call1 is still pending. At this point if call1 returns we can ignore it since call2
     * will have latest result. This is useful when we want to skip UI rendering for stale results.
     *
     * Note: we use a hash to map an url to its call id counter so that for two separate ignorable api calls
     * call1_url1 and call2_url2, we do not reject result of call1_url1 after call2_url2 is made.
     *
     * @type {Object.<string, number>}
     */
    var callIdCounter = {};

    /**
     * @param path
     * @param {boolean=} shallIncrementCounter
     * @return {number}
     */
    function getCallIdForPath(path, shallIncrementCounter) {
        shallIncrementCounter = !!shallIncrementCounter;
        callIdCounter[path] = callIdCounter[path] || 0;
        var callId = callIdCounter[path];
        if (shallIncrementCounter) {
            callId = ++callIdCounter[path];
        }
        return callId;
    }

    /**
     * @constructor
     */
    function baseService() {
        this.path = '';
        this.method = httpMethods.GET; // default
        //this.timeout = envService.apiTimeoutMs;
        this.getParamsJson = {};
        this.postParamsJson = {};
        this.isIgnorable = false;

        /**
         * @type {Object}
         * Possible properties:
         * - donotNavigateToLoginOn4xx: If true, then do not navigate to login page on 4xx responses.
         * - noLoggingOnError: If true, then logger.error() is suppressed in error callback.
         * - doNotShowPermError: if true, then notification is suppressed on auth failures.
         */
        this.options = {};
    }


    /**
     * Static method to set the api auth info for CORS calls, once the user session is obtained. This will be called just once.
     */
    baseService.setApiAuthInfo = function (info) {
        angular.extend(apiAuthInfo, info);
    };

    /**
     * Static method to set the api header info for CORS calls, once the user session is obtained. This will be called just once.
     */
    baseService.setApiHeaderInfo = function (headers) {
        angular.extend(apiHeaderInfo, headers);
    };

    /**
     * @return this for chaining
     */
    baseService.prototype.setHttpMethod = function (httpMethod) {
        this.method = httpMethods[httpMethod] || httpMethods.GET;
        return this;
    };

    /**
     * @return this for chaining
     */
    baseService.prototype.setPostMethod = function () {
        this.method = httpMethods.POST;
        return this;
    };

    /**
     * @return this for chaining
     */
    baseService.prototype.setPatchMethod = function () {
        this.method = httpMethods.PATCH;
        return this;
    };

    /**
     * @return this for chaining
     */
    baseService.prototype.setPutMethod = function () {
        this.method = httpMethods.PUT;
        return this;
    };

    /**
     * @return this for chaining
     */
    baseService.prototype.setDeleteMethod = function () {
        this.method = httpMethods.DELETE;
        return this;
    };

    /**
     * @param {string} path
     * @return this for chaining
     */
    baseService.prototype.setPath = function (basepath, endpoint) {
        var REST_API_URL;

        // Set API Base path
        switch (basepath) {
            case 'peacock':
            REST_API_URL = ApiPath.PEACOCK;
            break;
            case 'coral':
            REST_API_URL = ApiPath.CORAL;
            break;
            case 'ray':
            REST_API_URL = ApiPath.RAY;
            break;
            case 'pigeon':
            REST_API_URL = ApiPath.PIGEON;
            break;
        }

        // if(basepath == 'peacock'){
        //     REST_API_URL = PEACOCK_API_PATH;
        // }else if(basepath == 'coral'){
        //     REST_API_URL = CORAL_API_PATH;
        // }else{
        //     REST_API_URL = PEACOCK_API_PATH;
        // }

        this.path = REST_API_URL + endpoint;
        return this;
    };

    /**
     * @param {Object} headers
     * @return this for chaining
     */
    baseService.prototype.setHeaders = function (headers) {
        angular.extend(this.headers, headers);
        return this;
    };

    /**
     * @param {number} timeout
     * @return this for chaining
     */
    baseService.prototype.setTimeout = function (timeout) {
        this.timeout = timeout;
        return this;
    };

    /**
     * @param {Object} getParamsJson
     * @return this for chaining
     */
    baseService.prototype.setGetParams = function (getParamsJson) {
        if (!$.param(getParamsJson)) { return this; }
        angular.extend(this.getParamsJson, getParamsJson);
        return this;
    };

    /**
     * @param {Object} postParamsJson
     * @return this for chaining
     */
    baseService.prototype.setPostParams = function (postParamsJson) {
        if (!$.param(postParamsJson)) { return this; }
        angular.extend(this.postParamsJson, postParamsJson);
        return this;
    };

    /**
     * See the comment on callIdCounter.
     */
    baseService.prototype.setIgnorable = function () {
        this.isIgnorable = true;
        return this;
    };

    baseService.prototype.setDirectApiServerCall = function () {
        this.isDirectApiServerCall = true;
        return this;
    };

    /**
     * Set an option.
     */
    baseService.prototype.setOption = function (key, val) {
        this.options[key] = val;
        return this;
    };


    /**
     * Returns a promise object
     */
    baseService.prototype.execute = function () {
        var deferred = $q.defer();

        var customContext = {
            callId: getCallIdForPath(this.path, true)
        };

        var baseInstance = this;

        $http({
            method: this.method,
            url: this.path,
            params: this.getParamsJson,
            data: this.postParamsJson,
            timeout: this.timeout,
            customContext: customContext
        })
        .success(function (data, status, config) {
            if (baseInstance.isIgnorable && getCallIdForPath(config.url) > config.customContext.callId) {
                $log.warn('Ignoring response of callId %s to %s (latest callId %s)', config.customContext.callId, config.url, getCallIdForPath(config.url));
                deferred.reject(baseService.rejectReasons.IGNORED);
            } else {
                deferred.resolve(data);
            }
        })
        .error(function (data, status) {
            deferred.reject(data);


            /**
             * Note(joy): consider using response interceptors if that will make a cleaner isolation
             *
             * Send to login page is server responds with any of these status codes:
             * 401 - Unauthorized
             * 403 - Forbidden
             * 407 - Proxy Authentication required
             * 409 - Conflict Duplicate Value
             */
            if (status === 403) {
                // [donotNavigateToLoginOn4xx] also implies to [doNotShowPermError]
                // that is because the callee is expecting failure.
                if (!!baseInstance.options.doNotShowPermError || !!baseInstance.options.donotNavigateToLoginOn4xx) {
                    return;
                }
                //notifyService.notify(notifyService.WARNING, notifyService.MSG_PERMISSION);
                return;
            }
            if(status === 401  || status === 407) {
                if (!baseInstance.options.donotNavigateToLoginOn4xx) {
                    $log.log("navigationService.navigateToLogin();");
                }
            } 
            if(status === 409) {
                toaster.error({ title: "Duplicate Value!", body: "Your data is already available in the system." });
                return;
            } else {
                if (!baseInstance.options.noLoggingOnError) {
                    $log.error('$http error:', data); // no need to send this error to server
                }
            }
        });

        return deferred.promise;
    };

    baseService.rejectReasons = {
        IGNORED: 'ignored'
    };

    // return data for Branch
    baseService.branchData = {
        name: '',
        code: ''
    }

    baseService.httpMethods = httpMethods;

    return baseService;

  }
})();
