
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', {
    redirectTo: '/login'
  })
  .when('/recipe/:id', {
    controller: 'recipe',
    templateUrl: 'views/recipe.html'
  })
  .when('/login', {
    controller: 'login',
    templateUrl: 'views/login.html'
  })
  .when('/landing', {
    controller: 'landing',
    templateUrl: 'views/landing.html'
  })
  .when('/searchResults', {
    controller: 'searchResults',
    templateUrl: 'views/searchResults.html'
  })
  .when('/searchHistory', {
    controller: 'searchHistory',
    templateUrl: 'views/searchHistory.html'
  })
  .when('/ingredients/:userId',{
    controller: 'ingredients',
    templateUrl: 'views/ingredients.html'
  })
  .when('/404', {
    templateUrl: 'views/404.html'
  });
  // .otherwise({redirectTo: '/404'});
}]);