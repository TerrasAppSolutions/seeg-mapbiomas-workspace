-- Table: classes

-- DROP TABLE classes;

CREATE TABLE classes
(
  id serial NOT NULL,
  classe character varying(50) NOT NULL,
  cor character varying(10),
  parente integer,
  ref character varying(10),
  versao integer,
  valor integer,
  valor_l1 integer,
  valor_l2 integer,
  valor_l3 integer,
  CONSTRAINT classes_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE classes
  OWNER TO postgres;


INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (23, 'Pastagem', '#FFD966', 14, '3.1.', 3, 15, 14, 15, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (26, 'Agricultura', '#E974ED', 14, '3.2.', 3, 18, 14, 18, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (31, 'Áreas não vegetadas', '#EA9999', 0, '4.', 3, 22, 22, NULL, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (35, 'Corpos Dágua', '#0000FF', 0, '5.', 3, 26, 26, NULL, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (36, 'Não observado', '#D5D5E5', 0, '6.', 3, 27, 27, NULL, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (11, 'Floresta Densa', '#006400', 2, '1.1.1.', 3, 3, 1, 2, 3);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (12, 'Floresta Aberta', '#00FF00', 2, '1.1.2.', 3, 4, 1, 2, 4);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (13, 'Mangue', '#687537', 2, '1.1.3.', 3, 5, 1, 2, 5);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (9, 'Floresta', '#129912', 0, '1.', 3, 1, 1, NULL, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (14, 'Floresta Alagada', '#76A5AF', 2, '1.1.4.', 3, 6, 1, 2, 6);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (15, 'Floresta Degradada', '#29EEE4', 2, '1.1.5.', 3, 7, 1, 2, 7);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (16, 'Floresta Secundária', '#77A605', 2, '1.1.6.', 3, 8, 1, 2, 8);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (24, 'Pastagem em Campos Naturais (integração)', '#F6B26B', 15, '3.1.1.', 3, 16, 14, 15, 16);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (25, 'Outras Pastagens', '#A0D0DE', 15, '3.1.2.', 3, 17, 14, 15, 17);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (27, 'Culturas Anuais', '#D5A6BD', 18, '3.2.1.', 3, 19, 14, 18, 19);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (28, 'Culturas Semi-Perene (Cana de Açucar)', '#C27BA0', 18, '3.2.2.', 3, 20, 14, 18, 20);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (29, 'Mosaico de Cultivos', '#CE3D3D', 18, '3.2.3.', 3, 28, 14, 18, 28);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (19, 'Áreas Úmvaloras Naturais não Florestais', '#45C2A5', 10, '2.1.', 3, 11, 10, 11, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (20, 'Vegetação Campestre (Campos)', '#B8AF4F', 10, '2.2.', 3, 12, 10, 12, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (21, 'Outras formações não Florestais', '#F1C232', 10, '2.3.', 3, 13, 10, 13, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (32, 'Praias e dunas', '#DD7E6B', 22, '4.1.', 3, 23, 22, 23, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (33, 'Outras áreas não vegetadas', '#FF99FF', 22, '4.3.', 3, 25, 22, 25, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (34, 'Infraestrutura Urbana', '#B7B7B7', 22, '4.2.', 3, 24, 22, 24, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (10, 'Formações Florestais Naturais', '#1F4423', 1, '1.1.', 3, 2, 1, 2, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (17, 'Silvicultura', '#935132', 1, '1.2.', 3, 9, 1, 9, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (18, 'Formações Naturais não Florestais', '#FF9966', 0, '2.', 3, 10, 10, NULL, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (22, 'Uso Agropecuário', '#FFFFB2', 0, '3.', 3, 14, 14, NULL, NULL);
INSERT INTO classes (id, classe, cor, parente, ref, versao, valor, valor_l1, valor_l2, valor_l3) VALUES (30, 'Agricultura ou Pastagem (biomas)', '#FFEFC3', 14, '3.3.', 3, 21, 14, NULL, NULL);



SELECT pg_catalog.setval('classes_id_seq', 36, true);