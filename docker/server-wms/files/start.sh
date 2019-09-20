#!/bin/bash

a2enmod rewrite
a2enmod cgi

#WMS
ln -s /var/www/app/Vendor/MapServer /usr/lib/cgi-bin/wms
ln -s /var/www/app/Vendor/MapServer /usr/lib/cgi-bin/wms-c2

# Apache start
: "${APACHE_PID_FILE:=${APACHE_RUN_DIR:=/var/run/apache2}/apache2.pid}"
rm -f "$APACHE_PID_FILE"

source /etc/apache2/envvars
tail -F /var/log/apache2/* &
exec apache2 -DFOREGROUND
