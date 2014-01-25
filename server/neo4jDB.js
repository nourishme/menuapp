exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');


var savecb = function (err, node) {
  if (err) {
    console.log('Error saving new node to database:', err);
  } else {
    console.log('Node saved to database with id:', node.data[0]._id);
  }
};

exports.dbinsert = dbinsert = function(objArray, dbLabelString) {
  // looks like this -> CREATE (n:Person { name : 'Andres', title : 'Developer' })
  for (var i = 0; i < objArray.length; i++) {
    var innerQ = '';
    for(var key in objArray[i] ) {
      innerQ += key + ":'" + objArray[i][key] + "'," ;
    }
    var query = "create (n:"+ dbLabelString +" { "+ innerQ.slice(0,innerQ.length-1) + " }) RETURN n";
    db.cypherQuery(query, savecb);
  }
};

exports.createStatementFromObject =
  createStatementFromObject = function(changeObject){
    // Maybe object should be something like this:
    // {
    //   changeType: 'inventoryUpdate',
    //   changes: {
    //     add: [thing1object,thing2object,thing3object], 
    //     remove: [thing4object,thing4object,thing4object]
    //   }
    // }
  };

// use this to init the server ingredient data
// exports.ing = require('./datainit/initDBwithIngredientList.js').ingredient; 


exports.ing = require('./datainit/recipeImport.js');
// exports.ing = require('./datainit/ingImport.js');
// exports.ing = require('./datainit/relationshipFactory.js');

module.exports = exports;
// exports.ing = require('./datainit/flavorsImport.js');




