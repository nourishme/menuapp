var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');
exports.phrases = ph = require('../middleware/db.phrase.templates.js');

/* 
Pointwise mutual information (pmi) 

PMI(a,b) = log( p(a,b) / p(a)*p(b) )

p(a,b) = (# recipes containing a & b ) / (# recipes)
p(a) = (# recipes containing a) / (# recipes)
p(b) = (# recipes containing b) / (# recipes)


write a function to calculate the pmi for 2 ingredients and store that value on the ingredient
write a function that loops through all the ingredients that co-occur with an ingredient and runs "calculate pmi"
set a flag on each ingredient that shows whether it's been updated since the last time it's pmi's have been calculated
When recipes are added to the database, set the processed flag to false
create a function that "processes" a single recipe. This should add relationships between all the ingredients in the recipe
create a function that runs "process recipe" on the top n recipes where processed is false
create a cron job that runs process recipes at some regular interval
*/

var get100 = function(timestamp) {
  timestamp = timestamp -100 || 1;
/*  
    Starting from a list of 100 ingredients(iA) where i.pmiTime = timestamp

    MATCH (r:Recipe)-[:HAS_INGREDIENT]->(i:Ingredient) 
      WHERE i.pmiTime = timestamp
      WITH DISTINCT id(i) as ingredientids 
    RETURN ingredientids LIMIT 100
*/
  
};

var pmiLoop = function() { 
  
};


var markForUpdate = function(ida) {

/*
    Initialize process by setting all :Ingredient as i.pmiTime = 1

    MATCH (i:Ingredient) SET i.pmiTime = 1
*/

};

var findCoIngred = function(ida) {

/*
    For every ingredient we know of, from the 1st ingredient, find all co_occurring ingredients that haven't been processed

    MATCH (ia:Ingredient)<-[:HAS_INGREDIENT]-(recab:Recipe)-[:HAS_INGREDIENT]->(ib:Ingredient)
      WHERE id(ia)=430878 AND ib.pmitime = 1
    RETURN id(ab)
*/  

};

var getIngredientCounts = function(ida,idb) {
/*
    For every pair, find their counts:

    MATCH (ia:Ingredient)<-[hasa:HAS_INGREDIENT]-(reca:Recipe)
      WHERE id(ia)=430878
      WITH count(DISTINCT reca) AS recwitha

    MATCH (ib:Ingredient)<-[hasb:HAS_INGREDIENT]-(recb:Recipe)
      WHERE id(ib)=430905
      WITH count(DISTINCT recb) AS recwithb, recwitha

    MATCH (ia:Ingredient)<-[:HAS_INGREDIENT]-(recab:Recipe)-[:HAS_INGREDIENT]->(ib:Ingredient)
      WHERE id(ia)=430878 AND id(ib)=430905 
      RETURN count(DISTINCT recab) as recwithab, recwithb, recwitha    
*/
};

var calcPmiForIngredients = function(reca, recb, recab, totalrec) {
 
  // PMI(a,b) = log( p(a,b) / p(a)*p(b) )

  // p(a,b) = (# recipes containing a & b ) / (# recipes)
  // p(a) = (# recipes containing a) / (# recipes)
  // p(b) = (# recipes containing b) / (# recipes)
    
  var pcalc = function(contain, totalrec) {
    return contain/totalrec;
  };

  var pmi = function(pa, pb, pab) {
    return Math.log(pab / (pa*pb));
  };

  var pa = pcalc(reca/total);
  var pb = pcalc(recb/total);
  var pab = pcalc(recab/total);

  var pairPMI = pmi(pa,pb,pab);

  return pairPMI;
};

var relateIngredients = function(ida, idb) {
/*
    Create a relationship between A&B, SET coocur weight & SET pdate = timestamp() & SET ia.pmiTime = timestamp()

    CREATE (ia)-[pmi:PMI]-(i) SET pmi.weight = pairPMI, pmi.pmiTime = timestamp
      WHERE id(ia)=430878 AND id(ib)=430905 
      SET ia.pmiTime = timestamp, ib.pmiTime = timestamp  
*/

}; 




