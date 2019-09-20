INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       the_geom
   )
SELECT
  (featureid + 11000000000) AS id,
  name AS descricao,
  'Deptales-Pais-Estado',
  geom as the_geom
FROM public.deptales_pais_estado_tmp ;