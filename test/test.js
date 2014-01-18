
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
  it('should pull in the neo4j data', function(){
    http.get('http://localhost:8000', function(res){

    });
  });

  // API [TODO: this testing should be fixed up to reflect different API behavior (jfl) ]

  it('should return code 200 on accurate apiget ', function (done) {
    var accurate = '/Sauteed-kale-with-garlic-and-onion-_melting-tuscan-kale_-309499';
    http.get('http://localhost:8000/apiget'+accurate, function (res) {
      assert.equal(200, res.statusCode);
      
    });
  });

  it('should return code 404 on not existing apiget ', function (done) {
    var accurate = '/Sauteed-kale-with-garlic-and-';
    http.get('http://localhost:8000/apiget'+accurate, function (res) {
      assert.equal(404, res.statusCode);
      
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