INSERT INTO public.territorios_dashboard (
       id,
       descricao,
       categoria,
       geom
   )
SELECT
  (featureid + 3000000000) AS id,
  name AS descricao,
  categoria,
  geom
FROM public.cuencas_tmp ;


SELECT gid, 
       objectid,
       legendabio,
       lim_raisg,
       shape_leng,
       shape_area, 
       hectares, id_bioma, (ROW_NUMBER () OVER (ORDER BY featureid ) + 3000) AS idsum, featureid, categoria, name
FROM public.biomas_tmp;
