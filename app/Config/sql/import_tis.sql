INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       the_geom
   )
SELECT
  (featureid + 800000000) AS id,
  name AS descricao,
  categoria,
  geom as the_geom
FROM public.tis_tmp ;


