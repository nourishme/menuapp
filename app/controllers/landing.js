
app.controller('landing', function($http,$location,$scope,ingredientMethods,sharedProperties) {

  $scope.addToCook = function(ingredient){
    ingredientMethods.addToCook($scope,ingredient);
  };

  $scope.removeFromToCook =function(ingredient){
    ingredientMethods.removeFromToCook($scope,ingredient);
  };

  $scope.toCook = sharedProperties.getToCook();
  $scope.showCook = (Object.keys($scope.toCook).length > 0);
  $scope.getSuggestedIngredients = function(){ingredientMethods.getSuggestedIngredients($scope);};
  ingredientMethods.getTopIngredients($scope);

});