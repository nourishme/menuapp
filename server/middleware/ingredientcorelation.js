var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');
exports.phrases = ph = require('../middleware/db.phrase.templates.js');

//var ing = require('./ingredientlist.js').ingredient; 
// var neo4j = require('node-neo4j');
// uncomment this function and Line2 to import base ingredients.

var recsofar = 1,
  batches = 0,
  batchsize = 100;

// var markForUpdate = function(ida) {
//  /*
//   *  THIS ONLY NEEDS TO BE DONE ONE TIME EVER: 
//   *  Initialize process by setting all :Ingredient as i.pmiTime = 1
//   *
//   *  MATCH (i:Ingredient) SET i.pmiTime = 1
//   */
//
// };


var callbackWrapper = function (req, res, altCallback){
  resultSendCallback = function(err, result) {
    if (err) console.log(err);
    res.send( result);
  };
  var callback = altCallback || resultSendCallback;
  return callback;
};

var pmiLoop = function(err, resultIngredients, timestamp) {  
  var ingArray = resultIngredients.data[0];
  for (var i = 0; i < ingArray.length; i++) {
    findCoIngred(ingArray[i], timestamp);
  }
};

var getListToProcess = function(timestamp, listsize) {
  listsize = listsize || 1;
  timestamp = timestamp - msBetween || 1; // all further steps rely on this value being present
  
  var daysbetweenprocess = 10,
    msBetween = daysbetweenprocess * 86400;

  // Starting from a list of 100 ingredients where i.pmiTime = timestamp
  //   MATCH (r:Recipe)-[:HAS_INGREDIENT]->(i:Ingredient {pmiTime: 1}) 
  //     WITH DISTINCT id(i) as ingredientids 
  //   RETURN ingredientids LIMIT 1
  var msg = "MATCH (r:Recipe)-[:HAS_INGREDIENT]->(i:Ingredient pmiTime:"+
      timestamp+
      ") WITH DISTINCT id(i) as ingredientids RETURN ingredientids LIMIT "+
      listsize ;

  db.cypherQuery(msg, callbackWrapper(req,res, pmiLoop));   
};

var coIngredientQuery = function(id) {
  return "MATCH (total:Recipe) WITH count(DISTINCT total) as tots, timestamp() as time"+
    "MATCH (ia:Ingredient)<-[:HAS_INGREDIENT]-(recab:Recipe)-[recHasB:HAS_INGREDIENT]->(ib:Ingredient)"+
      "WHERE id(ia)= "+ val +
      " WITH DISTINCT ib AS idB, count(DISTINCT recab) AS recAB , count(DISTINCT recHasB) AS recB, tots, time"+
    "MATCH (i:Ingredient)<-[:HAS_INGREDIENT]-(r:Recipe)"+
      "WHERE id(i)="+ val +
      " WITH [i, count(DISTINCT r.id), idB, recAB, recB, tots, time] AS c "+
    "FOREACH (row IN c |"+
      "FOREACH (i1 in c[0] |"+
        "FOREACH (recA in c[1] |"+
          "FOREACH (i2 in c[2]|"+
            "FOREACH (recAB in c[3] |"+
              "FOREACH (recB in c[4] | "+
                "FOREACH (totalRec in c[5] | "+
                  "CREATE (i1:Ingredient )-[pm1:PMI]->(i2: Ingredient) "+
                  "SET startNode(pm1).pmiTime = c[6], endNode(pm1).pmiTime = c[6], pm1.weight = log( (totalRec*recAB) /(recA*recB) ), pm1.pmiTime= c[6]"+
                  "CREATE (i1:Ingredient )<-[pm2:PMI]-(i2: Ingredient) "+
                  "SET startNode(pm2).pmiTime = c[6], endNode(pm2).pmiTime = c[6], pm2.weight = log( (totalRec*recAB) /(recA*recB) ), pm2.pmiTime= c[6]"+
                ")"+
              ")"+
            ")"+
          ")"+
        ")"+
      ")"+
    ")";
};




var findCoIngred = function(ida, timestamp) {
/*  For every ingredient we know of, from the 1st ingredient, find all co_occurring ingredients that haven't been processed
    MATCH (ia:Ingredient)<-[:HAS_INGREDIENT]-(recab:Recipe)-[:HAS_INGREDIENT]->(ib:Ingredient)
      WHERE id(ia)=430878 AND ib.pmitime = 1
    RETURN id(ab)
*/  
  var msg = "MATCH (ia:Ingredient)<-[recHasA:HAS_INGREDIENT]-(recab:Recipe)-[recHasB:HAS_INGREDIENT]->(ib:Ingredient)" +
    " WHERE id(ia)=" + ida +
    " AND ib.pmiTime =" + timestamp +
    " MATCH (i:Ingredient)<-[:HAS_INGREDIENT]-(r:Recipe)"+
    " WHERE id(i)=" + ida +
    " WITH DISTINCT id(i) AS idA, count(DISTINCT r) AS recA, idB, recAB, recB"+
    " RETURN idA, recA, idB, recB, recAB";

  db.cypherQuery(msg, callbackWrapper(req,res, processCoIngredient)); 
/* 
returns something like this:
+---------------------------------------+
| idA    | recA | idB    | recB | recAB |
+---------------------------------------+
| 430878 | 1580 | 431365 | 10   | 2     |
| 430878 | 1580 | 431501 | 2    | 1     |
| 430878 | 1580 | 431681 | 4    | 2     |  
*/
};

var nextbatch = function(err,result) {
  console.log("****ERR****: ", err);
  var done = false;
  recsofar = batches*batchsize < ing.length ? batches*batchsize : ing.length;
  msg = {statements: []};
  if ( recsofar === ing.length ) done = true;
  var reclimit = recsofar+batchsize > ing.length ? ing.length : recsofar+batchsize;
  for (var i = recsofar; i < reclimit; i++) {
    msg.statements.push(coIngredientQuery(ingredientArray[i]));
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

db.beginTransaction({
  statements:[{
    statement : 'CREATE (n {props}) RETURN n',
      parameters : {
        props : ing[0]
      }
    }]
  },nextbatch );









// var getOccurrenceDetails = function(ida, idb) {
//   idb = idb || 0; // make this function work for one or two ingredients
//   if (idb === 0) { // get recipes with A
//     var msg = "MATCH (ia:Ingredient)<-[hasa:HAS_INGREDIENT]-(r:Recipe)"+
//       " WHERE id(ia)=" + ida +
//       " RETURN count(DISTINCT r)";
//   } else { // get recipes with A & B
//     var msg = "MATCH (ia:Ingredient)<-[:HAS_INGREDIENT]-(recab:Recipe)-[:HAS_INGREDIENT]->(ib:Ingredient)"+
//       " WHERE id(ia)="+ida+" AND id(ib)="+idb+
//       " RETURN count(DISTINCT recab)";
//   }
// };

// var calcPmiForIngredients = function(reca, recb, recab, totalrec) {
 
//   // PMI(a,b) = log( p(a,b) / p(a)*p(b) )

//   // p(a,b) = (# recipes containing a & b ) / (# recipes)
//   // p(a) = (# recipes containing a) / (# recipes)
//   // p(b) = (# recipes containing b) / (# recipes)
    
//   var pcalc = function(contain, totalrec) {
//     return contain/totalrec;
//   };

//   var pmi = function(pa, pb, pab) {
//     return Math.log(pab / (pa*pb));
//   };

//   var pa = pcalc(reca/total);
//   var pb = pcalc(recb/total);
//   var pab = pcalc(recab/total);

//   var pairPMI = pmi(pa,pb,pab);

//   return pairPMI;
// };

// var relateIngredients = function(ida, idb) {
//   var now = new Date().getTime();
// /*
//     Create a relationship between A&B, SET coocur weight & SET pdate = timestamp() & SET ia.pmiTime = timestamp()

//     CREATE (ia)-[pmi:PMI]-(i) SET pmi.weight = pairPMI, pmi.pmiTime = timestamp
//       WHERE id(ia)=430878 AND id(ib)=430905 
//       SET ia.pmiTime = timestamp, ib.pmiTime = timestamp  
// */

// }; 












/*
write a function to calculate the pmi for 2 ingredients and store that value on the ingredient
write a function that loops through all the ingredients that co-occur with an ingredient and runs "calculate pmi"
set a flag on each ingredient that shows whether it's been updated since the last time it's pmi's have been calculated
When recipes are added to the database, set the processed flag to false
create a function that "processes" a single recipe. This should add relationships between all the ingredients in the recipe
create a function that runs "process recipe" on the top n recipes where processed is false
create a cron job that runs process recipes at some regular interval
*/