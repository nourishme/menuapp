

describe('app', function() {

  beforeEach(function(){
    angular.mock.module('app');
  });

  describe(' landing controller',function(){

    beforeEach(angular.mock.inject(function($rootScope, $controller){
      scope = $rootScope.$new();                //create an empty scope
      $controller('landing', {$scope: scope});  //declare the controller and inject our empty scope
    }));

    it(' when landing loads, toCook should be empty', inject(function() {
      expect(Object.keys(scope.toCook).length).toEqual(0);
    }));

    it(' after calling addToCook on an ingredient, toCook should have 1 key', inject(function() {
      expect(Object.keys(scope.toCook).length).toEqual(0);
      var ingredient = "1";
      scope.addToCook(ingredient);
      expect(Object.keys(scope.toCook).length).toEqual(1);
    }));

    it(' after calling remoeToCook, toCook should have 1 less ingredient', inject(function() {
      expect(Object.keys(scope.toCook).length).toEqual(0);
      var ingredient = "1";
      scope.addToCook(ingredient);
      expect(Object.keys(scope.toCook).length).toEqual(1);
      scope.removeFromToCook(ingredient);
      expect(Object.keys(scope.toCook).length).toEqual(0);
    }));

    it(' showCook should start as false and then become true if an ingredient is added.', inject(function() {
      expect(scope.showCook).toEqual(false);
      var ingredient = "1";
      scope.addToCook(ingredient);
      expect(scope.showCook).toEqual(true);
      scope.removeFromToCook(ingredient);
      expect(scope.showCook).toEqual(false);
    }));

    it(' calls ingredientMethods.getTopIngredients and populates ingredients', inject(function(ingredientMethods) {
      // expect(scope.ingredients.length).toEqual(1000);
    }));



  });


  it('should have a sharedProperties service', inject(function(sharedProperties) {

  }));

});