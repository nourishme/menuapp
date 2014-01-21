
app.controller('home', function($http,$location,$scope) {
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
});