
app.controller('ingredients',  ['$scope', function($scope) {
  // Set a promise, get the recipe data and return the promise before rendering
  // getRecipe(id);// will render before returning data as written
  // $scope.recipe = recipe;

  // FOR TESTING
  $scope.possibleIngredients = possibleIngredients;

}]);