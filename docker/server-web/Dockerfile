
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

RUN apt-get update --fix-missing && apt-get install -y apache2 \
	# PHP	
	php5 \
	libapache2-mod-php5 \
	php5-curl \
	php5-gd \
	php5-imagick \
	php5-mapscript \
	php5-mongo \
	php5-cgi \
	php5-pgsql \
	php5-json \
	php5-memcache \
	php5-xcache \
	# Mapserver
	cgi-mapserver \
	# Phppgadmin
	phppgadmin \
	# Python	
	python-dev \
	python-virtualenv \
	build-essential \
	libpq-dev \
	libxml2-dev \
	libxslt1-dev \
	libldap2-dev \
	libsasl2-dev \
	libffi-dev

# Apache Port
EXPOSE 80

# Phppgadmin
ADD files/phppgadmin/phppgadmin.conf /etc/apache2/sites-enabled/phppgadmin.conf
ADD files/phppgadmin/config.inc.php /usr/share/phppgadmin/conf/config.inc.php

# MapBiomas Workspace sites-enabled conf
ADD files/apache/app.conf /etc/apache2/sites-enabled/app.conf
RUN rm /etc/apache2/sites-enabled/000-default.conf

ADD files/apache/rproxy.conf /etc/apache2/sites-enabled/rproxy.conf

# Install EarthEngine
# --------------------------------------

RUN pip install setuptools==33.1.1 cffi && \
	pip install google-api-python-client earthengine-api	

VOLUME /root/.config/earthengine


# Scripts
# ------------------------------------------

# start container
ADD files/start.sh /start.sh
RUN chown root:root /start.sh
RUN chmod 700 /start.sh

# Cron jobs
# ADD files/cron/cronjobs /cronjobs
# RUN crontab /cronjobs

 
# Command to start
# ------------------------------------------

CMD ["/start.sh"]
