INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       the_geom
   )
SELECT
  (featureid + 10000000000) AS id,
  name AS descricao,
  'TIS-PAIS-ESTADO',
  geom as the_geom
FROM public.tis_pais_estadotmp ;