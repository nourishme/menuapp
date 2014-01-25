
app.controller('recipe', function($http,$location,$scope) {
  
  //TODO: check if recipe is saved on page load
  $scope.bookmarked = false;

  $scope.addBookmark = function(){
    $scope.bookmarked = true;

  };

  $scope.removeBookmark = function(){
    $scope.bookmarked = false;

  };


  var id = $location.path().split('/')[2];
  var searchUrl = '/getRecipe/' +id;
  $http({
        method: 'GET',
        url: searchUrl
        // ,
        // contentType: 'text',
        // data: id
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
