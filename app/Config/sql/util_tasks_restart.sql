
-- restart mosaico exceptions
UPDATE classificacao_tarefas 
SET status = 0
WHERE
fase = 0 AND
status = 3



-- restart consolidation

WITH CTS AS 
( 
  SELECT CT.*
  FROM
   classificacao_tarefas AS CT
  LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id
  WHERE
   (C.colecao_id = 4) AND
   (C.bioma_id = 4) AND
   CT.fase = 1 AND
   CT.status = 3 AND
   CAST(C.year AS integer) >= 2000 AND
   CAST(C.year AS integer) <= 2016 
)

--

UPDATE classificacao_tarefas
SET status = 0
WHERE 
id IN (SELECT CTS.id FROM CTS)

--

DELETE FROM classificacao_tarefas
WHERE 
fase > 1 AND 
classificacao_id IN (SELECT CTS.classificacao_id FROM CTS);


-------- restart fase 3 integração --------------


WITH CTS AS 
 ( 
   SELECT CT.id
   FROM
    classificacao_tarefas AS CT
   LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id
   LEFT JOIN biomas AS B ON B.id = C.bioma_id
   WHERE
    C.colecao_id = 4 AND    
    CT.fase = 3 AND
    CT.status = 3
 )
UPDATE classificacao_tarefas
SET status = 0
WHERE 
id IN (SELECT CTS.id FROM CTS)


---================


WITH CTS AS 
 ( 
   SELECT CT.id
   FROM
    classificacao_tarefas AS CT
   LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id
   LEFT JOIN biomas AS B ON B.id = C.bioma_id
   LEFT JOIN cartas AS CA ON CA.id = C.carta_id
   WHERE
    C.colecao_id = 4 AND    
    C.bioma_id = 2 AND    
    CT.fase = 3 AND
    ((CA.codigo = 'SD-24-V-C' AND C.year = '2001' AND C.bioma_id = 2 )  OR    
    (CA.codigo = 'SH-22-V-A' AND C.year = '2004' AND C.bioma_id = 2 )  OR
    (CA.codigo = 'SF-21-Z-D' AND C.year = '2004' AND C.bioma_id = 2 )  OR
    (CA.codigo = 'SE-22-Y-D' AND C.year = '2004' AND C.bioma_id = 2 )  OR
    (CA.codigo = 'SF-22-X-A' AND C.year = '2004' AND C.bioma_id = 2 )  OR    
    (CA.codigo = 'SB-25-V-C' AND C.year = '2006' AND C.bioma_id = 2 )  OR
    (CA.codigo = 'SF-23-X-D' AND C.year = '2006' AND C.bioma_id = 2 )  OR    
    (CA.codigo = 'SE-22-Z-A' AND C.year = '2008' AND C.bioma_id = 2 )  OR
    (CA.codigo = 'SF-23-Y-D' AND C.year = '2008' AND C.bioma_id = 2 )  OR    
    (CA.codigo = 'SE-23-Y-A' AND C.year = '2009' AND C.bioma_id = 2 )  OR    
    (CA.codigo = 'SH-21-X-D' AND C.year = '2011' AND C.bioma_id = 2 )  OR
    (CA.codigo = 'SF-22-V-B' AND C.year = '2015' AND C.bioma_id = 2 )  OR
    (CA.codigo = 'SE-24-V-C' AND C.year = '2015' AND C.bioma_id = 2 ))    
 )
UPDATE classificacao_tarefas
SET status = 0
WHERE 
id IN (SELECT CTS.id FROM CTS)
