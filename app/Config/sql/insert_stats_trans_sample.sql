INSERT INTO estatistica_exportacoes (
    id,
	carta,
    territorio,
    ano_inicial,
    ano_final,
 	classe_inicial,
    classe_final,
    classe,
    area_km2
) 

SELECT 
    uuid_in(md5(random()::text || clock_timestamp()::text)::cstring) AS id,
 	'TE-ST-EE' AS carta,
    STS.territorio AS territorio,
    STS.ano_inicial::integer AS ano_inicial,
    STS.ano_final::integer AS ano_final,
 	STS.classe_inicial AS classe_inicial,
    STS.classe_final AS classe_final,
    (STS.classe_inicial::text || '-' || STS.classe_final::text) AS classe,
    (STS.area/3) AS area_km2

FROM estatistica_transicoes AS STS;

INSERT INTO estatistica_exportacoes (
    id,
	carta,
    territorio,
    ano_inicial,
    ano_final,
 	classe_inicial,
    classe_final,
    classe,
    area_km2
) 

SELECT 
    uuid_in(md5(random()::text || clock_timestamp()::text)::cstring) AS id,
 	'TE-ST-EE' AS carta,
    STS.territorio AS territorio,
    STS.ano_inicial::integer AS ano_inicial,
    STS.ano_final::integer AS ano_final,
 	STS.classe_inicial AS classe_inicial,
    STS.classe_final AS classe_final,
    (STS.classe_inicial::text || '-' || STS.classe_final::text) AS classe,
    (STS.area/3) AS area_km2

FROM estatistica_transicoes AS STS;

INSERT INTO estatistica_exportacoes (
    id,
	carta,
    territorio,
    ano_inicial,
    ano_final,
 	classe_inicial,
    classe_final,
    classe,
    area_km2
) 

SELECT 
    uuid_in(md5(random()::text || clock_timestamp()::text)::cstring) AS id,
 	'TE-ST-EE' AS carta,
    STS.territorio AS territorio,
    STS.ano_inicial::integer AS ano_inicial,
    STS.ano_final::integer AS ano_final,
 	STS.classe_inicial AS classe_inicial,
    STS.classe_final AS classe_final,
    (STS.classe_inicial::text || '-' || STS.classe_final::text) AS classe,
    (STS.area/3) AS area_km2

FROM estatistica_transicoes AS STS;

update estatistica_exportacoes set classe_inicial = 27 where classe_inicial = 0;
update estatistica_exportacoes set classe_final = 27 where classe_final = 0;