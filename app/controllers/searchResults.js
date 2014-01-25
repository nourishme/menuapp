
app.controller('searchResults', function($http,$location,$scope,ingredientMethods,sharedProperties) {

  $scope.getSearchResults = function(){
    var ingredients = [];
    for (var key in $scope.toCook){
      ingredients.push($scope.toCook[key]['_id']); // Figure out if ID is right
    }
    ingredients.sort();
     //TODO : format to cook into an array in the right format
    $http({
      method: 'POST',
      url: '/searchForRecipes/',
      data: ingredients
    })
    .success(function(data, status) {
      $scope.searchResults = data;
    })
    .error(function(data, status){
      console.log(data,status);
    });
  };

  $scope.getRecipe = function(id){
    $location.path("/recipe/");
  };

  $scope.toCook = sharedProperties.getToCook();
  ingredientMethods.getSuggestedIngredients($scope);
  $scope.getSearchResults();


});