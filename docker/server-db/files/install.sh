#!/bin/bash
sudo -u postgres createdb template_postgis
sudo -u postgres psql -d template_postgis -f /usr/share/postgresql/9.3/contrib/postgis-2.1/postgis.sql
sudo -u postgres psql -d template_postgis -f /usr/share/postgresql/9.3/contrib/postgis-2.1/spatial_ref_sys.sql
sudo -u postgres psql -d template_postgis -f /usr/share/postgresql/9.3/contrib/postgis-2.1/postgis_comments.sql
sudo -u postgres psql -d template_postgis -f /usr/share/postgresql/9.3/contrib/postgis-2.1/rtpostgis.sql
sudo -u postgres psql -d template_postgis -f /usr/share/postgresql/9.3/contrib/postgis-2.1/raster_comments.sql
sudo -u postgres psql -d template_postgis -f /usr/share/postgresql/9.3/contrib/postgis-2.1/topology.sql
sudo -u postgres psql -d template_postgis -f /usr/share/postgresql/9.3/contrib/postgis-2.1/topology_comments.sql