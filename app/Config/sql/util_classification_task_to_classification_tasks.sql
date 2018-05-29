
 --- fase 0 para fase 1 -----------

INSERT INTO classificacao_tarefas (		
		classificacao_id,
		tarefa_id,
		fase,
		status,		
		created,
		modified
	) 

SELECT 
  	CTS.classificacao_id AS classificacao_id,
    CTS.id AS tarefa_id,
		1 AS fase,
		0 AS status,
		current_timestamp AS created, -- ClassifSource.created,
		current_timestamp AS modified -- ClassifSource.modified,		

FROM classificacao_tarefas AS CTS
LEFT JOIN classificacoes AS CS ON CS.id = CTS.classificacao_id

WHERE
  CS.colecao_id = 4 AND  
  CTS.fase = 0 AND  
  CTS.status = 2 AND    
  CTS.classificacao_id NOT IN 
  (
   SELECT CT.classificacao_id
   FROM
    classificacao_tarefas AS CT
   LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id
   WHERE    
    CT.fase = 1
  ) 

---- fase 1 para fase 2 ------------

INSERT INTO classificacao_tarefas (		
		classificacao_id,
		tarefa_id,
		fase,
		status,		
		created,
		modified
	) 
SELECT 
 CTS.classificacao_id AS classificacao_id,
 CTS.id AS tarefa_id,
 2 AS fase,
 0 AS status,
 current_timestamp AS created, -- ClassifSource.created,
 current_timestamp AS modified -- ClassifSource.modified

FROM classificacao_tarefas AS CTS
LEFT JOIN classificacoes AS CS ON CS.id = CTS.classificacao_id

WHERE
  CS.colecao_id = 4 AND
  CTS.fase = 1 AND  
  CTS.status = 2 AND
  CTS.gee_asset_verificacao = 1 AND
  CS.id  NOT IN 
  (
   SELECT C.id
   FROM
    classificacao_tarefas AS CT
   LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id
   WHERE    
    C.colecao_id = 4 AND
    CT.fase = 2
  ) 

---- fase 2 para fase 3 ------------

INSERT INTO classificacao_tarefas (		
		classificacao_id,
		tarefa_id,
		fase,
		status,		
		created,
		modified
	) 
SELECT 
 CTS.classificacao_id AS classificacao_id,
 CTS.id AS tarefa_id,
 3 AS fase,
 0 AS status,
 current_timestamp AS created, -- ClassifSource.created,
 current_timestamp AS modified -- ClassifSource.modified

FROM classificacao_tarefas AS CTS
LEFT JOIN classificacoes AS CS ON CS.id = CTS.classificacao_id

WHERE
  CS.colecao_id = 4 AND
  CTS.fase = 2 AND  
  CTS.status = 2 AND
  CTS.gee_asset_verificacao = 1 AND
  CS.id  NOT IN 
  (
   SELECT C.id
   FROM
    classificacao_tarefas AS CT
   LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id
   WHERE    
    C.colecao_id = 4 AND
    CT.fase = 3
  ) 
  
