
app.controller('recipe', function($http,$location,$scope) {
  $http({
        method: 'GET',
        url: 'recipe/'+ $location.path().split('/')[2]
    })
    .success(function(data, status) {
      console.log(data);
      $scope.recipe = data;
    })
    .error(function(data, status){
      console.log(data,status);
    });
});
