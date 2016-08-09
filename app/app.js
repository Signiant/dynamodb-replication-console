angular.module('replicationConsole', [ 'ngRoute', 'ngResource', 'ngAnimate', 'angularUtils.directives.dirPagination', 'ui.bootstrap' ])

  // Configure routes
  .config(function($routeProvider){
    $routeProvider
      .when('/', {
        page: 'Manage',
        templateUrl: 'views/partials/manage.html'
      })
      .otherwise({redirectTo: '/'});
  })

  // Set path for custom pagination template
  .config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('views/components/pagination-controls.html');
  })

  // Set api key in header of all http requests
  .config( function($httpProvider, apiConfig){
  $httpProvider.defaults.headers.common["X-Api-Key"] = apiConfig.key;
  })

  .factory('ApiService', function ($resource, apiConfig){
    //Build table api
    var tablesUrl = apiConfig.url + '/:table/:key';
    var tablesMethods = {
      list: {
        method: 'GET'
      },
      add: {
        method: 'POST'
      },
      delete: {
        method: 'DELETE'
      }
    };

    // Build metric api
    var metricsUrl = apiConfig.url + '/metrics/:namespace/:metric';
    var metricsMethods = {
      get: {
        method: 'GET'
      }
    };

    // Return API service
    return {
      tables: $resource(tablesUrl, {}, tablesMethods, { removeTrailingSlashes: true }),
      metrics: $resource(metricsUrl, {}, metricsMethods, { removeTrailingSlashes: true})
    };
});
