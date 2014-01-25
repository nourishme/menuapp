
app.controller('landing', function($http,$location,$scope,sharedProperties) {

  var getTopIngredients = function(){
    $http({
      method: 'GET',
      url: '/getTopIngredients/300'
    })
    .success(function(data, status) {
      $scope.ingredients = data.data;
    })
    .error(function(data, status){
      console.log(data,status);
    });
  };

  $scope.getSuggestedIngredients = function(){
    $http({
      method: 'GET',
      url: '/getTopIngredients/300'
    })
    .success(function(data, status) {
      return data.data;
    })
    .error(function(data, status){
      console.log(data,status);
    });
  };

  $scope.addToCook =function(ingredient){
    if(!($scope.toCook[ingredient.ingredientName])){
      $scope.toCook[ingredient.ingredientName] = ingredient;
      $scope.showCook = (Object.keys($scope.toCook).length > 0);
      sharedProperties.setToCook($scope.toCook);
    }
    $scope.getSuggestedIngredients();
  };

  $scope.removeFromToCook =function(ingredient){
    if($scope.toCook[ingredient.ingredientName]){
      delete($scope.toCook[ingredient.ingredientName]);
      sharedProperties.setToCook($scope.toCook);
      $scope.showCook = (Object.keys($scope.toCook).length > 0);
    }
    $scope.suggestedIngredients = $scope.getSuggestedIngredients();
  };


  $scope.toCook = sharedProperties.getToCook();
  $scope.showCook = (Object.keys($scope.toCook).length > 0);
  $scope.suggestedIngredients =[];
  getTopIngredients();

});