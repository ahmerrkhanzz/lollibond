(function() {
  'use strict';

  angular
    .module('lollibond.formly', [])
    .config(config);

  /** @ngInject */
  function config(formlyConfigProvider) {
    var ngModelAttrs = {};

    var attributes = [
      'date-disabled',
      'custom-class',
      'show-weeks',
      'starting-day',
      'init-date',
      'min-mode',
      'max-mode',
      'format-day',
      'format-month',
      'format-year',
      'format-day-header',
      'format-day-title',
      'format-month-title',
      'year-range',
      'shortcut-propagation',
      'datepicker-popup',
      'show-button-bar',
      'current-text',
      'clear-text',
      'close-text',
      'close-on-date-selection',
      'datepicker-append-to-body'
    ];

    var bindings = [
      'datepicker-mode',
      'min-date',
      'max-date'
    ];

    angular.forEach(attributes, function(attr) {
      ngModelAttrs[camelize(attr)] = { attribute: attr };
    });

    angular.forEach(bindings, function(binding) {
      ngModelAttrs[camelize(binding)] = { bound: binding };
    });

    formlyConfigProvider.extras.removeChromeAutoComplete = true;

    formlyConfigProvider.setWrapper({
      name: 'validation',
      types: ['input', 'select'],
      templateUrl: 'app/shared/customformly/error-message.html'
    });

    formlyConfigProvider.setType([{
      name: 'formly',
      templateUrl: 'app/shared/customformly/formly.html',
      controller: repeatingSection
    }, {
      name: 'tag',
      templateUrl: 'app/shared/customformly/ngtaginput.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError']
    }, {
      name: 'typeahead',
      template: '<input type="text" ng-model="model[options.key]" uib-typeahead="item for item in to.options | filter:$viewValue | limitTo:8" class="form-control"><div ng-messages="fc.$error" ng-if="form.$submitted || options.formControl.$touched" class="error-messages"><div ng-message="{{ ::name }}" ng-repeat="(name, message) in ::options.validation.messages" class="message">{{ message(fc.$viewValue, fc.$modelValue, this)}}</div></div>',
      wrapper: ['bootstrapLabel', 'bootstrapHasError']
    },{
      name: 'datepickerformly',
      templateUrl: 'app/shared/customformly/datepicker.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      defaultOptions: {
        ngModelAttrs: ngModelAttrs,
        templateOptions: {
          datepickerOptions: {
            format: 'MM.dd.yyyy'
          }
        }
      },
      controller: ['$scope', function($scope) {
        $scope.datepicker = {};

        $scope.datepicker.opened = false;

        $scope.datepicker.open = function() {
          $scope.datepicker.opened = !$scope.datepicker.opened;
        };
      }]
    }, {
      name: 'slider',
      template: ['<rzslider rz-slider-model="model[options.key]"' +
        ' rz-slider-options="to.sliderOptions"></rzslider>'
      ].join(' '),
      wrapper: ['bootstrapLabel', 'bootstrapHasError']
    }, {
      name: 'multiInput',
      templateUrl: 'app/shared/customformly/multiInput.html',
      controller: repeatingSection
    },{
      name: 'ui-select',
      templateUrl: 'app/shared/customformly/ui-select.html'
    }, {
      name: 'upload',
      extends: 'input',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      link: function(scope, el) {
        el.on("change", function(changeEvent) {
          var file = changeEvent.target.files[0];
          if (file) {
            var fd = new FormData();
            // use key on backEnd
            fd.append('uploadFile', file);
            scope.$emit('fileToUpload', fd);
            var fileProp = {};
            for (var properties in file) {
              if (!angular.isFunction(file[properties])) {
                fileProp[properties] = file[properties];
              }
            }
            scope.fc.$setViewValue(fileProp);
          } else {
            scope.fc.$setViewValue(undefined);
          }
        });
        el.on("focusout", function() {
          // dont run validation , user still opening pop up file dialog
          // if ($window.document.element.id === scope.id) {
          //   // so we set it untouched
          //   scope.$apply(function(scope) {
          //     scope.fc.$setUntouched();  
          //   });
          // } else {
          //   // element losing focus so we trigger validation
          //   scope.fc.$validate();
          // }
          scope.fc.$validate();
        });
        
      },
      defaultOptions: {
        templateOptions: {
          type: 'file',
          required: true
        }
      }
    }, {
        name: 'checked',
        defaultOptions: {
          ngModelAttrs: {
            'sweet': {
              value: 'data-sweet'
            }
          }
        }
      }]);

    function camelize(string) {
      string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
      // Ensure 1st char is always lowercase
      return string.replace(/^([A-Z])/, function(match, chr) {
        return chr ? chr.toLowerCase() : '';
      });
    }

    function repeatingSection($scope, AddSection) {
      $scope.formOptions = { formState: $scope.formState };
      $scope.addNew = addNew;

      $scope.copyFields = AddSection.copyFields;

      function addNew() {
        $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
        var repeatsection = $scope.model[$scope.options.key];
        var lastSection = repeatsection[repeatsection.length - 1];
        lastSection = angular.copy($scope.default); // Empty the Object properties' value
        var newsection = {};
        if (lastSection) {
          newsection = angular.copy(lastSection);
        }
        repeatsection.push(newsection);
      }
    }
  }
})();
