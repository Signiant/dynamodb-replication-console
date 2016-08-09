angular.module('replicationConsole').controller('MainController', [ '$scope', '$route', function($scope, $route) {

  //Initialize Scope
  $scope.toggle=true;
  $scope.skin = "purple";

  $scope.randomSkin = function(){
    var colors = [ "blue", "red", "green", "purple" ];
    var keys = Object.keys(colors);
    $scope.skin = colors[keys[ keys.length * Math.random() << 0]];
  }
  //Set app skin
  $scope.setSkin = function(color){
    $scope.skin = color;
  };

  //Set sub-page variable on route change
  $scope.$on('$routeChangeStart', function(event, next, current){
    $scope.page = next.$$route.page;
  });
}]);
