angular.module('replicationConsole').controller('MetricController', [ '$scope', '$interval', '$attrs', 'ApiService', function($scope, $interval, $attrs, ApiService) {

  //Initialize scope
  $scope.metricLoading = true;
  $scope.metric = $attrs.metric;
  $scope.statistic = $attrs.statistic;
  $scope.namespace = $attrs.namespace || "Replication";
  $scope.unit = $attrs.unit || "Count";
  $scope.count = $attrs.count || "14";
  $scope.period = $attrs.period || 86400;
  $scope.interval = $attrs.interval || 2000;

  if($scope.table)
    $scope.table = $scope.table.tableName;
  else
     $scope.table = $attrs.table;

  if(!$scope.refresh)
      $scope.refresh = $attrs.refresh;

  //Calculate and return the sum of all data points
  $scope.getSum = function(){
    return $scope.all.reduce(function(total, next){
      return total+= next[$scope.statistic];
    }, 0);
  };

  //Find and return the maximum value over all data points
  $scope.getMaximum = function(){
    return $scope.all.reduce(function(max, next){
      return next[$scope.statistic] > max ? next[$scope.statistic] : max;
    }.bind(this), 0);
  };

  //Function to grab the metric data
  $scope.getMetric = function(){

    var params = {
      namespace: $scope.namespace,
      metric: $scope.metric,
      statistic: $scope.statistic,
      count: $scope.count,
      unit: $scope.unit,
      period: $scope.period
    };

    if($scope.table){
      params.dimension = $scope.table;
    }

    //Get metric data
    ApiService.metrics.get(params, successCallback, errorCallback);
  };

  //Callback function for successful api calls
  function successCallback(response){
    if(response.errorMessage){
      if($scope.metricLoading === false)
        return console.warn("Unable to refresh data for metric", $scope.metric);

      //If the response contains an error message, the lambda function returned an error
      console.error("Error:", response.errorMessage);
      $scope.errorMessage = response.errorMessage;
      $scope.metricLoadingFailed = true;
    }else{
      //Set metric data on scope
      $scope.all = response['Datapoints'];
      $scope.sum = $scope.getSum();
      $scope.maximum = $scope.getMaximum();
      $scope.value = $scope[$scope.statistic.toLowerCase()];
    }
    $scope.metricLoading = false;
  }

  //Callback function for failed api calls
  function errorCallback(response){
    if($scope.metricLoading === false){
      return console.warn("Unable to refresh data for metric", $scope.metric);
    }

    $scope.errorMessage = "Error calling API, please ensure that the api endpoint and api key are set";
    $scope.metricLoadingFailed = true;
    $scope.metricLoading = false;
    console.error("Error calling API:", JSON.stringify(response));
  }

  //Refresh metric data unless restricted by parent scope
  if($scope.refresh !== "false") {
    var refresh = $interval(function () {
      $scope.getMetric();
    }, $scope.interval);
    $scope.$on('$destroy', function () {
      $interval.cancel(refresh);
    });
  }

  //Initialize metric
  $scope.getMetric();

}]);
