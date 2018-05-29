
DELETE FROM estados;

DELETE FROM municipios;

DELETE FROM territorios;

DELETE FROM estatisticas;
ALTER SEQUENCE estatisticas_id_seq RESTART;

DELETE FROM estatistica_transicoes;
ALTER SEQUENCE estatistica_transicoes_id_seq RESTART;

DELETE FROM classe_areas;
ALTER SEQUENCE classe_areas_id_seq RESTART;

DELETE FROM colecoes;
ALTER SEQUENCE colecoes_id_seq RESTART;

DELETE FROM cartas;
ALTER SEQUENCE cartas_id_seq RESTART;

--DELETE FROM biomas;
--ALTER SEQUENCE biomas_id_seq RESTART;

DELETE FROM classificacao_tarefas;
ALTER SEQUENCE classificacao_tarefas_id_seq RESTART;

DELETE FROM classificacoes;
ALTER SEQUENCE classificacoes_id_seq RESTART;

DELETE FROM classificacao_usuarios;
ALTER SEQUENCE classificacao_usuarios_id_seq RESTART;

DELETE FROM decision_trees;
ALTER SEQUENCE decision_trees_id_seq RESTART;

DELETE FROM usuario_biomas;
ALTER SEQUENCE usuario_biomas_id_seq RESTART;

DELETE FROM usuarios;
ALTER SEQUENCE usuarios_id_seq RESTART;