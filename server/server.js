/**
 * Module dependencies.
 */

var neo4jDB = require('./neo4jDB'),
express = require("express"),
path = require("path");

var yummly = require('./middleware/callyummly.js');

var application_root = __dirname;

/**
 * Start the app.
 */

var app = express();

app.set('title', 'menuapp');

var application_root = __dirname;
var app = express();



/**
 * Routes
 */

app.get('/', function(req, res){
  res.send(neo4jDB.goodbyeNode.data);
});

app.get('/apitest', function(req, res) {
  // var result = 
  yummly.searchRecipe('kale', function(result){ res.send(result)} );
  // res.send(result);

})

//Start the app by listening on <port>
var port = 3000;
app.listen(port);
console.log('Express app started on port ' + port);

// //Initializing logger
// logger.init(app, passport, mongoose);

// //expose app
module.exports = app;