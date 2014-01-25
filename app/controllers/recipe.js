
app.controller('recipe', function($http,$location,$scope) {
  
  //TODO: check if recipe is saved on page load
  $scope.bookmarked = false;

  $scope.addBookmark = function(){
    $scope.bookmarked = true;

  };

  $scope.removeBookmark = function(){
    $scope.bookmarked = false;

  };

// call needs to be a get request like this:
// http://localhost:3000/getRecipe/Salted-dark-chocolate-popcorn-314529

// Will return JSON like this:
// { "columns": [ "n" ], "data": [ { "id": "Salted-dark-chocolate-popcorn-314529", "recipeName": "Salted Dark Chocolate Popcorn", "totalTimeInSeconds": 4800, "sourceDisplayName": "The Kitchn", "rating": 5, "_id": 422923 }, { "id": "Salted-dark-chocolate-popcorn-314529", "recipeName": "Salted Dark Chocolate Popcorn", "totalTimeInSeconds": 4800, "sourceDisplayName": "The Kitchn", "rating": 5, "_id": 422922 }, { "id": "Salted-dark-chocolate-popcorn-314529", "recipeName": "Salted Dark Chocolate Popcorn", "totalTimeInSeconds": 4800, "sourceDisplayName": "The Kitchn", "rating": 5, "_id": 428400 } ] }
  var example ={ "columns": [ "n" ], "data": [ { "id": "Salted-dark-chocolate-popcorn-314529", "recipeName": "Salted Dark Chocolate Popcorn", "totalTimeInSeconds": 4800, "sourceDisplayName": "The Kitchn", "rating": 5, "_id": 422923 }, { "id": "Salted-dark-chocolate-popcorn-314529", "recipeName": "Salted Dark Chocolate Popcorn", "totalTimeInSeconds": 4800, "sourceDisplayName": "The Kitchn", "rating": 5, "_id": 422922 }, { "id": "Salted-dark-chocolate-popcorn-314529", "recipeName": "Salted Dark Chocolate Popcorn", "totalTimeInSeconds": 4800, "sourceDisplayName": "The Kitchn", "rating": 5, "_id": 428400 } ] };
  
  var id = $location.path().split('/')[2];
  var searchUrl = '/getRecipe/' +id;
  $http({
    method: 'GET',
    url: searchUrl
  })
  .success(function(data, status) {
    // console.log(data);
    // $scope.recipe = data.data[0];
    $scope.recipe = example.data[0];
  })
  .error(function(data, status){
    console.log("Error ",data,status);
    // $scope.recipe = data;
  });


});
