/**
 * Module dependencies.
 */

var express = require('express');
var neo4j = require('neo4j');
var yummly = require('./middleware/callyummly.js')
var application_root = __dirname,
  express = require("express"),
  path = require("path")

/**
 * Start the app.
 */

var app = express();

app.set('title', 'menuapp');


var db = new neo4j.GraphDatabase('http://localhost:7474');
//TODO: this code is funny looking
var goodbyeNode = db.createNode({goodbye: "other world"});     // instantaneous, but...
goodbyeNode.save(function (err, node) {    // ...this is what actually persists.
  if (err) {
    console.err('Error saving new node to database:', err);
  } else {
    console.log('Node saved to database with id:', goodbyeNode.id);
  }
});

/**
 * Routes
 */

app.get('/', function(req, res){
  res.send(db.data);
});

app.get('/apitest', function(req, res) {
  res.send('yummly');
})

//Start the app by listening on <port>
var port = 3000;
app.listen(port);
console.log('Express app started on port ' + port);

