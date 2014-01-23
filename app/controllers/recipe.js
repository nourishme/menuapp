
app.controller('recipe', function($http,$location,$scope) {
  $http({
        method: 'GET',
        url: 'recipe/47'
    })
    .success(function(data, status) {
      console.log(data);
      $scope.recipe = data;
    })
    .error(function(data, status){
      console.log(data,status);
      $scope.recipe = data;
    });
});
