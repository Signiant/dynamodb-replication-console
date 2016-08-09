angular.module('replicationConsole').directive('stat', function(){
  return {
    restrict: 'E',
    scope: {
      color: '@',
      icon: '@',
      title: '@',
      footer: '@'
    },
    transclude: true,
    template:
      '<div class="stat-wrapper">\
        <span class="stat-icon" ng-class="color"><i class="fa" ng-class="icon"></i></span>\
        <div class="stat-content">\
          <div class="stat-title">{{ title }}</div>\
          <div class="stat-value" ng-transclude></div>\
          <div class="stat-footer">{{ footer }}</div>\
         </div>\
       </div>\
      '
  }
});

