SELECT 
 B.nome AS biome,
 CT.id AS task_id,
 CA.codigo AS grid,
 C.year::integer AS year,
 C.t0 AS t0,
 C.t1 AS t1,
 CASE 
  WHEN  CR.regiao IS NULL THEN '0'
  ELSE upper(CR.regiao)
 END,
 C.dtv AS dtv,
 DT.dtree AS dt

FROM classificacao_tarefas AS CT
LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id
LEFT JOIN biomas AS B ON B.id = C.bioma_id
LEFT JOIN cartas AS CA ON CA.id = C.carta_id
LEFT JOIN decision_trees AS DT ON DT.id = C.decision_tree_id
LEFT JOIN carta_regioes AS CR ON CR.id = C.regiao_id

WHERE 
 B.nome = 'PAMPA' AND
 C.colecao_id = 4 AND
 CT.fase = 1 AND
 CT.status = 0
  
ORDER BY CT.created ASC

LIMIT 5



