
WITH CTS AS 
( 
  SELECT B.nome,CT.* FROM classificacao_tarefas AS CT

  LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id
  LEFT JOIN biomas AS B ON B.id = C.bioma_id

  WHERE 
--  C.colecao_id = 4 AND
    CT.status = 1 AND
    CT.modified < (now() - interval '1 days') AND
    CT.id IN (609962,123123)
  
  ORDER BY CT.modified DESC
)

SELECT CTS.id, CTS.* FROM CTS


WITH CTS AS ( 
  SELECT CT.id FROM classificacao_tarefas AS CT 
  LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id 
  LEFT JOIN biomas AS B ON B.id = C.bioma_id 
  WHERE 
    CT.status = 1 AND 
    CT.fase = 1 AND 
    CT.modified < (now() - interval '1 days') AND 
    CT.id IN (601506,601505,601504,601503,601502,601473,601472,601471,601470,601469)
) 
UPDATE classificacao_tarefas SET status = 2, modified = current_timestamp 
WHERE id IN (SELECT CTS.id FROM CTS)
