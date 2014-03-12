#!/bin/bash
apt-get update

# setup nodejs
apt-get install -y python-software-properties python g++ make
add-apt-repository ppa:chris-lea/node.js
apt-get update
apt-get install -y nodejs

# setup nginx
apt-get install -y nginx

# setup mongodb
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
apt-get update
apt-get install -y mongodb

# Setup nginx
mkdir /etc/nginx/vhosts
cp /vagrant/Vagrantdata/nginx/vhosts/* /etc/nginx/vhosts/
cp /vagrant/Vagrantdata/nginx/nginx.conf /etc/nginx/
/etc/init.d/nginx restart

# Setup supervisor
npm install supervisor -g
npm install forever -g

#start project
#cd /vagrant
#export NODE_ENV=development
#export NODE_SITE=development
#export NODE_PATH=.
#node server.js
#supervisor --debug server.js