INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       the_geom
   )
SELECT
  (featureid + 110000000) AS id,
  name AS descricao,
  categoria,
  geom as the_geom
FROM public.deptales_tmp ;

