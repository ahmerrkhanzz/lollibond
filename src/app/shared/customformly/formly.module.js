(function() {
  'use strict';

  angular
    .module('lollibond.formly', [])
    .config(config);

  /** @ngInject */
  function config(formlyConfigProvider) {
    var unique = 1;
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


    formlyConfigProvider.setWrapper({
      name: 'validation',
      types: ['input'],
      templateUrl: 'app/shared/customformly/error-message.html'
    });

    formlyConfigProvider.setType([{
      name: 'formly',
      templateUrl: 'app/shared/customformly/formly.html',
      controller: repeatingSection
    }, {
      name: 'tag',
      template: '<tags-input ng-model="model[options.key]" key-property="id" display-property="{{to.displayProperty}}" class="bootstrap-tagsinput"  placeholder="Add"  replace-spaces-with-dashes="false" template="tag-template"  add-from-autocomplete-only="{{!to.allowCustomInput || true}}">' + '<auto-complete source="to.loadList($query)" ng-if="to.loadList" min-length="0" load-on-empty="true" max-results-to-show="32" template="autocomplete-template"></auto-complete>' + '</tags-input>',
      wrapper: ['bootstrapLabel', 'bootstrapHasError']
    }, {
      name: 'typeahead',
      template: '<input type="text" ng-model="model[options.key]" uib-typeahead="item for item in to.options | filter:$viewValue | limitTo:8" class="form-control">',
      wrapper: ['bootstrapLabel', 'bootstrapHasError']
    }, {
      name: 'datepickerformly',
      templateUrl: 'app/shared/customformly/datepicker.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      defaultOptions: {
        ngModelAttrs: ngModelAttrs,
        templateOptions: {
          datepickerOptions: {
            format: 'MM.dd.yyyy',
            initDate: new Date()
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


    function repeatingSection($scope) {
      $scope.formOptions = { formState: $scope.formState };
      $scope.addNew = addNew;

      $scope.copyFields = copyFields;

      function copyFields(fields) {
        fields = angular.copy(fields);
        addRandomIds(fields);
        return fields;
      }

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

      function addRandomIds(fields) {
        unique++;
        angular.forEach(fields, function(field, index) {
          if (field.fieldGroup) {
            addRandomIds(field.fieldGroup);
            return; // fieldGroups don't need an ID
          }

          if (field.templateOptions && field.templateOptions.fields) {
            addRandomIds(field.templateOptions.fields);
          }

          field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
        });
      }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
    }
  }
})();
