app.service('ingredientMethods', function ($http) {

  return {

    getTopIngredients : function($scope){
      $http({
        method: 'GET',
        url: '/getTopIngredients/500'
      })
      .success(function(data, status) {
        $scope.ingredients = data.data;
      })
      .error(function(data, status){
        console.log(data,status);
      });
    },

    getSuggestedIngredients: function($scope){
      $http({
        method: 'GET',
        url: '/ingredientList/'
      })
      .success(function(data, status) {
        console.log($scope);
        $scope.suggestedIngredients = data.data;
      })
      .error(function(data, status){
        console.log(data,status);
      });
    }
  };


});