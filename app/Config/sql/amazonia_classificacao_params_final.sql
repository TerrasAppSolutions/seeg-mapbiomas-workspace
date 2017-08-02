SELECT 
BI.nome bioma, CA.codigo carta, CL.year ano, CL.t0 t0, CL.t1 t1, 
CL.cloudcover cobertura_nuvem, 
dtv::json->'dtv1' dtv1,dtv::json->'dtv2' dtv2,dtv::json->'dtv3' dtv3, dtv::json->'dtv4' dtv4, 
CL.sensor sensor

FROM classificacoes AS CL

LEFT JOIN biomas AS BI ON BI.id = CL.bioma_id
LEFT JOIN cartas AS CA ON CA.id = CL.carta_id

WHERE CL.bioma_id = 1 AND CL.versao_final = TRUE

ORDER BY BI.nome ASC, CA.codigo ASC, CL.year ASC