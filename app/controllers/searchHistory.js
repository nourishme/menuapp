app.controller('searchHistory', function($http,$scope) {


  $scope.getSearchHistory = function(){
    $http({
      method: 'GET',
      url: '/searchHistory/'
    })
    .success(function(data, status) {
      return data;
    })
    .error(function(data, status){
      console.log(data,status);
    });
  };

  $scope.getFavoriteIngredients = function(){
    $http({
      method: 'GET',
      url: '/favoriteIngredients/'
    })
    .success(function(data, status) {
      return data;
    })
    .error(function(data, status){
      console.log(data,status);
    });
  };

  $scope.getAvoidIngredients = function(){
    $http({
      method: 'GET',
      url: '/avoidIngredients/'
    })
    .success(function(data, status) {
      return data;
    })
    .error(function(data, status){
      console.log(data,status);
    });
  };


  $scope.searchHistory = $scope.getSearchHistory();
  $scope.favoriteIngredients = $scope.getFavoriteIngredients;
  $scope.avoidIngredients = $scope.getAvoidIngredients;

});
