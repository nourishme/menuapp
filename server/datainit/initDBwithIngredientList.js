exports.neo4j = neo4j = require('node-neo4j');

//var ing = require('./ingredientlist.js').ingredient; 
// var neo4j = require('node-neo4j');
// uncomment this function and Line2 to import base ingredients.

var db = new neo4j('http://localhost:7474');

var recsofar = 1,
  batches = 0,
  batchsize = 100;

var template = function(val){
  return {
      statement : 'CREATE (n:Ingredient {props}) RETURN n',
      parameters : {
        props : val
      }
    };
};

var errthrow = function() {
  console.log(arguments[1].errors);
};

var nextbatch = function(err,result) {
    console.log("****ERR****: ", err);
  var done = false;
  recsofar = batches*batchsize < ing.length ? batches*batchsize : ing.length;
  msg = {statements: []};

  if ( recsofar === ing.length ) done = true;
  var reclimit = recsofar+batchsize > ing.length ? ing.length : recsofar+batchsize;
  for (var i = recsofar; i < reclimit; i++) {
    msg.statements.push(template(ing[i]));

  }
  if (done !== false) {
    console.log('triggerdone');

    db.commitTransaction(result._id, msg, errthrow );
  } else {
    console.log('about to insert batch: ', batches);
    batches++;

    db.addStatementsToTransaction(result._id, msg, nextbatch);
  }
};

// console.log(ing.length);

db.beginTransaction({
  statements:[{
    statement : 'CREATE (n {props}) RETURN n',
      parameters : {
        props : ing[0]
      }
    }]
  },nextbatch );

// 7014/50 = 140.28