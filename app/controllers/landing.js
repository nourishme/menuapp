
app.controller('landing', function($http,$location,$scope,ingredientMethods,sharedProperties) {

  $scope.addToCook = function(ingredient){
    ingredientMethods.addToCook($scope,ingredient);
  };

  $scope.removeFromToCook =function(ingredient){
    ingredientMethods.removeFromToCook($scope,ingredient);
  };

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

  $scope.getSearchResults = function(){};
  $scope.toCook = sharedProperties.getToCook();
  $scope.showCook = (Object.keys($scope.toCook).length > 0);
  $scope.getSuggestedIngredients = function(){ingredientMethods.getSuggestedIngredients($scope);};
  ingredientMethods.getTopIngredients($scope);

});