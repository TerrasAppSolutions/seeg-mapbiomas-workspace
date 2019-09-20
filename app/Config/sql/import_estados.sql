INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       geom
   )
SELECT
  featureid AS id,
  name AS descricao,
  categoria,
  geom
FROM public.div_deptos_tmp ;
