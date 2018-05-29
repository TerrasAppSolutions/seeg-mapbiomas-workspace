
DELETE FROM classificacao_tarefas WHERE fase = 2 OR fase = 3;

INSERT INTO classificacao_tarefas (classificacao_id,fase,status,tarefa_id,created) 

SELECT 
  classificacao_id, 2 AS fase, 0 AS status, id, modified

FROM classificacao_tarefas

WHERE
  fase = 1 AND
  status = 2

-- falta incluir sql que reinicia a sequencia;


  


