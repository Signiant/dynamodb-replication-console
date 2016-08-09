angular.module('replicationConsole').controller('ModalController', [ '$scope', '$uibModalInstance', 'ApiService', 'params', function($scope, $uibModalInstance, ApiService, params){

  //Initialize scope
  $scope.waiting = false;
  $scope.hasError = false;
  $scope.errorMessage = "";
  $scope.item = params.key;
  
  //Set error message, shake form
  $scope.setError = function(errorMessage){
    $scope.errorMessage = errorMessage;
    $scope.hasError = true;
    $scope.$broadcast('SHAKE');
  };

  //Handle add form submission
  $scope.addItem = function(){
    $scope.waiting = true;
    ApiService.tables.add({ table: params.table }, { key: $scope.item  }, successCallback, errorCallback);
  };

  //Handle delete form submission
  $scope.deleteItem = function(){
    $scope.waiting = true;
    ApiService.tables.delete({table: params.table, key: params.key }, successCallback, errorCallback);
  };

  //Handle form cancel
  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };

  function successCallback(response){
    if (response.errorMessage) {
      console.error("Error returned:", response.errorMessage);
      $scope.setError(response.errorMessage);
      $scope.waiting = false;
    } else {
      $uibModalInstance.close();
    }
  }

  function errorCallback(response){
    console.error("Error calling API:", JSON.stringify(response));
    $scope.setError("Error calling API, please ensure that the api endpoint and api key are set and correct");
    $scope.waiting = false;
  }

}]);