exports.neo4j = require('neo4j');
// var ing = require('./datainit/ingredientlist.js');

exports.db = db = new exports.neo4j.GraphDatabase('http://localhost:7474');

// exports.goodbyeNode = exports.db.createNode({goodbye: "other world"});     // instantaneous, but...

var savecb = function (err, node) {    // ...this is what actually persists.
  if (err) {
    console.err('Error saving new node to database:', err);
  } else {
    console.log('Node saved to database with id:', node.id);
  }
};

// exports.goodbyeNode.save(savecb); // we save the 

var ingredientCache = function(bga) {
  for (var i = 0; i < bga.length; i++) {
    bga[i].node_type = 'ingredient';
    var node = db.createNode(bga[i]);
    node.save(savecb);
  }
};

// ingredientCache(/*ing.ingredient.all*/); // uncomment this function and the argument to import base ingredients.

