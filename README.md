menuapp
=======

## stop right there...

notes beneath probably won't work well at first


## do the docker stuff...

good intro, worth reading: https://docs.docker.com/machine/get-started/


assume you have already installed VirtualBox & Docker with https://docs.docker.com/machine/install-machine/

    docker-machine create --driver virtualbox menuapp

then point your docker client to the new docker-machine

    eval "$(docker-machine env menuapp)"

run a neo4j instance...

    docker run --detach --publish=7474:7474 --volume=$HOME/neo4j/data:/data neo4j


note: once you have a docker machine running … find your docker-ip ip with

    docker-machine ip <envname or “default”>


### api notes
[Neo4j restApi](http://neo4j.com/docs/stable/rest-api-security.html)

check the graphical UI here (probably), localhost:7474

neo4j@password


check db init’d
    match (n) return count(n)

dump
    match (n) delete n


### RxJS thing
http://stackoverflow.com/questions/32792511/rxjs-send-x-requests-per-second



## (and were broken) Just clone it:
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
