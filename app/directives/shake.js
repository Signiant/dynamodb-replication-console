angular.module('replicationConsole').directive('shakeIt', [ '$animate', function ($animate ) {
  return {
    restrict: 'A',
    link: function(scope, element){
      scope.$on('SHAKE', function () {
        $animate.addClass(element, 'shake').then(function() {
          $animate.removeClass(element, 'shake');
        })
      });
    }
  }
}]);