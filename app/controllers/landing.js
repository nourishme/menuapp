
app.controller('landing', function($http,$location,$rootScope,$scope,sharedProperties) {

  $http({
    method: 'GET',
    url: '/getTopIngredients/'
  })
  .success(function(data, status) {
    $scope.ingredients =[
    {name:'carrots'},
    {name:'bacon'},
    {name:'beets'},
    {name:'onions'}
    ];
  })
  .error(function(data, status){
    console.log(data,status);
  });


  $scope.toCook = sharedProperties.getToCook();
  $scope.showCook = (Object.keys($scope.toCook).length > 0);
  $scope.suggestedIngredients =[];

  $scope.addToCook =function(ingredient){
    if(!($scope.toCook[ingredient.name])){
      $scope.toCook[ingredient.name] = ingredient;
      $scope.showCook = (Object.keys($scope.toCook).length > 0);
      sharedProperties.setToCook($scope.toCook);
    }
    $rootScope.toCook = $scope.toCook;
    $scope.getSuggestedIngredients();
  };

  $scope.removeFromToCook =function(ingredient){
    if($scope.toCook[ingredient.name]){
      delete($scope.toCook[ingredient.name]);
      sharedProperties.setToCook($scope.toCook);
      $scope.showCook = (Object.keys($scope.toCook).length > 0);
    }
    $scope.getSuggestedIngredients();
  };

  $scope.getSuggestedIngredients = function(){
    
    $scope.suggestedIngredients =[
    {name:'carrots'},
    {name:'bacon'},
    {name:'beets'},
    {name:'onions'}
    ];

  };

});