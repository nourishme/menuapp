
app.controller('searchResults', function($http,$location,$scope,ingredientMethods,sharedProperties) {

  $scope.getSearchResults = function(){
    var ingredients = [];
    for (var key in $scope.toCook){
      ingredients.push($scope.toCook[key][id]); // Figure out if ID is right
    }
    // TODO: This breaks if you click refresh on the browswer 
    // because $scope.toCook is blank and a query with no ingredients throws an error on the server
    // below is a hack to fix it
    if(ingredients.length<1){
      ingredients.push({description:"butter"});
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

  $scope.addAndSearch = function(ingredient){

  }

  $scope.toCook = sharedProperties.getToCook();
  ingredientMethods.getSuggestedIngredients($scope);
  $scope.getSearchResults();


});