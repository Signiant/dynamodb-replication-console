angular.module('replicationConsole').directive('doubleBounce', function() {
  return {
    restrict: 'AE',
    scope: {
      loading: '='
    },
    template: '<div class="loading-outer" ng-show="loading"><div class="loading-inner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>'
  }
});