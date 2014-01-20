exports.neo4j = neo4j = require('node-neo4j');
// var ing = require('./datainit/ingredientlist.js').ingredient; 
  
// console.log(Object.keys(ing))
exports.db = db = new neo4j('http://localhost:7474');

var savecb = function (err, node) { 
  if (err) {
    console.log('Error saving new node to database:', err);
  } else {
    console.log('Node saved to database with id:', node.data[0]._id);
  }
};

// CREATE (n:Person { name : 'Andres', title : 'Developer' })
var dbInsert = function(objArray, dbLabelString) {
  
  for (var i = 0; i < objArray.length; i++) {
    var innerQ = '';
    for(var key in objArray[i] ) {
      innerQ += key + ":'" + objArray[i][key] + "'," ;
      console.log(innerQ);
      
    }
    var query = "create (n:"+ dbLabelString +" { "+ innerQ.slice(0,innerQ.length-1) + " }) RETURN n";
    console.log(query);
    db.cypherQuery(query, savecb);
  }
};


// uncomment this function and Line2 to import base ingredients.
// dbInsert(/*testing, "Ingredient"*/);
