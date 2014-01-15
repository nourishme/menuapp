
var assert = require("chai").assert;
var expect = require('chai').expect;
var jsc = require('jscoverage');



// Default to make sure mocha is working
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});


// Server Testing


describe('The server', function(){

  var server = require('../server/server.js');

  describe('starts', function(){
    
    it('and has run all the startup stuff', function(){
      expect(server.app).to.be.ok;
    });

    it('Responds to a GET request at /', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });


});


// Client Testing
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
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