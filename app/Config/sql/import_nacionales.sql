INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       the_geom
   )
SELECT
  (featureid + 900000000) AS id,
  name AS descricao,
  categoria,
  geom as the_geom
FROM public.nacionales_tmp ;

