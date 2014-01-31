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
      url: '/getTopIngredients/10'
    })
    .success(function(data, status) {
      // console.log(data);
      $scope.favoriteIngredients = data.data;
    })
    .error(function(data, status){
      console.log(data,status);
    });
  };


  $scope.getAvoidIngredients = function(){
    $http({
      method: 'GET',
      // url: '/avoidIngredients/'
      url: '/getTopIngredients/10'
    })
    .success(function(data, status) {
      $scope.avoidIngredients = data.data;
      // return data;
    })
    .error(function(data, status){
      console.log(data,status);
    });
  };


  $scope.getFavoriteIngredients();
  $scope.getAvoidIngredients();
  // $scope.searchHistory = $scope.getSearchHistory();
});
