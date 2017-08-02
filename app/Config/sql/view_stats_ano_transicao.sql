-- DROP VIEW estatistica_transicoes_resumo;
-- CREATE VIEW estatistica_transicoes_resumo AS

SELECT
T.categoria AS "Categoria",
T.descricao AS "Unidade Geográfica",
CI.classe AS "Classe Ano 1",
CF.classe AS "Classe Ano 2",

(SELECT replace(replace(replace(to_char((ET_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2008-2009 (hec)" FROM estatistica_transicoes AS ET_ano WHERE ET_ano.ano_inicial = '2008' AND ET_ano.ano_final = '2009' AND ET_ano.classe_inicial = ET.classe_inicial AND ET_ano.classe_final = ET.classe_final AND ET_ano.territorio = ET.territorio),
(SELECT replace(replace(replace(to_char((ET_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2009-2010 (hec)" FROM estatistica_transicoes AS ET_ano WHERE ET_ano.ano_inicial = '2009' AND ET_ano.ano_final = '2010' AND ET_ano.classe_inicial = ET.classe_inicial AND ET_ano.classe_final = ET.classe_final AND ET_ano.territorio = ET.territorio),
(SELECT replace(replace(replace(to_char((ET_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2010-2011 (hec)" FROM estatistica_transicoes AS ET_ano WHERE ET_ano.ano_inicial = '2010' AND ET_ano.ano_final = '2011' AND ET_ano.classe_inicial = ET.classe_inicial AND ET_ano.classe_final = ET.classe_final AND ET_ano.territorio = ET.territorio),
(SELECT replace(replace(replace(to_char((ET_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2011-2012 (hec)" FROM estatistica_transicoes AS ET_ano WHERE ET_ano.ano_inicial = '2011' AND ET_ano.ano_final = '2012' AND ET_ano.classe_inicial = ET.classe_inicial AND ET_ano.classe_final = ET.classe_final AND ET_ano.territorio = ET.territorio),
(SELECT replace(replace(replace(to_char((ET_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2012-2013 (hec)" FROM estatistica_transicoes AS ET_ano WHERE ET_ano.ano_inicial = '2012' AND ET_ano.ano_final = '2013' AND ET_ano.classe_inicial = ET.classe_inicial AND ET_ano.classe_final = ET.classe_final AND ET_ano.territorio = ET.territorio),
(SELECT replace(replace(replace(to_char((ET_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2013-2014 (hec)" FROM estatistica_transicoes AS ET_ano WHERE ET_ano.ano_inicial = '2013' AND ET_ano.ano_final = '2014' AND ET_ano.classe_inicial = ET.classe_inicial AND ET_ano.classe_final = ET.classe_final AND ET_ano.territorio = ET.territorio),
(SELECT replace(replace(replace(to_char((ET_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2014-2015 (hec)" FROM estatistica_transicoes AS ET_ano WHERE ET_ano.ano_inicial = '2014' AND ET_ano.ano_final = '2015' AND ET_ano.classe_inicial = ET.classe_inicial AND ET_ano.classe_final = ET.classe_final AND ET_ano.territorio = ET.territorio)

FROM estatistica_transicoes AS ET

LEFT JOIN territorios AS T ON T.id = ET.territorio
LEFT JOIN classes AS CI ON CI.id = ET.classe_inicial
LEFT JOIN classes AS CF ON CF.id = ET.classe_final

-- WHERE T.categoria = 'Estado' OR T.categoria = 'Bioma' 

GROUP BY ET.territorio, T.id, ET.classe_inicial, CI.classe, ET.classe_final, CF.classe

ORDER BY T.id ASC, CI.classe ASC

-- LIMIT 1