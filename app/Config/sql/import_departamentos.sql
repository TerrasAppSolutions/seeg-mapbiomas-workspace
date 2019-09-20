INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       the_geom
   )
SELECT
  featureid AS id,
  name AS descricao,
  categoria,
  geom as the_geom
FROM public.div_deptos_tmp ;
