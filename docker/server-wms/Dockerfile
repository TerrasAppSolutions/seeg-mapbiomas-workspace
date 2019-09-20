
# Dockerfile MapBiomas Workspace - Server Web

FROM ubuntu:14.04

MAINTAINER Terras

# Update and install packages
# ------------------------------------------

RUN apt-get update --fix-missing && apt-get install -y \    
    htop \
    nano

ENV TERM xterm

# Install Apache and PHP
# ------------------------------------------    

RUN apt-get install -y apache2 \
	php5 \
	libapache2-mod-php5 \
	php5-curl \	
	php5-mapscript \	
	php5-cgi \
	php5-pgsql \	
	php5-memcache \
	php5-xcache \
	cgi-mapserver
	

# Apache Port
EXPOSE 80

# Scripts
# ------------------------------------------

# start container
ADD files/start.sh /start.sh
RUN chown root:root /start.sh
RUN chmod 700 /start.sh
 
# Command to start
# ------------------------------------------

CMD ["/start.sh"]
