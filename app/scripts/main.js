
angular.module('app', ['ngTouch'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '../templates/example.html'
  }).when('/404', {
    templateUrl: '../templates/404.html'
  })
  .otherwise({redirectTo: '/404'});
}]);