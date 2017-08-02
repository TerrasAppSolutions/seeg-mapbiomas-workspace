WITH CTS AS  (SELECT CT.*
FROM
classificacao_tarefas AS CT
LEFT JOIN classificacoes AS C ON C.id = CT.classificacao_id
LEFT JOIN biomas AS B ON B.id = C.bioma_id
LEFT JOIN cartas AS CA ON CA.id = C.carta_id
WHERE    
(B.nome = 'PANTANAL' AND CA.codigo = 'SE-21-V-B' AND C.year = '2008' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SB-24-V-D' AND C.year = '2000' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SD-24-V-A' AND C.year = '2000' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SB-24-Z-B' AND C.year = '2003' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SC-24-X-D' AND C.year = '2003' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SD-23-X-D' AND C.year = '2003' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SB-24-Z-A' AND C.year = '2005' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SD-23-X-B' AND C.year = '2006' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SD-23-X-D' AND C.year = '2006' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SC-24-V-B' AND C.year = '2006' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SB-24-V-D' AND C.year = '2007' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SC-23-X-C' AND C.year = '2007' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SC-23-Z-B' AND C.year = '2007' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SB-23-Z-B' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SC-24-X-B' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SB-24-X-C' AND C.year = '2010' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SB-24-X-D' AND C.year = '2010' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SB-24-Z-A' AND C.year = '2010' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SB-24-Z-B' AND C.year = '2010' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SC-24-X-B' AND C.year = '2010' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SC-23-X-B' AND C.year = '2010' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SD-23-X-B' AND C.year = '2010' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SD-23-Z-B' AND C.year = '2010' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SC-24-V-C' AND C.year = '2014' AND CT.fase = 0) OR
(B.nome = 'CAATINGA' AND CA.codigo = 'SB-24-X-D' AND C.year = '2016' AND CT.fase = 0) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-21-X-C' AND C.year = '2015' AND CT.fase = 0) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-22-X-C' AND C.year = '2000' AND CT.fase = 0) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SH-21-Z-C' AND C.year = '2000' AND CT.fase = 0) OR
(B.nome = 'PAMPA'    AND CA.codigo = 'SI-22-V-C' AND C.year = '2011' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SA-23-Z-C' AND C.year = '2008' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SB-22-Z-B' AND C.year = '2008' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SB-22-Z-B' AND C.year = '2011' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SB-22-Z-D' AND C.year = '2008' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SB-23-V-D' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SB-23-X-A' AND C.year = '2008' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SB-23-X-B' AND C.year = '2007' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SB-23-X-C' AND C.year = '2011' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SB-23-Y-C' AND C.year = '2008' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SB-23-Z-B' AND C.year = '2008' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-22-X-A' AND C.year = '2002' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-22-X-A' AND C.year = '2003' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-22-X-B' AND C.year = '2002' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-22-X-B' AND C.year = '2003' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-22-Y-D' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-22-Y-D' AND C.year = '2011' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-22-Z-D' AND C.year = '2002' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-22-Z-D' AND C.year = '2005' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-A' AND C.year = '2002' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-A' AND C.year = '2012' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-B' AND C.year = '2000' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-B' AND C.year = '2001' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-B' AND C.year = '2002' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-B' AND C.year = '2004' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-B' AND C.year = '2008' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-B' AND C.year = '2011' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-C' AND C.year = '2001' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-C' AND C.year = '2006' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-C' AND C.year = '2010' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-C' AND C.year = '2011' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-C' AND C.year = '2012' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-D' AND C.year = '2000' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-V-D' AND C.year = '2012' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-X-B' AND C.year = '2006' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-X-B' AND C.year = '2007' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-X-C' AND C.year = '2006' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-Y-C' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SC-23-Z-B' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-20-X-B' AND C.year = '2013' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-21-V-B' AND C.year = '2007' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-21-V-B' AND C.year = '2011' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-21-V-C' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-21-X-D' AND C.year = '2013' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-21-Y-B' AND C.year = '2013' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-21-Y-D' AND C.year = '2013' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-21-Z-A' AND C.year = '2012' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-21-Z-A' AND C.year = '2013' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-21-Z-B' AND C.year = '2013' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-21-Z-D' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-22-V-B' AND C.year = '2012' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-22-V-B' AND C.year = '2013' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-22-Z-A' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-22-Z-B' AND C.year = '2007' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-22-Z-D' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-23-V-C' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-23-X-B' AND C.year = '2004' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-23-X-B' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-23-X-C' AND C.year = '2002' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-23-X-C' AND C.year = '2004' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-23-X-D' AND C.year = '2006' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-23-Y-C' AND C.year = '2000' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SD-23-Y-C' AND C.year = '2002' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-21-Z-B' AND C.year = '2006' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-21-Z-C' AND C.year = '2013' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-21-Z-D' AND C.year = '2013' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-22-V-C' AND C.year = '2007' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-22-Y-B' AND C.year = '2002' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-22-Y-B' AND C.year = '2004' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-22-Y-B' AND C.year = '2005' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-22-Y-B' AND C.year = '2006' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-22-Y-B' AND C.year = '2007' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-22-Y-B' AND C.year = '2009' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-22-Y-B' AND C.year = '2012' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-22-Y-B' AND C.year = '2016' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-23-Y-A' AND C.year = '2001' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-23-Y-B' AND C.year = '2000' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-23-Y-B' AND C.year = '2001' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-23-Y-B' AND C.year = '2002' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-23-Y-B' AND C.year = '2007' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SE-23-Y-B' AND C.year = '2008' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SF-22-V-B' AND C.year = '2006' AND CT.fase = 0) OR
(B.nome = 'CERRADO'  AND CA.codigo = 'SG-22-X-B' AND C.year = '2012' AND CT.fase = 0) 
 )

UPDATE classificacao_tarefas
SET status = 0
WHERE 
id IN (SELECT CTS.id FROM CTS);


DELETE FROM classificacao_tarefas
WHERE 
fase >= 1 AND 
classificacao_id IN (SELECT CTS.classificacao_id FROM CTS);
