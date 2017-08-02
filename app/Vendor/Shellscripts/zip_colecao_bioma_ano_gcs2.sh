#!/bin/bash

# Executar comando no diretorio da coleção

BIOMAS="PAMPA PANTANAL MATAATLANTICA CAATINGA CERRADO AMAZONIA"

ANOS="2008 2009 2010 2011 2012 2013 2014 2015"

for BIOMA in $BIOMAS
do
        for ANO in $ANOS
        do
                find INTEGRACAO/BIOMA/$BIOMA -name "*$ANO*.tif" -print | zip -Drj9 GROUPZIP/CONSOLIDACAO_${BIOMA}_${ANO}.zip -@   
                find CLASSIFICACAOFT/BIOMA/$BIOMA -name "*$ANO*.tif" -print | zip -Drj9 GROUPZIP/CLASSIFICACAOFT_${BIOMA}_${ANO}.zip -@   
                find CLASSIFICACAO/BIOMA/$BIOMA -name "*$ANO*.tif" -print | zip -Drj9 GROUPZIP/CLASSIFICACAO_${BIOMA}_${ANO}.zip -@   

                cp -v GROUPZIP/CONSOLIDACAO_${BIOMA}_${ANO}.zip /gcstorage/mapbiomas-group/COLECAO/BIOMA_ANO_ZIP2/CONSOLIDACAO_${BIOMA}_${ANO}.zip
                cp -v GROUPZIP/CLASSIFICACAOFT_${BIOMA}_${ANO}.zip /gcstorage/mapbiomas-group/COLECAO/BIOMA_ANO_ZIP2/CLASSIFICACAOFT_${BIOMA}_${ANO}.zip
                cp -v GROUPZIP/CLASSIFICACAO_${BIOMA}_${ANO}.zip /gcstorage/mapbiomas-group/COLECAO/BIOMA_ANO_ZIP2/CLASSIFICACAO_${BIOMA}_${ANO}.zip

        done
   
done

# Zona Costeira

BIOMAS="ZONACOSTEIRA"

ANOS="2008 2009 2010 2011 2012 2013 2014 2015"

for BIOMA in $BIOMAS
do
        for ANO in $ANOS
        do
                find INTEGRACAO/BIOMA/$BIOMA -name "*$ANO*.tif" -print | zip -Drj9 GROUPZIP/CONSOLIDACAO_${BIOMA}_${ANO}.zip -@   
                find CLASSIFICACAOFT/BIOMA/$BIOMA -name "*$ANO*.tif" -print | zip -Drj9 GROUPZIP/CLASSIFICACAOFT_${BIOMA}_${ANO}.zip -@   
                find CLASSIFICACAO/BIOMA/$BIOMA -name "*$ANO*.tif" -print | zip -Drj9 GROUPZIP/CLASSIFICACAO_${BIOMA}_${ANO}.zip -@   

                cp -v GROUPZIP/CONSOLIDACAO_${BIOMA}_${ANO}.zip /gcstorage/mapbiomas-group/COLECAO/BIOMA_ANO_ZIP2/CONSOLIDACAO_${BIOMA}_${ANO}.zip
                cp -v GROUPZIP/CLASSIFICACAOFT_${BIOMA}_${ANO}.zip /gcstorage/mapbiomas-group/COLECAO/BIOMA_ANO_ZIP2/CLASSIFICACAOFT_${BIOMA}_${ANO}.zip
                cp -v GROUPZIP/CLASSIFICACAO_${BIOMA}_${ANO}.zip /gcstorage/mapbiomas-group/COLECAO/BIOMA_ANO_ZIP2/CLASSIFICACAO_${BIOMA}_${ANO}.zip

        done
   
done

