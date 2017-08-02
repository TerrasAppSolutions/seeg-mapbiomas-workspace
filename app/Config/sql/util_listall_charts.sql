
SELECT B.nome , C.year,CA.codigo, CR.regiao

FROM classificacoes AS C

LEFT JOIN biomas AS B ON B.id = C.bioma_id
LEFT JOIN cartas AS CA ON CA.id = C.carta_id
LEFT JOIN carta_regioes AS CR ON CR.id = C.regiao_id

WHERE  
 CAST(C.year as integer) >= 2000 AND 
CAST(C.year as integer) <= 2016

GROUP BY B.id, B.nome, C.year, CA.codigo, CR.regiao
ORDER BY B.id, C.year, CA.codigo


----------


SELECT B.nome , COUNT(CA.id)

FROM classificacoes AS C

LEFT JOIN biomas AS B ON B.id = C.bioma_id
LEFT JOIN cartas AS CA ON CA.id = C.carta_id
LEFT JOIN carta_regioes AS CR ON CR.id = C.regiao_id

WHERE
C.colecao_id = 4 AND  
CAST(C.year as integer) >= 2000 AND 
CAST(C.year as integer) <= 2016

GROUP BY B.id, B.nome
ORDER BY B.id

AMAZONIA	
4987
MATA ATLANTICA	
2074
PANTANAL	
493
CERRADO	
3038
CAATINGA	
1156
PAMPA	
672