#!/bin/bash

echo "App Container: $1" 

echo "App Config File: $2" 

# generate app path
path=`pwd`
replace="/docker/server-web"
replaceTo=""
apppath="${path/$replace/$replaceTo}"

# Remove container 
docker rm -f $1

# run container
docker run -d -v $apppath:/var/www -p 80:80 --link mapbiomas-server-db:dbhost --name $1 terras/mapbiomas-server-web ./start.sh $2

# GEE Auth
docker exec -it $1 earthengine authenticate

# Show IP
containerip=`docker inspect --format '{{.NetworkSettings.IPAddress}}' $1`
echo "$1 IPAddress: $containerip"


