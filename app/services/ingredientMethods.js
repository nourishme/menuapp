app.factory('ingredientMethods', function ($http,$location,sharedProperties) {


  return {

    getTopIngredients : function($scope){
      $http({
        method: 'GET',
        url: '/topIngredients/1000'
      })
      .success(function(data, status) {
        $scope.ingredients = data.data;
      })
      .error(function(data, status){
        console.log(data,status);
      });
    },

    getSuggestedIngredients: function($scope){
      var currentList = [];
      var temp = sharedProperties.getToCook();
      for (var key in temp){
        currentList.push(temp[key]['_id']);
      }
      // console.log(currentList);
      if (currentList.length > 0){
        $http({
          method: 'POST',
          url: '/suggestedIngredients/',
          data: currentList
        })
        .success(function(data, status) {

          console.log("unflitered list ", data);
          console.log("filtered list ", data.filter(function(ingredient){
            return currentList.indexOf(ingredient._id) === -1;
          }));
          // $scope.suggestedIngredients = data;
          $scope.suggestedIngredients = data.filter(function(ingredient){
            return currentList.indexOf(ingredient._id) === -1;
          });
        })
        .error(function(data, status){
          console.log(data,status);
        });
      }
    },

    addToCook: function($scope,ingredient){
      if(!($scope.toCook[ingredient.ingredientName])){
        $scope.toCook[ingredient.ingredientName] = ingredient;
        $scope.showCook = true;
        sharedProperties.setToCook($scope.toCook);
      }
      $scope.getSuggestedIngredients($scope);
      $scope.getSearchResults();
    },

    removeFromToCook : function($scope,ingredient){
      if($scope.toCook[ingredient.ingredientName]){
        delete($scope.toCook[ingredient.ingredientName]);
        sharedProperties.setToCook($scope.toCook);
        $scope.showCook = (Object.keys($scope.toCook).length > 0);
      }
      if ($scope.showCook > 0) {
        $scope.getSuggestedIngredients($scope);
      } else {
        $location.path("/landing");
      }
      $scope.getSearchResults();
    },
  };


});