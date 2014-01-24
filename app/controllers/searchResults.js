
app.controller('searchResults', function($http,$location,$scope,sharedProperties) {
  
  $scope.searchResults={};
  
  $scope.toCook = sharedProperties.getToCook();

  $scope.getSearchResults = function(){
    searchUrl = 'searchResults/' + 'butter' + Object.keys($scope.toCook).join('+');
    $http({
      method: 'GET',
      url: searchUrl
    })
    .success(function(data, status) {
      // console.log(data);
      $scope.searchResults = data;

    })
      .error(function(data, status){
      // console.log(data,status);
   });
  };


  $scope.getRecipe = function(id){
    $location.path("/recipe/");
  };

  $scope.getSearchResults();



});