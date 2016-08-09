angular.module('replicationConsole').controller('TableController', ['$scope', '$attrs', '$interval', '$uibModal', 'ApiService', function ($scope, $attrs, $interval, $uibModal, ApiService) {

  //Display error if no path is set
  if(! $attrs.path){
    $scope.errorMessage = "No path set for table resource";
    $scope.tableLoadingFailed = true;
    $scope.tableLoading = false;
    console.error($scope.errorMessage);
    return;
  }

  var stateLabels = {
    PENDING: "label-warning",
    COMPLETE: "label-info",
    ACTIVE: "label-success",
    FAILED: "label-danger"
  };

  //Initialize scope
  $scope.interval = $scope.interval || $attrs.interval || 2000;
  $scope.tableLoading = true;
  $scope.sortKey = "tableName";
  $scope.reverse = false;
  $scope.path = $attrs.path;
  $scope.refresh = $attrs.refresh;

  //Sort table items
  $scope.sort = function(keyName){
    $scope.sortKey = keyName;
    $scope.reverse = !$scope.reverse;
  };

  //Set css class on label based on content
  $scope.getStateLabel = function(state){
    return stateLabels[state] || "label-default";
  };

  //Trigger add modal
  $scope.triggerAdd = function() {
    var modal = $uibModal.open({
      templateUrl: 'views/components/add-modal.html',
      controller: 'ModalController',
      backdrop: 'static',
      resolve:{
        params: function(){
          return { table: $scope.path };
        }
      }
    });

    modal.result.then(function(){
      $scope.getTableData();
    });
  };

  //Trigger delete modal
  $scope.triggerDelete = function(key){
    var modal = $uibModal.open({
      templateUrl: 'views/components/delete-modal.html',
      controller: 'ModalController',
      backdrop: 'static',
      resolve: {
        params: function(){
          return {
            table: $scope.path,
            key: key
          };
        }
      }
    });

    modal.result.then(function(){
      $scope.getTableData();
    });
  };

  //Load data from api
  $scope.getTableData = function() {
    ApiService.tables.list({table: $scope.path}, successCallback, errorCallback);
  };

  //Callback function for successful api call
  function successCallback (response, test) {
    if (response.errorMessage) {
      if ($scope.tableLoading === false)
        return console.warn("Unable to refresh table data for table", $scope.path);

      console.error("Error:", response.errorMessage);
      $scope.errorMessage = response.errorMessage;
      $scope.tableLoadingFailed = true;
      $scope.tableLoading = false;
    } else {
      var responseData = angular.fromJson(angular.toJson(response));
      $scope.tableData = responseData.items;
      $scope.tableCount = $scope.tableData.length;
      $scope.tableLoading = false;
    }
  }
  //Callback function for failed api call
  function errorCallback(response) {
    console.info("Failed response:", JSON.stringify(response));
    if($scope.tableLoading === false)
      return console.warn("Unable to refresh table data");

    $scope.errorMessage = "Unable to load table data from api.\nPlease ensure that your api key and endpoint are configured correctly.";
    $scope.tableLoadingFailed = true;
    $scope.tableLoading = false;
    console.error("Error loading data for table", $scope.path);

  }

  if($scope.refresh !== "false") {
    //Refresh table data
    var refresh = $interval(function () {
      $scope.getTableData();
    }, $scope.interval);
    $scope.$on('$destroy', function () {
      $interval.cancel(refresh);
    });
  }

  //Initial data load
  $scope.getTableData();

}]);
