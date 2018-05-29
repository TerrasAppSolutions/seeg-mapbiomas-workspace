--Estados
SELECT 'Estado' 'Categoria', tba.est_name 'Unidade Geográfica', cla1.name 'Classe Ano 1', cla2.name 'Classe Ano 2',
replace(cast(tb1.area/10000 as str), ".", ",") '2008-2009 (ha)', 
replace(cast(tb2.area/10000 as str), ".", ",") '2009-2010 (ha)', 
replace(cast(tb3.area/10000 as str), ".", ",") '2010-2011 (ha)', 
replace(cast(tb4.area/10000 as str), ".", ",") '2011-2012 (ha)', 
replace(cast(tb5.area/10000 as str), ".", ",") '2012-2013 (ha)', 
replace(cast(tb6.area/10000 as str), ".", ",") '2013-2014 (ha)', 
replace(cast(tb7.area/10000 as str), ".", ",") '2014-2015 (ha)'
FROM estados tba, classes cla1, classes cla2
LEFT JOIN est_matrix tb1 on tba.ue_id = tb1.territorio_id and cla1.ID = tb1.class1 and cla2.ID = tb1.class2 and tb1.year1 = 2008
LEFT JOIN est_matrix tb2 on tba.ue_id = tb2.territorio_id and cla1.ID = tb2.class1 and cla2.ID = tb2.class2 and tb2.year1 = 2009
LEFT JOIN est_matrix tb3 on tba.ue_id = tb3.territorio_id and cla1.ID = tb3.class1 and cla2.ID = tb3.class2 and tb3.year1 = 2010
LEFT JOIN est_matrix tb4 on tba.ue_id = tb4.territorio_id and cla1.ID = tb4.class1 and cla2.ID = tb4.class2 and tb4.year1 = 2011
LEFT JOIN est_matrix tb5 on tba.ue_id = tb5.territorio_id and cla1.ID = tb5.class1 and cla2.ID = tb5.class2 and tb5.year1 = 2012
LEFT JOIN est_matrix tb6 on tba.ue_id = tb6.territorio_id and cla1.ID = tb6.class1 and cla2.ID = tb6.class2 and tb6.year1 = 2013
LEFT JOIN est_matrix tb7 on tba.ue_id = tb7.territorio_id and cla1.ID = tb7.class1 and cla2.ID = tb7.class2 and tb7.year1 = 2014
group by tba.ue_id, cla1.ID, cla2.ID;
