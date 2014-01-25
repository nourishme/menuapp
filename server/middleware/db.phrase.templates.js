var template = {};

/* 
 * Match functions 
*/

template.matchNodeById = 
 matchNodeById = function(nodeid, nodekeyoption){
  // match (n)-[:LIKES]->(b) where id(n) = 406842 return b
  nodekeyoption = nodekeyoption || 'n';
  nodeid = typeof nodeid === "number" ? nodeid : parseInt(nodeid);
  var match_node = "MATCH ("+nodekeyoption+") WHERE id("+nodekeyoption+") = "+nodeid+ " ";
  return {msg: match_node, key: nodekeyoption};
};

template.matchNodeByPropertyValueAndLabel = 
 matchNodeByPropertyAndValue = function(property, value, label, nodekeyoption ){
  // match (n:Label) where n.Proptery = Value
  nodekeyoption = nodekeyoption || 'n';
  label = ":"+label || label;
  var match_query = "MATCH ("+nodekeyoption + label+") WHERE "+nodekeyoption+"."+property+" = '"+value+ "' RETURN "+nodekeyoption;
  console.log(match_query);
  return {msg: match_query, key: nodekeyoption};
};

/* 
 * Lable functions 
*/

template.addRelationshipTemplate =
 addRelationshipTemplate = function(startnodekey, endnodekey, relString) {
  relString = relString.toUpperCase();
  return "CREATE ("+startnodekey+")-[:"+relString+"]->("+endnodekey+") ";
};

template.removeRelationshipTemplate =
 removeRelationshipTemplate = function(startnodekey, endnodekey, relString) {
  relString = relString.toUpperCase();
  return "REMOVE ("+startnodekey+")-[:"+relString+"]->("+endnodekey+") ";
};

/* 
 * Compile Message functions
*/

template.updateLikeStatusStatementFromObject = 
 updateLikeStatusStatementFromObject = function(userid, inventoryChangeArray){
  matchedNode = template.matchNodeById(userid);
  msg = matchedNode.msg;
  userkey = matchedNode.key;

  for (var i = 0; i < inventoryChangeArray; i++){
    ing = inventoryChangeArray[i];
    ingkey = matchNodeById(inventoryChangeArray[i], 'node'+i).key ;
    if (ing.liked) { 
      msg+= template.addRelationshipTemplate(userkey, ingkey, 'LIKES');
    } else if (!ing.liked) {
      msg+= template.removeRelationshipTemplate(userkey, ingkey, 'LIKES');
    } else {
      console.log("unaccounted ingredient status: ",ing);
    }
  }
  return msg;
};

module.exports = template;
