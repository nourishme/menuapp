menuapp
=======

## getting up to speed
clone the repo:

    git clone https://github.com/nourishme/menuapp.git

from the new directory, use npm and bower to get things running: 

    npm install

    bower install

make sure you have the testing dependencies installed: 

    npm install mocha -g

To connect to the server for the first time, go to the directory where your .pem file is residing on your machine, and run: 

    chmod 400 keypairforwebserver.pem
    ssh -i keypairforwebserver.pem ubuntu@ec2-balahlkasblkjablkj-.compute.amazonaws.com

You’re now connected to the server! You can tell because the console looks like this: 

    ubuntu@ip88888888:~$


now that you’re connected, you need to install some utilities on this fresh computer (thanks): 

    sudo apt-get update
    sudo apt-get install build-essential -y
    sudo apt-get install git -y

install node dependencies: 

    sudo apt-get install python libssl-dev -y

now let’s put node in the proper place, we’ll get all the versions of it with ‘git’
    
    cd /usr/local/src
    sudo git clone git://github.com/joyent/node.git
    cd node
    sudo git checkout v0.10.24-release
    sudo ./configure
    sudo make
    sudo make install

now we can get the Neo4j utilities: 



Great, now NodeJS & NPM are installed :) let’s get bower & express
     
    sudo npm install bower -g

Now let’s get our server upright… 

    git clone https://github.com/nourishme/menuapp.git
    cd menuapp
    sudo npm install
    sudo bower install
    sudo npm install express
    sudo npm install neo4j
    sudo npm install jscoverage
    sudo npm install mocha -g
    sudo npm install sinon-chai
    sudo npm install forever -g

Make sure your Neo4j is installed correctly:
instructions

Now to make it run: 

    nohup forever server/server.js --watch &

Let’s start with a port forward… 
    
    sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

Make it stop: 

    forever stopall


