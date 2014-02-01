var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');
exports.phrases = ph = require('../middleware/db.phrase.templates.js');

/* 
 * We use this module by invoking getCoOccursPlusOne. 
 * That starts a chain of events which find PMI scores for common
 * occurring ingredients. Which is awesome.
 */

// utility function. //todo: this could be put somewhere else
var callbackWrapper = function (req, res, altCallback){
  resultSendCallback = function(err, result) {
    if (err) console.log(err);
    res.send( result);
  };
  var callback = altCallback || resultSendCallback;
  return callback;
};

var grc = {}; // set to zero until we find it with gettotipeCount()
var currentSelection = {};
var possibleExtras = {};
var coms = {}


exports.getTotalRecipeCount = // get global recipe count
 getTotalRecipeCount = function() {
//     MATCH (r:Recipe) RETURN count(DISTINCT r)
  msg  = 'MATCH (r:Recipe) RETURN count(DISTINCT r)';
  var setGrc = function(err, result) {
    if (err) console.log(err);
    grc = result.data[0];
    // console.log("***FORTESTING*** getTotalCount result here: ", grc);
  };
  db.cypherQuery(msg, setGrc);
}();  // note: we immediately invoke getTotalCount()



exports.queryTemplate = // generate a message to find recipes count with our ingredients
 queryTemplate = function(ingredients, typestring) {
  //     MATCH (A:Ingredient)<--(r:Recipe) WHERE id(A)=12345, 
  //           (B:Ingredient)<--(r:Recipe) WHERE id(B)=54321,
  var msg = '';
  var template = function(key, id) {
    return '('+key+':Ingredient)<--(r:Recipe) WHERE id('+key+') = '+id+' ';
  };

  for (var i = 0; i < ingredients.length; i++) {
    msg += "MATCH "+template('i'+i, ingredients[i]) + '   ';
    if (typestring === 'countMore') msg = msg.slice(0,msg.length-2);
  }

  switch (typestring) {
    case 'countAll':
      msg = msg.slice(0,msg.length-2);
      msg += 'RETURN count(DISTINCT r)';
      // console.log(" countall queryTemplate with typestring: ",typestring, ' and msg: ',msg)
      return msg;
      
    case 'countMore': //todo: i think this case is unnecessary
      
      msg += ' MATCH (C:Ingredient)<--(r:Recipe) RETURN count(DISTINCT C)';
      // console.log(" countMore queryTemplate with typestring: ",typestring, ' and msg: ',msg)
      return msg;

    case 'findMore':
      msg = msg.slice(0,msg.length-2);
      msg += ' MATCH (C:Ingredient )<--(r:Recipe) WHERE C.containedIn > 2  '; 
      msg += ' RETURN DISTINCT C.ingredientName AS ingredientName, '+
       ' C.containedIn AS containedIn, '+
       ' id(C) AS id LIMIT 50';
      // console.log(" findMore queryTemplate with typestring: ",typestring, ' and msg: ',msg)
      return msg;    
    default:
      return "no (or incorrect) typestring in template"; 
  }
};

exports.getCoOccursPlusOne = // this starts our event chain
 getCoOccursPlusOne = function(req, res) {
  // console.log("*******getCoOccursPlusOne req.body: ",req.body)
  coms.req = req;
  coms.res = res;
  currentSelection.ingredientGroup = req.body; // here's the client's current selection of ingredients

  db.beginAndCommitTransaction({
    statements:[{
          statement : queryTemplate(currentSelection.ingredientGroup, 'countAll')
      }
    ]
  }, callbackWrapper(req, res, setResultOfCoOccursPlusOne));
};



exports.setResultOfCoOccursPlusOne = // we'll set our result to a global
 setResultOfCoOccursPlusOne = function(err, result, req, res) {
  if (err) console.log("error in setResultOfCoOccursPlusOne: ", err);
  // console.log("result.results[0].data[0].row[0] in setResultOfCoOccursPlusOne: ", result.results[0].data[0].row[0]);
  // { results: [ { columns: [Object], data: [Object] } ],
  // errors: [] }
  currentSelection.recTotalNow = result.results[0].data[0].row[0]; // should be a single number
  // console.log("*******setResultOfCoOccursPlusOne sets currentSelection.recTotalNow: ",currentSelection.recTotalNow) ;
  findMoreIngredients(req, res);
};

exports.findMoreIngredients = // now we'll find more ingredients to match with our current selection
 findMoreIngredients = function(req, res) {
  // console.log("*******findMoreIngredients needs currentSelection.ingredientGroup: ",currentSelection.ingredientGroup); 
  // console.log('testing note... we have not REQ here ************* TODO *************');
  db.beginAndCommitTransaction({
    statements:[{ 
          statement : queryTemplate(currentSelection.ingredientGroup, 'findMore')
      }
    ]
  }, callbackWrapper(req, res, setFoundIngredients));
};

exports.setFoundIngredients = // just set the results to a global and move forward
 setFoundIngredients = function(err, result, req, res) {
  if (err) console.log("error in setFoundIngredients: ", err);
  // console.log("*******setFoundIngredients result.results[0].data: ",result.results[0].data) ;

  possibleExtras.arrayOfIngredients = result.results[0].data; // should be a single number
  getRecPlus(req, res);
};

exports.getRecPlus = // LIMITED TO 100 in templateQuery this is a long query. will find recipe counts for all possible additional ingredients
 getRecPlus = function(req, res) {
  var possibleIng = possibleExtras.arrayOfIngredients; //[ { row: [ 'white sugar', 8, 431183 ] }, ... ]
  var current = currentSelection.ingredientGroup;
  var trans = { statements : [] };
  for (var i = 0; i < possibleIng.length; i++) { //TODO: can shorten response time here by limiting possibleIng.length
    var newList = current.concat(possibleIng[i].row[2]); //position 2 on the row is the ingredient number
    trans.statements.push({statement: queryTemplate(newList, 'countMore')});
  }
  // console.log("*** transaction message in getRecPlus: ", trans)
  db.beginAndCommitTransaction(trans, callbackWrapper(req, res, loopToCalcPmi));
};

exports.loopToCalcPmi = // assumes ordered results & actual objects... loop the calculation and finally send the results. 
 loopToCalcPmi = function(err, result, req, res) {
  var pmiScoresForClient = [];
  var possibleIng = possibleExtras.arrayOfIngredients; 
  var possibleRecPlus = possibleExtras.getRecPlus;
  // console.log("*** this is the grc... ", grc);
  var total = grc;
  var countRecNow = currentSelection.recTotalNow;
  var recPoss = result.results; //TODO: what's the actual stuff? 
  // console.log('*** what does the data in recPoss look liek?', recPoss);
  // let's assume for now that recPoss and possibleIng are in the same order... 
  // increment:  9  total:  6454  countRecNow:  3001  possibleIng[i](containedIn?):  { row: [ 'ground mustard', 8, 432082 ] } recPoss[i]:  { columns: [ 'count(DISTINCT C)' ],
  // data: [ { row: [Object] } ] }

  for (var i = 0; i < possibleIng.length; i++) {
    // console.log('increment: ', i ,  ' total: ', total, ' countRecNow: ', countRecNow, ' possibleIng[i].row[2]: ', possibleIng[i].row[2], 'recPoss[i].data[0].row: ', recPoss[i].data[0].row[0]);
    
    pmiScoresForClient.push({
      PMI: calcPmiForIngredients(countRecNow, possibleIng[i].row[1], recPoss[i].data[0].row[0], total),
      ingredientName: possibleIng[i].row[0],
      _id: possibleIng[i].row[2]
    });
  }
  // console.log("here's what we're sending back from loopToCalcPmimi: ",pmiScoresForClient);
  coms.res.send(pmiScoresForClient);
};

var calcPmiForIngredients = function(recNow, recAdd, recNowAdd, tot) { 
  // PMI(a,b) = log( p(a,b) / p(a)*p(b) )
  // p(a,b) = (# recipes containing a & b ) / (# recipes)
  // p(a) = (# recipes containing a) / (# recipes)
  // p(b) = (# recipes containing b) / (# recipes)
  // console.log('recNowAdd: ', recNowAdd.data[0].row )
  var pcalc = function(contain, total) {
    // console.log("pcalc contain : ", contain, ' && total ', total);
    return contain/total;
  };

  var pmi = function(pa, pb, pab) {
    // console.log("pmi pa : ", pa, ' && pb ', pb, '&& pab ', pab);
    return Math.log(pab / (pa*pb));
  };

  var pa = pcalc(recNow,tot);
  var pb = pcalc(recAdd,tot);
  var pab = pcalc(recNowAdd,tot);

  var pairPMI = pmi(pa,pb,pab);

  return pairPMI;
};


module.exports = exports;
