var ing = require('./ingredientlist.js').ingredient; 
var db = require('../neo4jDB');
// uncomment this function and Line2 to import base ingredients.


var recordsSoFar = 0;

var nextbatch = function() {

  for (var i = 0; i < 50; i++) {
      db.addStatementsToTransaction(_id, {
        statements : [ {
          statement : 'CREATE (n:'+nodeLabelString+' {props}) RETURN n',
          parameters : {
            props : objArray[i]
          }
        } ]
      }, cb(result.transactionId));
  }
};

console.log(ing.length);
// db.dbinsert(ing, "Ingredient");

// db.beginTransaction(statement, nextbatch);