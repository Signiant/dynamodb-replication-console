angular.module('replicationConsole').controller('MetricTableController', ['$scope', '$attrs', '$controller', function($scope, $attrs, $controller){
  //Initialize scope
  $scope.interval = $attrs.interval || 90000;

  //This controller extends TableController
  angular.extend(this, $controller('TableController', {$scope: $scope, $attrs: $attrs}));

  //Return an object from an array of tableData (tableName: metric)
  $scope.tableDataToMap = function(tableData){
    if(!tableData)
      tableData = [];

    return tableData.reduce(function(map, item){
      map[item.tableName] = item.metric;
      return map;
    }, {});
  };

  //When tableData is refreshed(in child scope), replace metricTableData after fetching metrics
  $scope.$watch('tableData', function(newItem, oldItem){

    //If empty, skip
    if(!newItem && !oldItem)
      return;

    //Retrieve current table data mapped to an object as tableName:metric
    var oldMetrics = $scope.tableDataToMap(oldItem);

    //Initialize new table list before populating model
    newItem.forEach(function(table){

      //If table had metric data in previous list, set metric data in new list
      if(oldMetrics.hasOwnProperty(table.tableName)){
        table.metric = oldMetrics[table.tableName];
      }

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
