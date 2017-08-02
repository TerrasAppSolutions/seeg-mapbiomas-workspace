-- DROP VIEW estatisticas_resumo;
-- CREATE VIEW estatisticas_resumo AS
SELECT
T.categoria AS "Categoria",
T.descricao AS "Unidade Geográfica",
C.classe AS "Classes",
(SELECT replace(replace(replace(to_char((E_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2008 (hec)" FROM estatisticas AS E_ano WHERE E_ano.ano = '2008' AND E_ano.classe = E.classe AND E_ano.territorio = E.territorio),
(SELECT replace(replace(replace(to_char((E_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2009 (hec)" FROM estatisticas AS E_ano WHERE E_ano.ano = '2009' AND E_ano.classe = E.classe AND E_ano.territorio = E.territorio),
(SELECT replace(replace(replace(to_char((E_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2010 (hec)" FROM estatisticas AS E_ano WHERE E_ano.ano = '2010' AND E_ano.classe = E.classe AND E_ano.territorio = E.territorio),
(SELECT replace(replace(replace(to_char((E_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2011 (hec)" FROM estatisticas AS E_ano WHERE E_ano.ano = '2011' AND E_ano.classe = E.classe AND E_ano.territorio = E.territorio),
(SELECT replace(replace(replace(to_char((E_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2012 (hec)" FROM estatisticas AS E_ano WHERE E_ano.ano = '2012' AND E_ano.classe = E.classe AND E_ano.territorio = E.territorio),
(SELECT replace(replace(replace(to_char((E_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2013 (hec)" FROM estatisticas AS E_ano WHERE E_ano.ano = '2013' AND E_ano.classe = E.classe AND E_ano.territorio = E.territorio),
(SELECT replace(replace(replace(to_char((E_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2014 (hec)" FROM estatisticas AS E_ano WHERE E_ano.ano = '2014' AND E_ano.classe = E.classe AND E_ano.territorio = E.territorio),
(SELECT replace(replace(replace(to_char((E_ano.area/10000),'9,999,999,999,999,999.99999'),'.',';'),',','.'),';',',') AS "2015 (hec)" FROM estatisticas AS E_ano WHERE E_ano.ano = '2015' AND E_ano.classe = E.classe AND E_ano.territorio = E.territorio)

FROM estatisticas AS E

LEFT JOIN territorios AS T ON T.id = E.territorio
LEFT JOIN classes AS C ON C.id = E.classe

--WHERE T.categoria = 'Estado' OR T.categoria = 'Bioma' 

GROUP BY E.territorio, T.id, E.classe, C.classe

ORDER BY T.id ASC, C.classe ASC

-- LIMIT 1