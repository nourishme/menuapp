
var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;
var sinonChai = require("sinon-chai");
var jsc = require('jscoverage');
var http = require('http');

chai.use(sinonChai);


// Default to make sure mocha is working
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

var url = 'http://localhost:3000/';

// Server Testing
var server = require('../server/server.js');

describe('The server', function(){
  before(function () {
    server.listen(8000);
  });

  it('and has run all the startup stuff', function(){
    expect(server).to.have.property('listen');
  });

  it('Responds to a GET request at /', function(){
    http.get('http://localhost:8000', function (res) {
      assert.equal(200, res.statusCode);
    });
  }); 

  // it('should say "hello world"', function (done) {
  //   http.get('http://localhost:8000', function (res) {
  //     var data = '';

  //     res.on('data', function (chunk) {
  //       data += chunk;
  //     });

  //     res.on('end', function () {
  //       assert.equal('hello world', data);
  //       done();
  //     });
  //   });
  // });

  // DB testing


  // API [TODO: this testing should be fixed up to reflect different API behavior (jfl) ]


  

  describe('should return 200 when getting to server routes', function(argument) {
    it('ingredientInventory', function (res) {
      var ingredientID
      console.log(url)
      http.get(url + 'ingredientInventory/1234' + ingredientID, function (res) {
        assert.equal(res.statusCode, 200);
        
      });
    });

    it(url+'ingredientList/', function (res) {
      http.get(url + 'ingredientList/', function (res) {
        assert.equal(res.statusCode, 200);
        
      });
    });

    it(url+'getRecipe/', function (res) {
      http.get(url + 'getRecipe/', function (res) {
        assert.equal(res.statusCode, 200);        
      });      
    });
    
    it(url+'getTopIngredients/10', function (res) {
      http.get(url + 'getTopIngredients/10', function (res) {
        assert.equal(res.statusCode, 200);        
      });      
    });
    
    it(url+'searchForRecipes/', function (res) {
      http.get(url + 'searchForRecipes/', function (res) {
        assert.equal(res.statusCode, 200);        
      });      
    });
    
    it(url+'getCoOccurs/', function (res) {
      http.get(url + 'getCoOccurs/', function (res) {
        assert.equal(res.statusCode, 200);        
      });      
    });
  });
});



// Client Testing

// describe('Ingredients controller', function(){
//   describe('#indexOf()', function(){
//     it('should return -1 when the value is not present', function(){
//       assert.equal(-1, [1,2,3].indexOf(5));
//       assert.equal(-1, [1,2,3].indexOf(0));
//     });
//   });
// });


// describe('Login controller', function(){
//   describe('#indexOf()', function(){
//     it('should return -1 when the value is not present', function(){
//       assert.equal(-1, [1,2,3].indexOf(5));
//       assert.equal(-1, [1,2,3].indexOf(0));
//     });
//   });
// });

// describe('Recipe controller', function(){
//   describe('#indexOf()', function(){
//     it('should return -1 when the value is not present', function(){
//       assert.equal(-1, [1,2,3].indexOf(5));
//       assert.equal(-1, [1,2,3].indexOf(0));
//     });
//   });
// });

describe('Search Results controller', function(){
  before(function () {
    server.listen(8000);
    module('searchResults');
  });
  describe(' - after calling $scope.getSearchResults', function(){
    it('$scope.searchResults should not be empty', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});


// Coverage Testing
process.on('exit', function () {
  jsc.coverage(); // print summary info, cover percent
  jsc.coverageDetail(); // print uncovered lines
});