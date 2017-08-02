DROP VIEW estatistica_niveis;
CREATE VIEW estatistica_niveis AS

(
SELECT 	
 ST.classe AS classe,
 CLSI.valor_l1 AS classe_l1,
 CLSI.valor_l2 AS classe_l2,
 CLSI.valor_l3 AS classe_l3,    
 CLSI.classe AS classe_desc,    
 ST.ano::integer AS ano,
 ST.area AS area,
 ST.territorio AS territorio    

FROM estatisticas AS ST   
LEFT JOIN classes AS CLSI ON CLSI.valor = ST.classe
LEFT JOIN municipios AS MUN ON MUN.id = ST.territorio
LEFT JOIN estados AS EST ON EST.id = MUN.id_estado        

WHERE ST.classe <> 0    
)

UNION
-- brasil
(

SELECT 	
    ST.classe AS classe,
    CLSI.valor_l1 AS classe_l1,
    CLSI.valor_l2 AS classe_l2,
    CLSI.valor_l3 AS classe_l3,    
    CLSI.classe AS classe_desc,    
    ST.ano::integer AS ano,
    SUM(ST.area) AS area,
    10 AS territorio
FROM estatisticas AS ST   
LEFT JOIN classes AS CLSI ON CLSI.valor = ST.classe
LEFT JOIN estados AS EST ON EST.id = ST.territorio
WHERE
EST.nome_estado IS NOT NULL
GROUP BY CLSI.valor_l1, CLSI.valor_l2, CLSI.valor_l3, ST.classe, CLSI.classe, ST.ano

)