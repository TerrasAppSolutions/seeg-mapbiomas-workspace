

INSERT INTO classificacoes (
		carta_id,
		bioma_id,
		year,
		t0,
		t1,
		cloudcover,
		sensor,
		tag_on,
		ndfi,
		sma,
		ref,
		dt,
		save,
		color,
		elevation_on,
		elevation_min,
		elevation_max,
		region,
		created,
		modified,
		identificador,
		versao,
		versao_final,
		regiao_id,
		decision_tree_id,
		dtv,
		colecao_id		
	) 

SELECT 
  		ClassifSource.carta_id,
		ClassifSource.bioma_id,
		ClassifSource.year,
		ClassifSource.t0,
		ClassifSource.t1,
		ClassifSource.cloudcover,
		ClassifSource.sensor,
		ClassifSource.tag_on,
		ClassifSource.ndfi,
		ClassifSource.sma,
		ClassifSource.ref,
		ClassifSource.dt,
		ClassifSource.save,
		ClassifSource.color,
		ClassifSource.elevation_on,
		ClassifSource.elevation_min,
		ClassifSource.elevation_max,
		ClassifSource.region,
		current_timestamp AS created, -- ClassifSource.created,
		current_timestamp AS modified, -- ClassifSource.modified,
		ClassifSource.identificador,
		ClassifSource.versao,
		ClassifSource.versao_final,
		ClassifSource.regiao_id,
		184 AS decision_tree_id, -- ClassifSource.decision_tree_id,		
		ClassifSource.dtv,
		3 AS colecao_id -- ClassifSource.colecao_id,				

FROM classificacoes AS ClassifSource

WHERE
  CAST(ClassifSource.year AS integer) >= 2008 AND
  CAST(ClassifSource.year AS integer) <= 2015 AND
  ClassifSource.versao_final = TRUE  AND
  ClassifSource.bioma_id = 1

ORDER BY ClassifSource.year ASC
