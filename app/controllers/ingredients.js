
app.controller('ingredients', function($http,$location,$scope) {
  $http({
    method: 'GET',
    url: 'ingredientInventory/'+ $location.path().split('/')[2]
  })
  .success(function(data, status) {
    // console.log(data);
    // $scope.possibleIngredients = data;
    $scope.ingredients = data;
    console.log(data);
    // $scope.ingredients = 
    // [ { term: 'eggs',
    //    description: 'eggs',
    //    searchValue: 'eggs',
    //    _id: 399832 },
    //  { term: 'hamburger dripping',
    //    description: 'hamburger dripping',
    //    searchValue: 'hamburger dripping',
    //    _id: 406827 },
    //  { term: 'chile negro',
    //    description: 'chile negro',
    //    searchValue: 'chile negro',
    //    _id: 406828 },
    //  { term: 'spring water',
    //    description: 'spring water',
    //    searchValue: 'spring water',
    //    _id: 406840 },
    //  { term: 'shimeji mushrooms',
    //    description: 'shimeji mushrooms',
    //    searchValue: 'shimeji mushrooms',
    //    _id: 406841 } ] }
  })
  .error(function(data, status){
    console.log(data,status);
  });

  $scope.saveIngredients=function(){
    console.log("called saveIngredients");
  $http({
    method: 'POST',
    url: 'ingredientInventory/'+ $location.path().split('/')[2],
    data:$scope.ingredients
  })
  .success(function(data, status) {
    console.log("ingredients sent");
    console.log(data);
  })
  .error(function(data, status){
    console.log(data,status);
  });
  };
  
  $scope.removeFromLike = function(ingredient){
    console.log("called removeFromLike on ", ingredient);
    for (var i = 0; i < $scope.ingredients.length ;i++){
      if( $scope.ingredients[i].name === ingredient){
        $scope.ingredients[i].liked = false;
      }
    }
  };

  $scope.addToLike = function(ingredient){
    for (var i = 0; i < $scope.ingredients.length ;i++){
      if( $scope.ingredients[i].name === ingredient){
        $scope.ingredients[i].liked=true;
      }
    }
  };

});