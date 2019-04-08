#!/bin/bash

sudo su -

apt-get update

apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

apt-get update

apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io


mkdir /data
docker run \
  -p 27017:27017 \
  -v /data:/data/db \
  -d --restart=always \
  --name namiStore \
  mongo

docker exec -i -t namiStore bash
mongo nami localhost:27017/test --eval "printjson(db.createCollection('namiCollection'))"
exit
