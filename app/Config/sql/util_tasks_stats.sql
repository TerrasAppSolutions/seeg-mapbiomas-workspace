WITH intervalo AS (
 SELECT i::date AS dia FROM generate_series(now() - interval '1 month', now(), '1 day'::interval) i
)
SELECT 
 intervalo.dia,
 (SELECT date(intervalo.dia) FROM classificacao_tarefas AS CT WHERE date(CT.created) = date('2017-03-15') GROUP BY date(CT.created))

FROM intervalo



SELECT 
 date(CT.created) date, 
 COUNT(CT.id)

FROM classificacao_tarefas AS CT 
-- WHERE date(CT.created) = date('2017-03-15') 
GROUP BY date
ORDER BY date DESC


SELECT 
 date(CT.modified) date, 
 COUNT(CT.id)

FROM classificacao_tarefas AS CT 
WHERE 
 CT.status = 2
GROUP BY date
ORDER BY date DESC