
app.controller('ingredients', function($http,$location,$scope) {
    $http({
      method: 'GET',
      url: 'ingredientInventory/'+ $location.path().split('/')[2]
  })
  .success(function(data, status) {
    console.log(data);
    $scope.possibleIngredients = data;
  })
  .error(function(data, status){
    console.log(data,status);
  });
});