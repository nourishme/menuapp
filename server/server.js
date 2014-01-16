/**
 * Module dependencies.
 */
var neo4jDB = require('./neo4jDB'),
express = require("express"),
path = require("path");


var application_root = __dirname;
var app = express();

app.set('title', 'menuapp');


app.get('/', function(req, res){
  res.send(neo4jDB.goodbyeNode.data);
});

//Start the app by listening on <port>
var port = 3000;
app.listen(port);
console.log('Express app started on port ' + port);

