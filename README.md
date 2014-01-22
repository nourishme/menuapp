menuapp
=======

## Just clone it: 
If you want to just dive in, you can just clone the repo. You should be sure that you're ready to run neo4j before you do that. 

    git clone https://github.com/nourishme/menuapp.git

Make a server config file: 

    cd menuapp
    touch server/config/configfile.js

Your config file should look something like this, except with your own details: 

    var exports = {}

    exports.yumapi = apiauth = {
      "id": '8888888',
      "key":'77777777', 
      "token": "?_app_id=8888888&_app_key=77777777"
    };


    exports.ids = {
      facebook: {
        clientID: '11111111',
        clientSecret: '222222222222',
        callbackURL: 'http://127.0.0.1:3000/auth/facebook/callback',
        secret: 'secret word'
      }
    }

    module.exports = exports;

## getting up to speed on

On a fresh ubuntu machine follow the steps [here](http://davidtsadler.com/archives/2012/05/06/installing-node-js-on-ubuntu/#via-git)) to get Node installed.

You should now follow the setup instructions to install Oracle JDK or OpenJDK on your OS. After that, you'll be ready to install Neo4j. It's best to follow the instructions for your OS on the [neo4j website](http://www.neo4j.com). 

## dependencies
     
    sudo npm install bower -g
    sudo npm install express
    sudo npm install neo4j
    sudo npm install jscoverage
    sudo npm install mocha -g
    sudo npm install sinon-chai
    sudo npm install forever -g

Now let’s get our server upright… 

    git clone https://github.com/nourishme/menuapp.git
    cd menuapp
    sudo npm install
    sudo bower install
    
## making it run

Now to make it run: 

    nohup forever server/server.js --watch &


Make it stop: 

    forever stopall

### Other info: 

neo4j db data & installed plugins are stored here: 
    
    /var/lib/neo4j/

If you need run as the ‘neo4j’ user: 

    sudo -u neo4j service neo4j-service start

Interact with neo4j as the neo4j user
  
    sudo -i -u neo4j

Port forward for Ubuntu 13.01
    
    sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

