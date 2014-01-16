/**
 * Module dependencies.
 */
var neo4j = require('neo4j');
var application_root = __dirname,
  express = require("express"),
  path = require("path")

var app = express();
app.set('title', 'menuapp');



var db = new neo4j.GraphDatabase('http://localhost:7474');
var goodbyeNode = db.createNode({goodbye: "other world"});     // instantaneous, but...
goodbyeNode.save(function (err, node) {    // ...this is what actually persists.
  if (err) {
    console.err('Error saving new node to database:', err);
  } else {
    console.log('Node saved to database with id:', goodbyeNode.id);
  }
});


app.get('/', function(req, res){
  res.send(db.data);
});

//Start the app by listening on <port>
var port = 3000;
app.listen(port);
console.log('Express app started on port ' + port);

