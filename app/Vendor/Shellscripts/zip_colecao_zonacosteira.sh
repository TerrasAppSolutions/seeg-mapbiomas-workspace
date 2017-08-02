# Zona Costeira

BIOMAS="PAMPA PANTANAL MATAATLANTICA CAATINGA CERRADO AMAZONIA"
BIOMA_ZC="ZONACOSTEIRA"

ANOS="2008 2009 2010 2011 2012 2013 2014 2015"
CARTAS="NA-22-V-B NA-22-V-D NA-22-X-A NA-22-X-C NA-22-Z-A NA-22-Z-C NA-22-Z-D NB-22-Y-D SA-22-X-A SA-22-X-B SA-22-X-C SA-22-X-D SA-23-V-A SA-23-V-B SA-23-V-C SA-23-V-D SA-23-X-C SA-23-Z-A SA-23-Z-B SA-23-Z-C SA-24-Y-A SA-24-Y-B SA-24-Y-C SA-24-Y-D SA-24-Z-C SB-24-X-A SB-24-X-B SB-24-X-D SB-25-V-C SB-25-Y-A SB-25-Y-C SC-24-Z-B SC-24-Z-C SC-24-Z-D SC-25-V-C SD-24-V-D SD-24-X-A SD-24-X-C SD-24-Y-B SD-24-Y-D SD-24-Z-A SD-24-Z-C SE-24-V-B SE-24-V-D  SE-24-X-A SE-24-Y-B SE-24-Y-D SF-23-Y-D SF-23-Z-A SF-23-Z-B SF-23-Z-C SF-23-Z-D SF-24-V-A SF-24-Y-A SG-22-X-D SG-22-Z-B SG-22-Z-D SG-23-V-A SG-23-V-B SG-23-V-C SH-22-X-B SH-22-X-C SH-22-X-D"

for BIOMA in $BIOMAS
do	
	for ANO in $ANOS
	do
		for CARTA in $CARTAS
		do		
		        find INTEGRACAO/BIOMA/$BIOMA -name "*$CARTA*_*$ANO*.tif" -print | zip -Drj9 GROUPZIP/CONSOLIDACAO_${BIOMA_ZC}_${ANO}.zip -@   
		        
        	done
	done   
done

for ANO in $ANOS
do
	find CLASSIFICACAOFT/BIOMA/$BIOMA_ZC -name "*$BIOMA_ZC*$ANO*.tif" -print | zip -Drj9 GROUPZIP/CLASSIFICACAOFT_${BIOMA_ZC}_${ANO}.zip -@   
	find CLASSIFICACAO/BIOMA/$BIOMA_ZC -name "*$BIOMA_ZC*$ANO*.tif" -print | zip -Drj9 GROUPZIP/CLASSIFICACAO_${BIOMA_ZC}_${ANO}.zip -@   

	cp -v GROUPZIP/CONSOLIDACAO_${BIOMA_ZC}_${ANO}.zip /gcstorage/mapbiomas-group/COLECAO/BIOMA_ANO_ZIP/CONSOLIDACAO_${BIOMA_ZC}_${ANO}.zip
	cp -v GROUPZIP/CLASSIFICACAOFT_${BIOMA_ZC}_${ANO}.zip /gcstorage/mapbiomas-group/COLECAO/BIOMA_ANO_ZIP/CLASSIFICACAOFT_${BIOMA_ZC}_${ANO}.zip
	cp -v GROUPZIP/CLASSIFICACAO_${BIOMA_ZC}_${ANO}.zip /gcstorage/mapbiomas-group/COLECAO/BIOMA_ANO_ZIP/CLASSIFICACAO_${BIOMA_ZC}_${ANO}.zip

done
