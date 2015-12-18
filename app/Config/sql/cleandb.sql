DELETE FROM "public"."biomas";
DELETE FROM "public"."cartas";
DELETE FROM "public"."classificacoes";	
DELETE FROM "public"."classificacao_imagens";	

ALTER SEQUENCE biomas_id_seq RESTART; 
ALTER SEQUENCE cartas_id_seq RESTART; 
ALTER SEQUENCE classificacoes_id_seq RESTART; 
ALTER SEQUENCE classificacao_imagens_id_seq RESTART; 

