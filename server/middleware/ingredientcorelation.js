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

// get global recipe count
var grc = 0; // set to zero until we find it with getTotalRecipeCount()
var currentSelection = {};
var possibleExtras = {};

exports.getTotalRecipeCount =
 getTotalRecipeCount = function() {
//     MATCH (r:Recipe) RETURN count(DISTINCT r)
  msg  = 'MATCH (r:Recipe) RETURN count(DISTINCT r)';
  var setGrc = function(err, result) {
    if (err) console.log(err);
    grc = results.results[0].data[0];
    console.log("***FORTESTING*** getTotalCount result here: ", grc);
  };
  db.cypherQuery(msg, setGrc);
}();  // note: we immediately invoke getTotalCount()


exports.queryTemplate = // generate a message to find recipes count with our ingredients
 queryTemplate = function(ingredients, typestring) {
  //     MATCH (A:Ingredient)<--(r:Recipe) WHERE id(A)=12345, 
  //           (B:Ingredient)<--(r:Recipe) WHERE id(B)=54321,
  var msg = "MATCH ";
  var template = function(key, id) {
    return '('+key+':Ingredient)<--(r:Recipe) WHERE id('+key+') = '+id+' ';
  };

  for (var i = 0; i < ingredients.length; i++) {
    msg += template('i'+i, ingredients[i]) + ', ';
  }

  switch (typestring) {
    case 'countAll':
      msg = msg.slice(0,msg.length-1);
      msg += 'RETURN count(DISTINCT r)';
      return msg;
    case 'countMore': //todo: i think this case is unnecessary
      msg += ' (C:Ingredient)<--(r:Recipe) RETURN count(DISTINCT C)';
      return msg;
    case 'findMore':
      msg += ' RETURN DISTINCT C.ingredientName AS ingredientName, '+
       ' C.containedIn AS containedIn, '+
       ' id(C) AS id ';
      return msg;    
    default:
      return "no (or incorrect) typestring in template"; 
  }
};

exports.getCoOccursPlusOne = 
 getCoOccursPlusOne = function(req, res) {
  var getMoreForThisGroup = req.data;

  db.beginAndCommitTransaction({
    statements:[{
          statement : queryTemplate(getMoreForThisGroup, 'countAll')
      }
    ]
  }, callbackWrapper(req, res, setResultOfCoOccursPlusOne));
};

var setResultOfCoOccursPlusOne = function(err, result, req, res) {
  if (err) console.log("error in setResultOfCoOccursPlusOne: ", err);
  currentSelection.recTotalNow = result.data[0].row[0]; // should be a single number
  findMoreIngredients(req, res);
};

var findMoreIngredients = function(req, res) {
  db.beginAndCommitTransaction({
    statements:[{
          statement : queryTemplate(currentSelection.recTotalNow, 'findMore')
      }
    ]
  }, callbackWrapper(req, res, setFoundIngredients));
};

var setFoundIngredients = function(err, result, req, res) {
  if (err) console.log("error in setFoundIngredients: ", err);
  possibleExtras.arrayOfIngredients = result.data[0].row[0]; // should be a single number
  getRecPlus(req, res);
};

var getRecPlus = function(req, res) {
  var possibleIng = possibleExtras.arrayOfIngredients;
  var current = req.data;
  var trans = { statements : [] };
  for (var i = 0; i < possibleIng.length; i++) { //TODO: can shorten response time here by limiting possibleIng.length
    var newList = current.concat(possibleIng[i]);
    trans.statements.push(queryTemplate(newList, 'countAll'));
  }

  db.beginAndCommitTransaction(trans, callbackWrapper(req, res, loopToCalcPmi));
};

var loopToCalcPmi = function(err, result, req, res) {
  var pmiScoresForClient = [];
  var possibleIng = possibleExtras.arrayOfIngredients; 
  var possibleRecPlus = possibleExtras.getRecPlus;
  var total = grc;
  var recNow = currentSelection.recTotalNow;
  var recPoss = result.data; //TODO: what's the actual stuff? 
  console.log('*** what does the data in recPoss look liek?', recPoss);
  // let's assume for now that recPoss and possibleIng are in the same order... 
  for (var i = 0; i < possibleIng.length; i++) {

    pmiScoresForClient.push({
      PMI: calcPmiForIngredients(recNow, possibleIng[i].containedIn, recPoss[i], total),
      ingredientName: possibleIng[i].ingredientName,
      id: possibleIng[i].id
    });
  }
  console.log("here's what we're sending back from loopToCalcPmimi: ",pmiScoresForClient);
  res.send(pmiScoresForClient);
};

var calcPmiForIngredients = function(recNow, recAdd, recNowAdd, totalRec) { 
  // PMI(a,b) = log( p(a,b) / p(a)*p(b) )
  // p(a,b) = (# recipes containing a & b ) / (# recipes)
  // p(a) = (# recipes containing a) / (# recipes)
  // p(b) = (# recipes containing b) / (# recipes)
    
  var pcalc = function(contain, totalRec) {
    return contain/totalRec;
  };

  var pmi = function(pa, pb, pab) {
    return Math.log(pab / (pa*pb));
  };

  var pa = pcalc(recNow/total);
  var pb = pcalc(recAdd/total);
  var pab = pcalc(recTotal/total);

  var pairPMI = pmi(pa,pb,pab);

  return pairPMI;
};


module.exports = exports;
