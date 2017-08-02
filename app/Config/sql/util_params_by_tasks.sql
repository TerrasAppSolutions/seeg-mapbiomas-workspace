WITH CS AS 
 ( 
   SELECT 
   DISTINCT C.id   
   FROM classificacoes AS C
   
   LEFT JOIN classificacao_tarefas AS CT ON C.id = CT.classificacao_id
   LEFT JOIN biomas AS B ON B.id = C.bioma_id
   
   WHERE
    C.bioma_id = 1 AND
    C.colecao_id = 4 AND
    CT.fase = 0 AND
    CT.status = 0
 )
--SELECT * FROM CS
UPDATE classificacoes
SET 
 t0 = date(year || '-06-01'),
 t1 = date(year || '-10-30'),
 cloudcover = 30 
WHERE 
id IN (SELECT CS.id FROM CS)



