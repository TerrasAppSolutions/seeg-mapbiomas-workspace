INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       the_geom
   )
SELECT
  (featureid + 8000000000) AS id,
  CONCAT(name,' ', '(', nomedep, ')') AS descricao,
  'Nacionales-Pais-Estado',
  geom as the_geom
FROM public.nacionales_pais_estado_tmp ;