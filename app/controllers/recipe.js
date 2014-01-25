
app.controller('recipe', function($http,$location,$scope) {
  var searchUrl = '/getRecipe/' + $location.path().split('/')[2];
  $http({
        method: 'GET',
        url: searchUrl
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
