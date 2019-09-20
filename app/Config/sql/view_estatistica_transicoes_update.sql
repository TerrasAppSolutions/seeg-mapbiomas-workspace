 SELECT st.classe_inicial,
    clsi.valor_l1 AS classe_inicial_l1,
    clsi.valor_l2 AS classe_inicial_l2,
    clsi.valor_l3 AS classe_inicial_l3,
    clsi.classe AS classe_inicial_desc,
    st.classe_final,
    clsf.valor_l1 AS classe_final_l1,
    clsf.valor_l2 AS classe_final_l2,
    clsf.valor_l3 AS classe_final_l3,
    clsf.classe AS classe_final_desc,
    st.ano_inicial,
    st.ano_final,
    sum(st.area) AS area,
    st.territorio
   FROM estatistica_transicoes st
     LEFT JOIN classes clsi ON clsi.valor = st.classe_inicial
     LEFT JOIN classes clsf ON clsf.valor = st.classe_final
  GROUP BY st.classe_inicial, clsi.valor_l1, clsi.valor_l2, clsi.valor_l3, clsi.classe, st.classe_final, clsf.valor_l1, clsf.valor_l2, clsf.valor_l3, clsf.classe, st.ano_inicial, st.ano_final, st.territorio;