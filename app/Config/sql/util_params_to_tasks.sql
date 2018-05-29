

INSERT INTO classificacao_tarefas (		
		classificacao_id,
		fase,
		status,
		log,		
		created,
		modified
	) 

SELECT 
  		C.id AS classificacao_id,
		3 AS fase,  -- Definir id da fase
		0 AS status, -- Definir id do status da fase
		'pampa_borda' AS log,
		current_timestamp AS created, -- ClassificacaoParam.created,
		current_timestamp AS modified -- ClassificacaoParam.modified,		

FROM classificacoes AS C
LEFT JOIN biomas AS B ON B.id = C.bioma_id
LEFT JOIN cartas AS CA ON CA.id = C.carta_id

WHERE    
(B.nome = 'AMAZONIA'    AND CA.codigo = 'SA-22-Y-C' AND C.year = '2007' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-21-Y-B' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-21-Z-A' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-21-V-D' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-21-X-C' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-22-Z-A' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SI-22-V-C' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-21-X-A' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-22-X-C' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-21-X-B' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-21-Z-C' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-21-Z-D' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SI-22-V-A' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-22-Y-C' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SI-22-V-B' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-22-Y-D' AND C.colecao_id = 4) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-22-Z-C' AND C.colecao_id = 4) 

ORDER BY ClassificacaoParam.year ASC
