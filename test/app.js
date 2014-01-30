

describe('app', function() {

  beforeEach(function(){
    angular.mock.module('app');
  });

  describe(' landing controller',function(){

    beforeEach(angular.mock.inject(function($rootScope, $controller){
      scope = $rootScope.$new();                //create an empty scope
      $controller('landing', {$scope: scope});  //declare the controller and inject our empty scope
    }));

    it('- when landing loads, toCook should be empty', inject(function() {
      expect(Object.keys(scope.toCook).length).toEqual(0);
    }));

    it('after calling addToCook on an ingredient, toCook should have 1 key', inject(function() {
      expect(Object.keys(scope.toCook).length).toEqual(0);
      var ingredient = "1";
      scope.addToCook(ingredient);
      expect(Object.keys(scope.toCook).length).toEqual(1);
    }));

  });


  it('should have a sharedProperties service', inject(function(sharedProperties) {

  }));

});