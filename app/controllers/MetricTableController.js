angular.module('replicationConsole').controller('MetricTableController', ['$scope', '$attrs', '$controller', function($scope, $attrs, $controller){

  //This controller extends TableController
  angular.extend(this, $controller('TableController', {$scope: $scope, $attrs: $attrs}));

  $scope.triggerRefresh = function(){
    $scope.tableLoading = true;
    $scope.getTableData();
  };

  //When tableData is refreshed(in child scope), replace metricTableData after fetching metrics
  $scope.$watch('tableData', function(newItem, oldItem){

    //If empty, skip
    if(!newItem && !oldItem)
      return;

    //Initialize new table list before populating model
    newItem.forEach(function(table){

      //Create a new child scope for the MetricController
      var itemScope = $scope.$new(false);
      itemScope.table = table;
      itemScope.refresh = "false";

      //Initialize a MetricController for this item, binding the item attributes and child scope
      angular.extend(this, $controller('MetricController', {$scope: itemScope, $attrs: $attrs}));

      //When the metric value is set,
      var watchValue = itemScope.$watch('value', function(newItem, oldItem){
        if(itemScope.hasOwnProperty('value')){
          table.metric = newItem;
          //If all metrics are retrieved, show data
          watchValue();
        }
      });
    });

    //Set model data
    $scope.metricTableData = newItem;
  });

}]);
