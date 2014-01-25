
app.controller('searchResults', function($http,$location,$scope,ingredientMethods,sharedProperties) {

  $scope.getSearchResults = function(){
    searchUrl = 'searchResults/' + 'butter' + Object.keys($scope.toCook).join('+');
    $http({
      method: 'GET',
      url: searchUrl
    })
    .success(function(data, status) {
      $scope.searchResults = data;
    })
    .error(function(data, status){
      console.log(data,status);
    });
  };

  $scope.getRecipe = function(id){
    $location.path("/recipe/");
  };

  $scope.toCook = sharedProperties.getToCook();
  ingredientMethods.getSuggestedIngredients($scope);
  $scope.getSearchResults();


});