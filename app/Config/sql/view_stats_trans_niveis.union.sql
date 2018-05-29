DROP VIEW estatistica_transicao_niveis;
CREATE VIEW estatistica_transicao_niveis AS

-- municipio
(
    SELECT  
        STE.classe_inicial AS classe_inicial,
        CLSI.valor_l1 AS classe_inicial_l1,
        CLSI.valor_l2 AS classe_inicial_l2,
        CLSI.valor_l3 AS classe_inicial_l3,    
        CLSI.classe AS classe_inicial_desc,
        STE.classe_final AS classe_final,   
        CLSF.valor_l1 AS classe_final_l1,
        CLSF.valor_l2 AS classe_final_l2,
        CLSF.valor_l3 AS classe_final_l3,
        CLSF.classe AS classe_final_desc, 
        STE.ano_inicial AS ano_inicial,
        STE.ano_final AS ano_final,
        SUM(STE.area_km2) AS area,
        STE.territorio AS territorio        
    
    FROM estatistica_exportacoes AS STE   
    LEFT JOIN classes AS CLSI ON CLSI.valor = STE.classe_inicial
    LEFT JOIN classes AS CLSF ON CLSF.valor = STE.classe_final
    LEFT JOIN municipios AS MUN ON MUN.id = STE.territorio
    LEFT JOIN estados AS EST ON EST.id = MUN.id_estado
    
    --WHERE 
    --   STE.territorio = 1
    
    GROUP BY STE.territorio,STE.classe_inicial,CLSI.valor_l1,CLSI.valor_l2,CLSI.valor_l3,CLSI.classe, STE.classe_final,CLSF.valor_l1,CLSF.valor_l2,CLSF.valor_l3,CLSF.classe, STE.ano_inicial,STE.ano_final,MUN.nome_municipio,EST.nome_estado 
    
    ORDER BY STE.classe_inicial ASC, STE.classe_final ASC, STE.ano_inicial ASC,STE.ano_final ASC
)

UNION
-- estado
(
    SELECT  
        STE.classe_inicial AS classe_inicial,
        CLSI.valor_l1 AS classe_inicial_l1,
        CLSI.valor_l2 AS classe_inicial_l2,
        CLSI.valor_l3 AS classe_inicial_l3,    
        CLSI.classe AS classe_inicial_desc,
        STE.classe_final AS classe_final,   
        CLSF.valor_l1 AS classe_final_l1,
        CLSF.valor_l2 AS classe_final_l2,
        CLSF.valor_l3 AS classe_final_l3,
        CLSF.classe AS classe_final_desc, 
        STE.ano_inicial AS ano_inicial,
        STE.ano_final AS ano_final,
        SUM(STE.area_km2) AS area,         
        MUN.id_estado AS territorio
    
    FROM estatistica_exportacoes AS STE   
    LEFT JOIN classes AS CLSI ON CLSI.valor = STE.classe_inicial
    LEFT JOIN classes AS CLSF ON CLSF.valor = STE.classe_final
    LEFT JOIN municipios AS MUN ON MUN.id = STE.territorio
    LEFT JOIN estados AS EST ON EST.id = MUN.id_estado
    
    --WHERE 
    --   MUN.id_estado = 13
    
    GROUP BY MUN.id_estado,STE.classe_inicial,CLSI.valor_l1,CLSI.valor_l2,CLSI.valor_l3,CLSI.classe, STE.classe_final,CLSF.valor_l1,CLSF.valor_l2,CLSF.valor_l3,CLSF.classe, STE.ano_inicial,STE.ano_final,EST.nome_estado 
    
    ORDER BY STE.classe_inicial ASC, STE.classe_final ASC, STE.ano_inicial ASC,STE.ano_final ASC
)

UNION
-- brasil
(
    SELECT  
        STE.classe_inicial AS classe_inicial,
        CLSI.valor_l1 AS classe_inicial_l1,
        CLSI.valor_l2 AS classe_inicial_l2,
        CLSI.valor_l3 AS classe_inicial_l3,    
        CLSI.classe AS classe_inicial_desc,
        STE.classe_final AS classe_final,   
        CLSF.valor_l1 AS classe_final_l1,
        CLSF.valor_l2 AS classe_final_l2,
        CLSF.valor_l3 AS classe_final_l3,
        CLSF.classe AS classe_final_desc, 
        STE.ano_inicial AS ano_inicial,
        STE.ano_final AS ano_final,
        SUM(STE.area_km2) AS area,         
        10 AS territorio
    
    FROM estatistica_exportacoes AS STE   
    LEFT JOIN classes AS CLSI ON CLSI.valor = STE.classe_inicial
    LEFT JOIN classes AS CLSF ON CLSF.valor = STE.classe_final   
    
    -- WHERE 
    -- STE.ano_inicial = 2008 AND
    -- STE.ano_final = 2009
    
    GROUP BY STE.classe_inicial,CLSI.valor_l1,CLSI.valor_l2,CLSI.valor_l3,CLSI.classe, STE.classe_final,CLSF.valor_l1,CLSF.valor_l2,CLSF.valor_l3,CLSF.classe, STE.ano_inicial,STE.ano_final
    
    ORDER BY STE.classe_inicial ASC, STE.classe_final ASC, STE.ano_inicial ASC,STE.ano_final ASC
)