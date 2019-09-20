# MapBiomas Workspace

## Atualizando o repositorio git para o gitlab

Acessar o diretório que contém os arquivos:

    git remote set-url origin git@gitlab.terras.agr.br:mapbiomas/workspace.git    

Problemas que podem ocorrer
============================
Banco de dados não importado

Permissão (sudo chmod -R 777 *) (app/tmp/cache/models)

hosts não configurado (sudo nano /etc/hosts -> ip_docker_web    workspace.localhost)

Ajude de Comandos
============================

Criar bando de dados de desenvolvimento
-----------------------------------------
    createdb -U postgres -h localhost dev_mapbiomas -T mapbiomas

Backup Banco de dados
-----------------------------------------

    docker exec -it mapbiomas-server-db bash

    pg_dump -h localhost -U postgres -d mapbiomas > /mnt/disks/data/arquivos/databasebkps/mapbiomas_20180115.sql

Exit container (ctrl + d)

    gsutil cp /data/arquivos/databasebkps/mapbiomas_20180115.sql gs://mapbiomas-data/brasil/db_bkps/mapbiomas_20180115.sql


Importação do banco ou tabela
-----------------------------------------
Is possible to switch psql to "stop on first error" mode and to find error: (psql -v ON_ERROR_STOP=1)

    psql -U postgres -h localhost mapbiomas < brasil_territorio.sql  

Exportação de banco para uma determinada tabela
---------------------------------------------------

Exportando CSV:
    psql -h localhost -U postgres -d dev_mapbiomas_col_3 -c "COPY <table_name> TO stdout DELIMITER ',' CSV HEADER;" > /mnt/disks/data/bkp_tables/assets.csv
    
    Ex.: psql -h localhost -U postgres -d dev_mapbiomas_col_3 -c "COPY estatistica_cobertura_infrabuffer TO stdout DELIMITER ',' CSV HEADER;" > estatistica_cobertura_infrabuffer-utf8.csv

    ex: psql -h localhost -U postgres -d dev_mapbiomas_col_3 -c "COPY estatistica_cobertura_infrabuffer TO stdout DELIMITER ',' CSV HEADER;" > estatistica_cobertura_infrabuffer.csv

Classes:

    pg_dump -h localhost -U postgres -d mapbiomas --column-inserts --table="classes" --data-only > /mnt/disks/data/classes.sql

Estatistica:

    Somente dados
    pg_dump -h localhost -U postgres -d mapbiomas -t estatisticas -a > /mnt/disks/data/arquivos/databasebkps/mapbiomas_20170425_estatisticas.sql
    
    Somente tabela + dados
    pg_dump -h localhost -U postgres -d mapbiomas -t estatisticas > /mnt/disks/data/arquivos/databasebkps/mapbiomas_20170425_estatisticas.sql

Territorios

    pg_dump -h localhost -U postgres -d mapbiomas -t territorios > /mnt/disks/data/arquivos/databasebkps/territorios_20180115.sql


Copiar arquivos para Google Cloud Storage:
------------------------------------------

    gsutil cp /data/arquivos/databasebkps/mapbiomas_v2_20171213.sql gs://mapbiomas-data/brasil/db_bkps/mapbiomas_v2_20171213.sql


Baixar arquivo do servidor via ssh usando scp

    scp root@104.196.9.9:/data/arquivos/databasebkps/territorios_20180115.sql ./


Importando shapefile
-------------------------------------------
    
    shp2pgsql -s 4326 biomas.shp public.territorio_biomas | psql -U postgres -d mapbiomas


Tradução de classes
-------------------------------------------

Arquivo classes_en.json

dense forest -> forest formations
open forest -> savana formations 


Carta-Regiao-Raisg
--------------------------------------------

Conversão de CSV para SQL (https://codebeautify.org/csv-to-sql-converter)

Importação Base Imaflora
--------------------------------------------

```
drop table if exists imaflora_landure_introFields;
CREATE TABLE imaflora_landure_introFields
(
    id serial PRIMARY KEY,
    Value numeric, 
    Count numeric,
    cd_mun numeric,
    nm_mun varchar,
    cd_micro numeric,
    nm_micro varchar,
    cd_meso numeric,
    nm_meso varchar,
    cd_uf int,
    nm_uf varchar,
    nm_region varchar,
    biome varchar,
    country varchar,
    landtenure varchar,
    pc_pl varchar,
    tot_mf numeric,
    pl_size varchar,
    areaHa numeric,
    notprotect numeric,
    lrdeficit numeric,
    appdeficit numeric
);
COPY 
    imaflora_landure_introFields(Value, Count, cd_mun, nm_mun, cd_micro, nm_micro, cd_meso, nm_meso, cd_uf, nm_uf, nm_region, biome, country, landtenure, pc_pl, tot_mf, pl_size, areaHa, notprotect, lrdeficit, appdeficit)
FROM '/mnt/disks/data/mapbiomas_base_car/landtenure_infoFields.csv' DELIMITER ',' CSV HEADER;
```

```
drop table if exists imaflora_estatistica_transicao;
CREATE TABLE imaflora_estatistica_transicao
(
    id serial PRIMARY KEY,
    classe_inicial numeric, 
    classe_final numeric,
    area numeric,
    ano_inicial numeric,
    ano_final numeric,
    territorio numeric,
    created timestamp,
    modified timestamp,
    porcentagem numeric
);
COPY 
    imaflora_estatistica_transicao(classe_inicial, classe_final, area, ano_inicial, ano_final, territorio, created, modified, porcentagem)
FROM '/mnt/disks/data/mapbiomas_base_car/mapbiomas_vs_landtenure_estatistica_transicao.csv' DELIMITER ',' CSV HEADER;
```

Estatísticas Níveis - Mapbiomas (Table)
--------------------------------------------

Sempre que a base de classe ou estatísticas for atualizada

    drop table estatistica_niveis;
    create table estatistica_niveis as 
    SELECT st.classe,
        clsi.valor_l1 AS classe_l1,
        clsi.valor_l2 AS classe_l2,
        clsi.valor_l3 AS classe_l3,
        clsi.classe AS classe_desc,
        st.ano::integer AS ano,
        sum(st.area) AS area,
        st.territorio
    FROM estatisticas st
        LEFT JOIN classes clsi ON clsi.valor = st.classe
    GROUP BY clsi.valor_l1, clsi.valor_l2, clsi.valor_l3, st.classe, clsi.classe, st.ano, st.territorio;

**Materialized view** não funciona com cakephp e phppgadmin (não mostra view criada), apenas as views clássicas


Territorio inspector
--------------------------------------------
    
    CREATE OR REPLACE FUNCTION map_territorio_inspector(cat TEXT, long FLOAT, lat FLOAT)
    RETURNS TABLE (id INT, name VARCHAR, categoria VARCHAR, classe INT, classe_l1 INT, classe_l2 INT, classe_l3 INT, 
                classe_desc VARCHAR, ano INT, area FLOAT) AS $$
    BEGIN

        RETURN QUERY SELECT  t.id, t.descricao, t.categoria, st.classe, st.classe_l1, st.classe_l2, st.classe_l3, st.classe_desc, st.ano, st.area
        FROM    territorios AS t
        LEFT JOIN estatistica_niveis st ON t.id = st.territorio
        WHERE   t.categoria = cat AND st_intersects(t.the_geom, ST_SetSRID(ST_Point(long, lat),4326)); 
    
    END; 
    $$  LANGUAGE plpgsql


CREATE TABLE infrastructure hierarchy
--------------------------------------------

    CREATE TABLE infrastructure_hierarchy AS
    SELECT ROW_NUMBER() OVER (ORDER BY cat1) AS id, cat1, cat2, cat3, cat4, cat5, nome 
    FROM territorios_infra 
    GROUP BY nome, cat1, cat2, cat3, cat4, cat5;