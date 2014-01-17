
angular.module('app', ['ngTouch'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/recipe', {
    controller: 'recipe',
    templateUrl: '../views/recipe.html'
  })
  .when('/example', {
    controller: 'example',
    templateUrl: '../views/example.html'
  })
  .when('/404', {
    templateUrl: '../views/404.html'
  })
  .otherwise({redirectTo: '/404'});
}])

.controller('example', function($scope) {
  
});