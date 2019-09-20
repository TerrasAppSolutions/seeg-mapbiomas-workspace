DROP TABLE estatistica_niveis;

CREATE TABLE estatistica_niveis AS

 SELECT st.classe,
    clsi.valor_l1 AS classe_l1,
    clsi.valor_l2 AS classe_l2,
    clsi.valor_l3 AS classe_l3,
    clsi.classe AS classe_desc,
    st.ano::integer AS ano,
    sum(st.area) AS area,
    st.territorio
   FROM estatisticas st
     LEFT JOIN classes clsi ON clsi.valor = st.classe
  GROUP BY clsi.valor_l1, clsi.valor_l2, clsi.valor_l3, st.classe, clsi.classe, st.ano, st.territorio;
