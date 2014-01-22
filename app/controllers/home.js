
app.controller('home', function($http,$location,$scope,sharedProperties) {
  $http({
    method: 'GET',
    url: 'ingredientInventory/'+ $location.path().split('/')[2]
  })
  .success(function(data, status) {
    // console.log(data);
    // $scope.possibleIngredients = data;
    $scope.ingredients = [
    {name:'carrots' , liked:true},
    {name:'bacon' , liked:true},
    {name:'beets' , liked:false},
    {name:'onions' , liked:false}
    ];
  })
  .error(function(data, status){
    console.log(data,status);
  });

  $scope.toCook = sharedProperties.getToCook();

  $scope.addToCook =function(ingredient){
    if(!($scope.toCook[ingredient.name])){
      $scope.toCook[ingredient.name] = ingredient;
      sharedProperties.setToCook($scope.toCook);
    }
  };

  $scope.removeFromToCook =function(ingredient){
    if($scope.toCook[ingredient.name]){
      delete($scope.toCook[ingredient.name]);
      sharedProperties.setToCook($scope.toCook);
    }
  };

});