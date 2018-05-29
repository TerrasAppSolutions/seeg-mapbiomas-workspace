

SELECT * 
FROM classificacoes AS C
WHERE 
C.bioma_id = 1 AND
C.colecao_id = 3 AND
C.versao_final = TRUE AND
CAST(C.year AS integer) >= 2000 AND
CAST(C.year AS integer) <= 2016 AND
C.decision_tree_id = 296 


UPDATE classificacoes 
SET 
decision_tree_id = 300,
dtv = '{"1-1":30,"2-1":80,"3-1":180,"3-2":90,"4-1":50,"4-2":165,"5-4":110,"5-2":60}'

WHERE 
bioma_id = 1 AND
colecao_id = 3 AND
versao_final = TRUE AND
CAST(year AS integer) >= 2000 AND
CAST(year AS integer) <= 2016 AND
decision_tree_id = 296 


--- ===========================

SELECT * 
FROM classificacoes AS C
WHERE 
C.bioma_id = 1 AND
C.colecao_id = 3 AND
C.versao_final = TRUE AND
CAST(C.year AS integer) >= 2000 AND
CAST(C.year AS integer) <= 2016 AND
C.decision_tree_id = 297


UPDATE classificacoes 
SET 
decision_tree_id = 301,
dtv = '{"1-1":30,"2-1":80,"3-1":180,"3-2":90,"4-1":50,"4-2":165,"5-4":110}'

WHERE 
bioma_id = 1 AND
colecao_id = 3 AND
versao_final = TRUE AND
CAST(year AS integer) >= 2000 AND
CAST(year AS integer) <= 2016 AND
decision_tree_id = 297 