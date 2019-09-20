#!/bin/bash

a2enmod rewrite
a2enmod cgi
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_balancer
a2enmod lbmethod_byrequests

# Cron start
cron
touch /var/www/app/tmp/logs/cron.log
tail -F /var/www/app/tmp/logs/cron.log &

chmod +r /var/www/app/Console/Scripts/*.*

# Apache start
: "${APACHE_PID_FILE:=${APACHE_RUN_DIR:=/var/run/apache2}/apache2.pid}"
rm -f "$APACHE_PID_FILE"

source /etc/apache2/envvars
tail -F /var/log/apache2/* &
exec apache2 -DFOREGROUND

