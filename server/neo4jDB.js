exports.neo4j = require('neo4j');

exports.db = new exports.neo4j.GraphDatabase('http://localhost:7474');

exports.goodbyeNode = exports.db.createNode({goodbye: "other world"});     // instantaneous, but...

exports.goodbyeNode.save(function (err, goodbyeNode) {    // ...this is what actually persists.
  if (err) {
    console.err('Error saving new node to database:', err);
  } else {
    console.log('Node saved to database with id:', goodbyeNode.id);
  }
});