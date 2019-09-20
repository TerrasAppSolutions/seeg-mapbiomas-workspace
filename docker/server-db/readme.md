MapBiomas Worspace Docker image - Server DB - 
=============================================

*Dev version only


Install Docker 
----------------

	sudo curl -sSL https://get.docker.com/ | sh

Verify docker is installed correctly.

	docker run hello-world


1- Build the image
----------------

	cd [path_to_app]/docker/server-db

	./docker-build.sh [database_password] [database_cluster_dir_pah] [backup_dir_path]

	exemplo: 
	./docker-build.sh postgres ~/Docker/volumes/mapbiomas-db-cluster ~/Docker/volumes/mapbiomas-data
	./docker-build.sh postgres /mnt/disks/data/database/mapbiomas-db-cluster /mnt/disks/data/files


2 - Install database
-------------------------------------

	docker exec -it mapbiomas-server-db bash

	psql -U postgres -h localhost mapbiomas < /mnt/disks/data/[dbfile].sql


Start container
---------------------------------

	docker start mapbiomas-server-db

Stop container
---------------------------------

	docker stop mapbiomas-server-db