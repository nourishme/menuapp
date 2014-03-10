var neo4jDB = require('../neo4jDB.js');
var exports = {};
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');


exports.phrases = ph = require('../middleware/db.phrase.templates.js');

var recsofar = 0;

var ingArray; 

// var markForUpdate = function(ida) {
//  /*
//   *  THIS ONLY NEEDS TO BE DONE ONE TIME EVER: 
//   *  Initialize process by setting all :Ingredient as i.pmiTime = 1
//   *
//   *  MATCH (i:Ingredient) SET i.pmiTime = 1
//   */
//
// };

var setCoIngredientQuery = function(val) {
  return "MATCH (total:Recipe) WITH count(DISTINCT total) as tots, timestamp() as time "+
    "MATCH (ia:Ingredient)<-[:HAS_INGREDIENT]-(recab:Recipe)-[recHasB:HAS_INGREDIENT]->(ib:Ingredient) "+
      " WHERE id(ia)= "+ val +
      " WITH DISTINCT ib AS idB, count(DISTINCT recab) AS recAB , count(DISTINCT recHasB) AS recB, tots, time "+
    "MATCH (i:Ingredient)<-[:HAS_INGREDIENT]-(r:Recipe) "+
      " WHERE id(i)= "+ val +
      " WITH [i, count(DISTINCT r.id), idB, recAB, recB, tots, time] AS c  "+
    " FOREACH (row IN c | "+
      " FOREACH (i1 in c[0] | "+
        " FOREACH (recA in c[1] | "+
          " FOREACH (i2 in c[2]| "+
            " FOREACH (recAB in c[3] | "+
              " FOREACH (recB in c[4] |  "+
                " FOREACH (totalRec in c[5] |  "+
                  " CREATE (i1:Ingredient )-[pm1:PMI]->(i2: Ingredient)  "+
                  " SET startNode(pm1).pmiTime = c[6], endNode(pm1).pmiTime = c[6], pm1.weight = log( (totalRec*recAB) /(recA*recB) ), pm1.pmiTime= c[6] "+
                  " SET startNode(pm1).pScore = (recA/totalRec), endNode(pm1).pScore = (recB/totalRec) "+
                  " SET startNode(pm1).containedIn = recA, endNode(pm1).containedIn = recB "+
                  " CREATE (i1:Ingredient )<-[pm2:PMI]-(i2: Ingredient)  "+
                  " SET startNode(pm2).pmiTime = c[6], endNode(pm2).pmiTime = c[6], pm2.weight = log( (totalRec*recAB) /(recA*recB) ), pm2.pmiTime= c[6] "+

                ") "+
              ") "+
            ") "+
          ") "+
        ") "+
      ") "+
    ")";
};

var getListToProcess = function(timestamp, listsize) {
  console.log('get ready for a lot of fun and excitement');
  var daysbetweenprocess = 2,
    msBetween = daysbetweenprocess * 86400;
  listsize = listsize || 1;
  timestamp =  3; // all further steps rely on this value being present
  // Starting from a list of 100 ingredients where i.pmiTime = timestamp
  //   MATCH (r:Recipe)-[:HAS_INGREDIENT]->(i:Ingredient {pmiTime: 1}) 
  //     WITH DISTINCT id(i) as ingredientids 
  //   RETURN ingredientids LIMIT 1
  var msg = {statements:[
    {statement: "MATCH (r:Recipe)-[:HAS_INGREDIENT]->(i:Ingredient) WHERE  i.pmiTime < "+
        timestamp+
        " WITH DISTINCT id(i) as ingredientids RETURN ingredientids LIMIT "+
        listsize} ]};
  console.log("message in Get List to Process: ",msg);
  db.beginAndCommitTransaction(msg, pmiLoop);
};

var pmiLoop = function(err, results, timestamp) {  
  console.log(err, results);
  // recsofar++;
  console.log('result in nextIngredient: ',results.results[0].data);
  ingArray = results.results[0].data;
  nextIngredient(null, null, ingArray[recsofar], timestamp);
};

var nextIngredient = function(err,result, start, timestamp) {
  if (err) throw console.log("****ERR****: ", err);
  
  recsofar++;
  if (recsofar > 98) {
    getListToProcess(1, 100);
    recsofar = 0;
  }
  var msg = {statements: []};
  console.log('recsofar: ',recsofar, 'ingredient number: ', ingArray[0]);
  msg.statements.push({
    statement: setCoIngredientQuery(ingArray[recsofar].row[0])
  });
  console.log('result in nextIngredient: ',result);

  db.beginAndCommitTransaction(msg, nextIngredient);

};

// INIT here:
 getListToProcess(2, 100);

// testing here:
// var date = new Date().getTime();
// date = date - 86400;
// getListToProcess(date, 100);


// var findCoIngred = function(ida, timestamp) {
// /*  For every ingredient we know of, from the 1st ingredient, find all co_occurring ingredients that haven't been processed
//     MATCH (ia:Ingredient)<-[:HAS_INGREDIENT]-(recab:Recipe)-[:HAS_INGREDIENT]->(ib:Ingredient)
//       WHERE id(ia)=430878 AND ib.pmitime = 1
//     RETURN id(ab)
// */  
//   var msg = "MATCH (ia:Ingredient)<-[recHasA:HAS_INGREDIENT]-(recab:Recipe)-[recHasB:HAS_INGREDIENT]->(ib:Ingredient)" +
//     " WHERE id(ia)=" + ida +
//     " AND ib.pmiTime =" + timestamp +
//     " MATCH (i:Ingredient)<-[:HAS_INGREDIENT]-(r:Recipe)"+
//     " WHERE id(i)=" + ida +
//     " WITH DISTINCT id(i) AS idA, count(DISTINCT r) AS recA, idB, recAB, recB"+
//     " RETURN idA, recA, idB, recB, recAB";
//   db.cypherQuery(msg, callbackWrapper(req,res, processCoIngredient)); 
// };

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

// var calcPmiForIngredients = function(reca, recb, recab, totalRec) { 
//   // PMI(a,b) = log( p(a,b) / p(a)*p(b) )
//   // p(a,b) = (# recipes containing a & b ) / (# recipes)
//   // p(a) = (# recipes containing a) / (# recipes)
//   // p(b) = (# recipes containing b) / (# recipes)
    
//   var pcalc = function(contain, totalRec) {
//     return contain/totalRec;
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


