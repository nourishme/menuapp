var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('https://neo4j:password@198.168.99.100:7474'); // HACK: hardcode password, bruh

module.exports = {
  db: db,
  neo4j: neo4j,
  dbinsert: dbinsert,
}


function savecb(err, node) {
  if (err) {
    console.log('Error saving new node to database:', err);
  } else {
    console.log('Node saved to database with id:', node.data[0]._id);
  }
};

function dbinsert(objArray, dbLabelString) {
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
