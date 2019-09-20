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
	
	cd [path_to_app]/docker/server-web

	./docker-build.sh 

	example: 
	./docker-build.sh 

2 - Errors
--------------------

    Permissão de escrita

    Solução: Please also make sure below folders app/tmp/cache/models and app/tmp/cache/persistent exists and writeable.
