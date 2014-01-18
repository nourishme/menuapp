
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', {
    controller: 'start',
    templateUrl: 'views/start.html'
  })
  .when('/recipe', {
    controller: 'recipe',
    templateUrl: 'views/recipe.html'
  })
  .when('/login', {
    controller: 'login',
    templateUrl: 'views/login.html'
  })
  .when('/searchResults', {
    controller: 'searchResults',
    templateUrl: 'views/searchResults.html'
  })
  .when('/ingredients',{
    controller: 'ingredients',
    templateUrl: 'views/ingredients.html'
  })
  .when('/example', {
    controller: 'example',
    templateUrl: 'views/example.html'
  })
  .when('/404', {
    templateUrl: 'views/404.html'
  })
  .otherwise({redirectTo: '/404'});
}]);