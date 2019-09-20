INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       geom
   )
SELECT
  (featureid + 700000000) AS id,
  name_1 AS descricao,
  categoria,
  geom
FROM public.cuencas_deptos_tmp ;
