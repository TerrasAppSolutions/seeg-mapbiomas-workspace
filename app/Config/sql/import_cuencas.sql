INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       geom
   )
SELECT
  (featureid + 500000000) AS id,
  name AS descricao,
  categoria,
  geom
FROM public.cuencas_tmp ;
