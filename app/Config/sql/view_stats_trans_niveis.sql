DROP VIEW estatistica_transicao_niveis;
CREATE VIEW estatistica_transicao_niveis AS

(

SELECT 	
    ST.classe_inicial AS classe_inicial,
    CLSI.valor_l1 AS classe_inicial_l1,
    CLSI.valor_l2 AS classe_inicial_l2,
    CLSI.valor_l3 AS classe_inicial_l3,    
    CLSI.classe AS classe_inicial_desc,
    ST.classe_final AS classe_final,   
    CLSF.valor_l1 AS classe_final_l1,
    CLSF.valor_l2 AS classe_final_l2,
    CLSF.valor_l3 AS classe_final_l3,
    CLSF.classe AS classe_final_desc, 
    ST.ano_inicial AS ano_inicial,
    ST.ano_final AS ano_final,
    ST.area AS area,
    ST.territorio AS territorio

FROM estatistica_transicoes AS ST 
LEFT JOIN classes AS CLSI ON CLSI.valor = ST.classe_inicial
LEFT JOIN classes AS CLSF ON CLSF.valor = ST.classe_final
LEFT JOIN municipios AS MUN ON MUN.id = ST.territorio
LEFT JOIN estados AS EST ON EST.id = MUN.id_estado

)

UNION

(
    SELECT 	
    ST.classe_inicial AS classe_inicial,
    CLSI.valor_l1 AS classe_inicial_l1,
    CLSI.valor_l2 AS classe_inicial_l2,
    CLSI.valor_l3 AS classe_inicial_l3,    
    CLSI.classe AS classe_inicial_desc,
    ST.classe_final AS classe_final,   
    CLSF.valor_l1 AS classe_final_l1,
    CLSF.valor_l2 AS classe_final_l2,
    CLSF.valor_l3 AS classe_final_l3,
    CLSF.classe AS classe_final_desc, 
    ST.ano_inicial AS ano_inicial,
    ST.ano_final AS ano_final,
    SUM(ST.area) AS area,
    10 AS territorio

FROM estatistica_transicoes AS ST 
LEFT JOIN classes AS CLSI ON CLSI.valor = ST.classe_inicial
LEFT JOIN classes AS CLSF ON CLSF.valor = ST.classe_final
LEFT JOIN biomas AS BIO ON BIO.id = ST.territorio

WHERE
BIO.nome IS NOT NULL

GROUP BY ST.classe_inicial,CLSI.valor_l1,CLSI.valor_l2,CLSI.valor_l3,CLSI.classe, ST.classe_final,CLSF.valor_l1,CLSF.valor_l2,CLSF.valor_l3,CLSF.classe, ST.ano_inicial,ST.ano_final

)