
app.controller('landing', function($http,$location,$scope,ingredientMethods,sharedProperties) {

  // SHARED METHODS
  $scope.addToCook = function(ingredient){
    ingredientMethods.addToCook($scope,ingredient);
  };

  $scope.addToCookSearch = function(ingredient){
    $scope.ingredientSearch ="";
    ingredientMethods.addToCook($scope,ingredient);
  };

  $scope.removeFromToCook =function(ingredient){
    ingredientMethods.removeFromToCook($scope,ingredient);
  };

  $scope.getSuggestedIngredients = function(){
    ingredientMethods.getSuggestedIngredients($scope);
  };



  // LOCAL METHODS
  $scope.sendIngredientsToDB = function(ingredientArray){
    if(Object.keys($scope.toCook).length === 0){
      console.log('Please Add Ingredients');
    } else {
      for (var key in $scope.toCook){
        ingredients.push($scope.toCook[key]['ingredientName']); // Figure out if ID is right
      }
      ingredients.sort();
      $http({
        method: 'POST',
        url: '/searchForRecipes/',
        data: ingredients
      });
    }
  };

// Work around to make addToCook and remove from Cook work the same way on 
// landing page and search results page.
  $scope.getSearchResults = function(){};



  // RUN WHEN LOADING PAGE
  $scope.toCook = sharedProperties.getToCook();
  $scope.showCook = (Object.keys($scope.toCook).length > 0);
  ingredientMethods.getTopIngredients($scope);

});