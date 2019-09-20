#!/bin/bash

echo "Database password: $1"

echo "Database dir path: $2"

echo "Data dir path: $3"

docker rm -f mapbiomas-server-db

docker run -d -p 5432:5432 -e POSTGRES_DB=mapbiomas -e POSTGRES_PASSWORD=$1 -v $2:/var/lib/postgresql/data -v $3:/mnt/disks/data -h mapbiomas-server-db --name mapbiomas-server-db -d mdillon/postgis:9.3

#docker exec -it mapbiomas-server-db bash

containerip=`docker inspect --format '{{.NetworkSettings.IPAddress}}' mapbiomas-server-db`
echo "mapbiomas-server-db IPAddress: $containerip"


