INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       geom
   )
SELECT
  (featureid + 700000000) AS id,
  CONCAT(name_1, ' (', pais, ')') AS descricao,
  CONCAT(categoria, '-PAÍS') AS categoria,
  geom
FROM public.cuencas_pais_tmp ;
