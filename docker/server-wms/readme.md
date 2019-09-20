TerrasBI App Docker image - Server Web
=============================================


Install Docker 
----------------

	sudo curl -sSL https://get.docker.com/ | sh

	sudo usermod -aG docker [your-user]

Verify docker is installed correctly.

	docker run hello-world


1 - Build the image
--------------------
	
	cd [path_to_app]/docker/server-wms

	./docker-build.sh


2 - Run container
---------------------

	docker run -d -v /var/www/mapbiomas:/var/www -v /data:/data -v /mnt/disks/data:/mnt/disks/data -p 80:80 --name mapbiomas-server-wms terras/mapbiomas-server-wms ./start.sh


3 - lighttpd with fastcgi (alternative)
------------------------------------------

	docker run -d -v "`pwd`/app/Vendor/MapServer:/map" -v ~/:/data -p 5000:5000 --link mapbiomas-server-db:dbhost --name mapbiomas-server-wms thingswise/mapserver

	docker run -d -v "`pwd`/app/Vendor/MapServer:/wms" -v /var/www/mapbiomas:/var/www -v /data:/data -v /mnt/disks/data:/mnt/disks/data -p 5000:5000 --name mapbiomas-server-wms-dev thingswise/mapserver

    docker run -d -v  "`pwd`/../../app/Vendor/MapServer:/map" -v /home/pedro/workspace/workspace:/var/www -v ~/:/data -v /mnt/disks/data:/mnt/disks/data -p 5000:5000 --link mapbiomas-server-db:dbhost --name mapbiomas-server-wms thingswise/mapserver

> não esquecer que no local, deve-se criar o arquivo includes/database.map 
