
app.controller('landing', function($http,$location,$scope,sharedProperties) {

  $http({
    method: 'GET',
    url: '/getTopIngredients/300'
  })
  .success(function(data, status) {
    // console.log(data.data);
    // $scope.ingredients =[
    // {name:'carrots'},
    // {name:'bacon'},
    // {name:'beets'},
    // {name:'onions'}
    // ];
    $scope.ingredients = data.data;
  })
  .error(function(data, status){
    console.log(data,status);
  });


  $scope.toCook = sharedProperties.getToCook();
  $scope.showCook = (Object.keys($scope.toCook).length > 0);
  $scope.suggestedIngredients =[];

  $scope.addToCook =function(ingredient){
    if(!($scope.toCook[ingredient.description])){
      $scope.toCook[ingredient.description] = ingredient;
      $scope.showCook = (Object.keys($scope.toCook).length > 0);
      sharedProperties.setToCook($scope.toCook);
    }
    $scope.getSuggestedIngredients();
  };

  $scope.removeFromToCook =function(ingredient){
    if($scope.toCook[ingredient.description]){
      delete($scope.toCook[ingredient.description]);
      sharedProperties.setToCook($scope.toCook);
      $scope.showCook = (Object.keys($scope.toCook).length > 0);
    }
    $scope.getSuggestedIngredients();
  };

  $scope.getSuggestedIngredients = function(){

    $http({
    method: 'GET',
    url: '/getTopIngredients/300'
  })
  .success(function(data, status) {
    // console.log(data.data);
    // $scope.suggestedIngredients =[
    // {description:'carrots'},
    // {description:'bacon'},
    // {description:'beets'},
    // {description:'onions'}
    // ];
    // $scope.ingredients = data.data;
    $scope.suggestedIngredients = data.data;
  })
  .error(function(data, status){
    console.log(data,status);
  });


  };

});