#!/bin/bash

# Remove container 
docker rm -f mapbiomas-server-wms

# build image
docker build -t terras/mapbiomas-server-wms .

# Show IP
# containerip=`docker inspect --format '{{.NetworkSettings.IPAddress}}' mapbiomas-server-wms`
# echo "mapbiomas-server-wms IPAddress: $containerip"


