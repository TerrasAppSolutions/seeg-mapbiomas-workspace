#!/bin/bash

# generate app path
path=`pwd`
replace="/docker/server-web"
replaceTo=""
apppath="${path/$replace/$replaceTo}"

# Remove container 
docker rm -f mapbiomas-server-web

# build image
docker build -t terras/mapbiomas-server-web .

# run container
docker run -d -v $apppath:/var/www -v /var/www/dev:/var/dev-www/ -v /data:/data -v /mnt/disks/data:/mnt/disks/data -p 80:80 --link mapbiomas-server-db:dbhost -h mapbiomas-server-web --name mapbiomas-server-web terras/mapbiomas-server-web ./start.sh

# GEE Auth
docker exec -it mapbiomas-server-web earthengine authenticate

# Show IP
containerip=`docker inspect --format '{{.NetworkSettings.IPAddress}}' mapbiomas-server-web`
echo "mapbiomas-server-web IPAddress: $containerip"


