(function() {
  'use strict';

  angular
    .module('lollibond.core')
    .factory('loaderService', loaderService);

  /** @ngInject */
  function loaderService() {
    // create an object to store spinner APIs.
    var spinners = {};

    var service = {
      _register: _register,
      _unregister: _unregister,
      _unregisterGroup: _unregisterGroup,
      _unregisterAll: _unregisterAll,
      show: show,
      hide: hide,
      showGroup: showGroup,
      hideGroup: hideGroup,
      showAll: showAll,
      hideAll: hideAll
    };
    return service;

    ////////////////////////////
    function _register(data) {
      if (!data.hasOwnProperty('name')) {
        throw new Error("Spinner must specify a name when registering with the spinner service.");
      }
      if (spinners.hasOwnProperty(data.name)) {
        throw new Error("A spinner with the name '" + data.name + "' has already been registered.");
      }
      spinners[data.name] = data;
    }

    // unused private method for unregistering a directive,
    // for convenience just in case.
    function _unregister(name) {
      if (spinners.hasOwnProperty(name)) {
        delete spinners[name];
      }
    }

    function _unregisterGroup(group) {
      for (var name in spinners) {
        if (spinners[name].group === group) {
          delete spinners[name];
        }
      }
    }

    function _unregisterAll() {
      for (var name in spinners) {
        delete spinners[name];
      }
    }

    function show(name) {
      var spinner = spinners[name];
      if (!spinner) {
        throw new Error("No spinner named '" + name + "' is registered.");
      }
      spinner.show();
    }

    function hide(name) {
      var spinner = spinners[name];
      if (!spinner) {
        throw new Error("No spinner named '" + name + "' is registered.");
      }
      spinner.hide();
    }

    function showGroup(group) {
      var groupExists = false;
      for (var name in spinners) {
        var spinner = spinners[name];
        if (spinner.group === group) {
          spinner.show();
          groupExists = true;
        }
      }
      if (!groupExists) {
        throw new Error("No spinners found with group '" + group + "'.")
      }
    }

    function hideGroup(group) {
      var groupExists = false;
      for (var name in spinners) {
        var spinner = spinners[name];
        if (spinner.group === group) {
          spinner.hide();
          groupExists = true;
        }
      }
      if (!groupExists) {
        throw new Error("No spinners found with group '" + group + "'.")
      }
    }

    function showAll() {
      for (var name in spinners) {
        spinners[name].show();
      }
    }

    function hideAll() {
      for (var name in spinners) {
        spinners[name].hide();
      }
    }
  }
})();
