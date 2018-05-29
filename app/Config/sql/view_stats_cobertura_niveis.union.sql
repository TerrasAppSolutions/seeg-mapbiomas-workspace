DROP VIEW estatistica_niveis;
CREATE VIEW estatistica_niveis AS
-- municipio
(
    SELECT 	
        STE.classe_inicial AS classe,
        CLSI.valor_l1 AS classe_l1,
        CLSI.valor_l2 AS classe_l2,
        CLSI.valor_l3 AS classe_l3,    
        CLSI.classe AS classe_desc,    
        STE.ano_inicial AS ano,
        SUM(STE.area_km2) AS area,
        STE.territorio AS territorio
        --MUN.nome_municipio AS municipio_nome,
        --EST.nome_estado AS estado_nome

    FROM estatistica_exportacoes AS STE   
    LEFT JOIN classes AS CLSI ON CLSI.valor = STE.classe_inicial
    LEFT JOIN municipios AS MUN ON MUN.id = STE.territorio
    LEFT JOIN estados AS EST ON EST.id = MUN.id_estado

    --WHERE 
    --STE.territorio = 2208908

    GROUP BY STE.territorio,STE.classe_inicial,CLSI.valor_l1,CLSI.valor_l2,CLSI.valor_l3,CLSI.classe,STE.ano_inicial,MUN.nome_municipio,EST.nome_estado 

    ORDER BY STE.classe_inicial ASC, STE.ano_inicial
)

UNION
-- municipio para ano final 2016
(
    SELECT 	
        STE.classe_final AS classe,
        CLSI.valor_l1 AS classe_l1,
        CLSI.valor_l2 AS classe_l2,
        CLSI.valor_l3 AS classe_l3,    
        CLSI.classe AS classe_desc,    
        STE.ano_final AS ano,
        SUM(STE.area_km2) AS area,
        STE.territorio AS territorio
        --MUN.nome_municipio AS municipio_nome,
        --EST.nome_estado AS estado_nome

    FROM estatistica_exportacoes AS STE   
    LEFT JOIN classes AS CLSI ON CLSI.valor = STE.classe_final
    LEFT JOIN municipios AS MUN ON MUN.id = STE.territorio
    LEFT JOIN estados AS EST ON EST.id = MUN.id_estado


    WHERE     
        STE.ano_final = 2016

    GROUP BY STE.territorio,STE.classe_final,CLSI.valor_l1,CLSI.valor_l2,CLSI.valor_l3,CLSI.classe,STE.ano_final,MUN.nome_municipio,EST.nome_estado

    ORDER BY STE.classe_final ASC, STE.ano_final
)

UNION
-- Estado,Bioma,Brasil
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