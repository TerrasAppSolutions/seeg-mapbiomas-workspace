--ESTADOS
SELECT 'Estado' 'Categoria', tba.est_name 'Unidade Geográfica', cla.name 'classes', 
replace(cast(tb1.area/10000 as str), ".", ",") '2008 (ha)', 
replace(cast(tb2.area/10000 as str), ".", ",") '2009 (ha)', 
replace(cast(tb3.area/10000 as str), ".", ",") '2010 (ha)', 
replace(cast(tb4.area/10000 as str), ".", ",") '2011 (ha)', 
replace(cast(tb5.area/10000 as str), ".", ",") '2012 (ha)', 
replace(cast(tb6.area/10000 as str), ".", ",") '2013 (ha)', 
replace(cast(tb7.area/10000 as str), ".", ",") '2014 (ha)', 
replace(cast(tb8.area/10000 as str), ".", ",") '2015 (ha)'
FROM estados tba, classes cla
LEFT JOIN est_stats tb1 on tba.ue_id = tb1.territorio_id and cla.ID = tb1.class and tb1.year = 2008
LEFT JOIN est_stats tb2 on tba.ue_id = tb2.territorio_id and cla.ID = tb2.class and tb2.year = 2009
LEFT JOIN est_stats tb3 on tba.ue_id = tb3.territorio_id and cla.ID = tb3.class and tb3.year = 2010
LEFT JOIN est_stats tb4 on tba.ue_id = tb4.territorio_id and cla.ID = tb4.class and tb4.year = 2011
LEFT JOIN est_stats tb5 on tba.ue_id = tb5.territorio_id and cla.ID = tb5.class and tb5.year = 2012
LEFT JOIN est_stats tb6 on tba.ue_id = tb6.territorio_id and cla.ID = tb6.class and tb6.year = 2013
LEFT JOIN est_stats tb7 on tba.ue_id = tb7.territorio_id and cla.ID = tb7.class and tb7.year = 2014
LEFT JOIN est_stats tb8 on tba.ue_id = tb8.territorio_id and cla.ID = tb8.class and tb8.year = 2015
group by tba.ue_id, cla.ID;
