

app.controller('landing', function($http,$location,$scope,ingredientMethods,sharedProperties) {

  $scope.addToCook = function(ingredient){
    ingredientMethods.addToCook($scope,ingredient);
  };


  // $scope.removeFromToCook =function(ingredient){
  //   if($scope.toCook[ingredient.ingredientName]){
  //     delete($scope.toCook[ingredient.ingredientName]);
  //     sharedProperties.setToCook($scope.toCook);
  //     $scope.showCook = (Object.keys($scope.toCook).length > 0);
  //   }
  //   ingredientMethods.getSuggestedIngredients($scope);
  // };

  $scope.removeFromToCook =function(ingredient){
    ingredientMethods.removeFromToCook($scope,ingredient);
  };

  $scope.toCook = sharedProperties.getToCook();
  $scope.showCook = (Object.keys($scope.toCook).length > 0);
  $scope.getSuggestedIngredients = ingredientMethods.getSuggestedIngredients;
  ingredientMethods.getTopIngredients($scope);

});