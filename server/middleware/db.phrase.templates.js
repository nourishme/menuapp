var template = {};

/* 
 * Match functions 
*/

template.matchNodeById = 
 matchNodeById = function(node, nodekeyoption){
  nodekeyoption = nodekeyoption || 'n';
  node.id = typeof node.id === "number" ? node.id : parseInt(node.id);
  var match_node = "MATCH ("+nodekeyoption+") WHERE id("+nodekeyoption+") = "+node.id+ " ";
  return {msg: match_node, key: nodekeyoption};
};

/* 
 * Lable functions 
*/

template.addLabelTemplate =
 addLabelTemplate = function(startnodekey, endnodekey, labelString) {
  labelString = labelString.toUpperCase();
  return "CREATE ("+startnodekey+")-[:"+labelString+"]->("+endnodekey+") ";
};

template.removeLabelTemplate =
 removeLabelTemplate = function(startnodekey, endnodekey, labelString) {
  labelString = labelString.toUpperCase();
  return "REMOVE ("+startnodekey+")-[:"+labelString+"]->("+endnodekey+") ";
};

/* 
 * Message maker functions 
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
      msg+= template.addLabelTemplate(userkey, ingkey, 'LIKES');
    } else if (!ing.liked) {
      msg+= template.removeLabelTemplate(userkey, ingkey, 'LIKES');
    } else {
      console.log("unaccounted ingredient status: ",ing);
    }
  }
  return msg;
};

module.exports = template;
