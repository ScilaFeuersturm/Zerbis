-- =============================================================
--  ZERBIS — Script para MySQL Workbench
--  Pegá todo esto en una query tab y ejecutá con Ctrl+Shift+Enter
--  Contraseña de todos los prestadores de prueba: zerbis123
-- =============================================================

USE zerbis;

-- ─────────────────────────────────────────────────────────────
--  TABLA: rubros del prestador (si no existe todavía)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS provider_categories (
  provider_id BIGINT NOT NULL,
  category_id INT    NOT NULL,
  PRIMARY KEY (provider_id, category_id),
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ─────────────────────────────────────────────────────────────
--  CATEGORÍAS (30)
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO categories (name) VALUES ('Electricidad');
INSERT IGNORE INTO categories (name) VALUES ('Gas y Calefacción');
INSERT IGNORE INTO categories (name) VALUES ('Plomería');
INSERT IGNORE INTO categories (name) VALUES ('Pintura');
INSERT IGNORE INTO categories (name) VALUES ('Albañilería');
INSERT IGNORE INTO categories (name) VALUES ('Carpintería');
INSERT IGNORE INTO categories (name) VALUES ('Cerrajería');
INSERT IGNORE INTO categories (name) VALUES ('Limpieza');
INSERT IGNORE INTO categories (name) VALUES ('Jardinería y Paisajismo');
INSERT IGNORE INTO categories (name) VALUES ('Mudanzas');
INSERT IGNORE INTO categories (name) VALUES ('Aire Acondicionado');
INSERT IGNORE INTO categories (name) VALUES ('Herrería');
INSERT IGNORE INTO categories (name) VALUES ('Techado e Impermeabilización');
INSERT IGNORE INTO categories (name) VALUES ('Redes y Computación');
INSERT IGNORE INTO categories (name) VALUES ('Diseño Gráfico');
INSERT IGNORE INTO categories (name) VALUES ('Costura y Modistería');
INSERT IGNORE INTO categories (name) VALUES ('Peluquería y Estética');
INSERT IGNORE INTO categories (name) VALUES ('Masajes y Bienestar');
INSERT IGNORE INTO categories (name) VALUES ('Catering y Cocina');
INSERT IGNORE INTO categories (name) VALUES ('Clases Particulares');
INSERT IGNORE INTO categories (name) VALUES ('Idiomas');
INSERT IGNORE INTO categories (name) VALUES ('Música y Arte');
INSERT IGNORE INTO categories (name) VALUES ('Contabilidad y Finanzas');
INSERT IGNORE INTO categories (name) VALUES ('Asesoría Legal');
INSERT IGNORE INTO categories (name) VALUES ('Psicología y Coaching');
INSERT IGNORE INTO categories (name) VALUES ('Fotografía y Video');
INSERT IGNORE INTO categories (name) VALUES ('Veterinaria a Domicilio');
INSERT IGNORE INTO categories (name) VALUES ('Cuidado de Niños');
INSERT IGNORE INTO categories (name) VALUES ('Cuidado de Adultos Mayores');
INSERT IGNORE INTO categories (name) VALUES ('Mecánica a Domicilio');

-- ─────────────────────────────────────────────────────────────
--  PRESTADORES DE PRUEBA  (contraseña: zerbis123)
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO users (role_id, full_name, email, phone, password_hash, status) VALUES
  ((SELECT id FROM roles WHERE name='provider'), 'Carlos Méndez',      'carlos@zerbis.dev',     '1134500001', '$2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru', 'active'),
  ((SELECT id FROM roles WHERE name='provider'), 'Ana Rodríguez',       'ana@zerbis.dev',        '1134500002', '$2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru', 'active'),
  ((SELECT id FROM roles WHERE name='provider'), 'Miguel Torres',       'miguel@zerbis.dev',     '1134500003', '$2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru', 'active'),
  ((SELECT id FROM roles WHERE name='provider'), 'Laura Sánchez',       'laura@zerbis.dev',      '1134500004', '$2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru', 'active'),
  ((SELECT id FROM roles WHERE name='provider'), 'Roberto Gómez',       'roberto@zerbis.dev',    '1134500005', '$2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru', 'active'),
  ((SELECT id FROM roles WHERE name='provider'), 'Sofía Martínez',      'sofia@zerbis.dev',      '1134500006', '$2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru', 'active'),
  ((SELECT id FROM roles WHERE name='provider'), 'Diego Fernández',     'diego@zerbis.dev',      '1134500007', '$2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru', 'active'),
  ((SELECT id FROM roles WHERE name='provider'), 'Valentina López',     'valentina@zerbis.dev',  '1134500008', '$2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru', 'active'),
  ((SELECT id FROM roles WHERE name='provider'), 'Javier Gutiérrez',    'javier@zerbis.dev',     '1134500009', '$2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru', 'active'),
  ((SELECT id FROM roles WHERE name='provider'), 'María González',      'maria@zerbis.dev',      '1134500010', '$2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru', 'active');

-- ─────────────────────────────────────────────────────────────
--  PERFILES DE PRESTADOR
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO provider_profiles (user_id, headline, bio, city, avatar_url, avg_rating) VALUES
  ((SELECT id FROM users WHERE email='carlos@zerbis.dev'),    'Electricista matriculado + urgencias 24h',       'Más de 15 años de experiencia en instalaciones eléctricas residenciales e industriales. Atención en CABA y GBA.',                                         'Buenos Aires', 'https://api.dicebear.com/9.x/initials/svg?seed=CM&backgroundColor=1f6f78&fontColor=ffffff', 4.80),
  ((SELECT id FROM users WHERE email='ana@zerbis.dev'),       'Pintora de interiores y exteriores',             'Especialista en pintura decorativa, esmaltes y texturas. Presupuesto sin cargo. Trabajo prolijo y puntual.',                                              'Córdoba',       'https://api.dicebear.com/9.x/initials/svg?seed=AR&backgroundColor=34b38a&fontColor=ffffff', 4.60),
  ((SELECT id FROM users WHERE email='miguel@zerbis.dev'),    'Gasista matriculado — instalaciones y service',  'Habilitado para instalaciones de gas natural y envasado. Certificados e informes técnicos.',                                                             'Buenos Aires', 'https://api.dicebear.com/9.x/initials/svg?seed=MT&backgroundColor=1f6f78&fontColor=ffffff', 4.90),
  ((SELECT id FROM users WHERE email='laura@zerbis.dev'),     'Limpieza de hogares y oficinas',                 'Servicio de limpieza profunda, mantenimiento y post-obra. Equipo propio de insumos ecológicos.',                                                         'Rosario',       'https://api.dicebear.com/9.x/initials/svg?seed=LS&backgroundColor=34b38a&fontColor=ffffff', 4.70),
  ((SELECT id FROM users WHERE email='roberto@zerbis.dev'),   'Plomero — reparaciones y destapaciones',         'Plomería general, destapaciones de urgencia, colocación de sanitarios. Disponible fines de semana.',                                                       'Buenos Aires', 'https://api.dicebear.com/9.x/initials/svg?seed=RG&backgroundColor=1f6f78&fontColor=ffffff', 4.50),
  ((SELECT id FROM users WHERE email='sofia@zerbis.dev'),     'Diseñadora gráfica — logos, redes y branding',   'Especialista en identidad visual para pymes y emprendedores. Entrega rápida con revisiones incluidas.',                                                   'Buenos Aires', 'https://api.dicebear.com/9.x/initials/svg?seed=SM&backgroundColor=34b38a&fontColor=ffffff', 4.95),
  ((SELECT id FROM users WHERE email='diego@zerbis.dev'),     'Carpintero — muebles a medida y restauración',   'Fabricación de muebles, placards, cocinas y restauración de piezas antiguas. 20 años de oficio.',                                                        'Mendoza',       'https://api.dicebear.com/9.x/initials/svg?seed=DF&backgroundColor=1f6f78&fontColor=ffffff', 4.75),
  ((SELECT id FROM users WHERE email='valentina@zerbis.dev'), 'Profesora particular — Matemática y Física',     'Clases para secundaria, ingreso universitario y CBC. Modalidad presencial y virtual. Resultados garantizados.',                                           'Buenos Aires', 'https://api.dicebear.com/9.x/initials/svg?seed=VL&backgroundColor=34b38a&fontColor=ffffff', 4.85),
  ((SELECT id FROM users WHERE email='javier@zerbis.dev'),    'Cerrajero — aperturas y colocación de cerraduras','Apertura sin daños, cambio de cilindros, cajas de seguridad y duplicado de llaves. Urgencias las 24h.',                                               'Buenos Aires', 'https://api.dicebear.com/9.x/initials/svg?seed=JG&backgroundColor=1f6f78&fontColor=ffffff', 4.65),
  ((SELECT id FROM users WHERE email='maria@zerbis.dev'),     'Jardinería y diseño de espacios verdes',         'Diseño, mantenimiento y poda. Armado de canteros, huertas orgánicas y riego automático.',                                                                 'Córdoba',       'https://api.dicebear.com/9.x/initials/svg?seed=MG&backgroundColor=34b38a&fontColor=ffffff', 4.55);

-- ─────────────────────────────────────────────────────────────
--  RUBROS DE CADA PRESTADOR
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO provider_categories (provider_id, category_id) VALUES
  ((SELECT id FROM users WHERE email='carlos@zerbis.dev'),    (SELECT id FROM categories WHERE name='Electricidad')),
  ((SELECT id FROM users WHERE email='ana@zerbis.dev'),       (SELECT id FROM categories WHERE name='Pintura')),
  ((SELECT id FROM users WHERE email='miguel@zerbis.dev'),    (SELECT id FROM categories WHERE name='Gas y Calefacción')),
  ((SELECT id FROM users WHERE email='miguel@zerbis.dev'),    (SELECT id FROM categories WHERE name='Aire Acondicionado')),
  ((SELECT id FROM users WHERE email='laura@zerbis.dev'),     (SELECT id FROM categories WHERE name='Limpieza')),
  ((SELECT id FROM users WHERE email='roberto@zerbis.dev'),   (SELECT id FROM categories WHERE name='Plomería')),
  ((SELECT id FROM users WHERE email='sofia@zerbis.dev'),     (SELECT id FROM categories WHERE name='Diseño Gráfico')),
  ((SELECT id FROM users WHERE email='diego@zerbis.dev'),     (SELECT id FROM categories WHERE name='Carpintería')),
  ((SELECT id FROM users WHERE email='diego@zerbis.dev'),     (SELECT id FROM categories WHERE name='Herrería')),
  ((SELECT id FROM users WHERE email='valentina@zerbis.dev'), (SELECT id FROM categories WHERE name='Clases Particulares')),
  ((SELECT id FROM users WHERE email='valentina@zerbis.dev'), (SELECT id FROM categories WHERE name='Idiomas')),
  ((SELECT id FROM users WHERE email='javier@zerbis.dev'),    (SELECT id FROM categories WHERE name='Cerrajería')),
  ((SELECT id FROM users WHERE email='maria@zerbis.dev'),     (SELECT id FROM categories WHERE name='Jardinería y Paisajismo'));

-- ─────────────────────────────────────────────────────────────
--  SERVICIOS DE CADA PRESTADOR
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO provider_services (provider_id, category_id, title, description, price_from, price_unit, is_active) VALUES
  ((SELECT id FROM users WHERE email='carlos@zerbis.dev'),    (SELECT id FROM categories WHERE name='Electricidad'),        'Instalación eléctrica residencial',       'Tableros, circuitos, tomas e iluminación. Documentación incluida.',                          8000.00, 'trabajo',  1),
  ((SELECT id FROM users WHERE email='carlos@zerbis.dev'),    (SELECT id FROM categories WHERE name='Electricidad'),        'Reparación y urgencias eléctricas',       'Cortocircuitos, disyuntores, tomas dañadas. Respuesta en menos de 2 horas.',               3500.00, 'visita',   1),
  ((SELECT id FROM users WHERE email='ana@zerbis.dev'),       (SELECT id FROM categories WHERE name='Pintura'),             'Pintura de interiores',                   'Látex, esmalte sintético y pinturas decorativas. Mano de obra + materiales.',             5000.00, 'ambiente', 1),
  ((SELECT id FROM users WHERE email='ana@zerbis.dev'),       (SELECT id FROM categories WHERE name='Pintura'),             'Pintura de frentes y exteriores',         'Preparación de superficie, impermeabilización y pintura.',                                 12000.00, 'trabajo',  1),
  ((SELECT id FROM users WHERE email='miguel@zerbis.dev'),    (SELECT id FROM categories WHERE name='Gas y Calefacción'),   'Instalación de gas natural',              'Tendido de cañerías, instalación de artefactos y certificación.',                         15000.00, 'trabajo',  1),
  ((SELECT id FROM users WHERE email='miguel@zerbis.dev'),    (SELECT id FROM categories WHERE name='Gas y Calefacción'),   'Service de calefón y caldera',            'Limpieza, ajuste y diagnóstico completo de artefactos a gas.',                            4500.00, 'visita',   1),
  ((SELECT id FROM users WHERE email='laura@zerbis.dev'),     (SELECT id FROM categories WHERE name='Limpieza'),            'Limpieza de hogar por horas',             'Limpieza general de ambientes, cocina y baños. Insumos incluidos.',                       1200.00, 'hora',     1),
  ((SELECT id FROM users WHERE email='laura@zerbis.dev'),     (SELECT id FROM categories WHERE name='Limpieza'),            'Limpieza profunda post-obra',             'Retiro de escombros, polvo de construcción, limpieza de pisos.',                          25000.00, 'trabajo',  1),
  ((SELECT id FROM users WHERE email='roberto@zerbis.dev'),   (SELECT id FROM categories WHERE name='Plomería'),            'Destapación de cañerías',                 'Cocinas, baños, columnas. Equipos de alta presión. Urgencias 24h.',                       4000.00, 'visita',   1),
  ((SELECT id FROM users WHERE email='roberto@zerbis.dev'),   (SELECT id FROM categories WHERE name='Plomería'),            'Instalación sanitaria',                   'Inodoros, lavatorios, duchas y termotanques. Planos y garantía incluidos.',              10000.00, 'trabajo',  1),
  ((SELECT id FROM users WHERE email='sofia@zerbis.dev'),     (SELECT id FROM categories WHERE name='Diseño Gráfico'),      'Diseño de logo e identidad de marca',     'Propuestas, revisiones y archivos editables finales.',                                    18000.00, 'proyecto', 1),
  ((SELECT id FROM users WHERE email='sofia@zerbis.dev'),     (SELECT id FROM categories WHERE name='Diseño Gráfico'),      'Pack de redes sociales',                  '12 artes mensuales, stories y portada. Entrega en 48h.',                                  8000.00, 'mes',      1),
  ((SELECT id FROM users WHERE email='diego@zerbis.dev'),     (SELECT id FROM categories WHERE name='Carpintería'),         'Muebles a medida',                        'Cocinas, placards, bibliotecas y escritorios. Presupuesto sin cargo.',                    30000.00, 'proyecto', 1),
  ((SELECT id FROM users WHERE email='diego@zerbis.dev'),     (SELECT id FROM categories WHERE name='Carpintería'),         'Restauración de muebles',                 'Lijado, laqueado y reemplazo de herrajes. Piezas de época y modernas.',                   5000.00, 'pieza',    1),
  ((SELECT id FROM users WHERE email='valentina@zerbis.dev'), (SELECT id FROM categories WHERE name='Clases Particulares'), 'Matemática — Secundaria y CBC',           'Clases individuales o grupales (hasta 3 alumnos). Online y presencial.',                  1500.00, 'hora',     1),
  ((SELECT id FROM users WHERE email='valentina@zerbis.dev'), (SELECT id FROM categories WHERE name='Clases Particulares'), 'Física universitaria',                    'Mecánica, termodinámica y electromagnetismo. Resolución de ejercicios y exámenes.',      1800.00, 'hora',     1),
  ((SELECT id FROM users WHERE email='javier@zerbis.dev'),    (SELECT id FROM categories WHERE name='Cerrajería'),          'Apertura de puertas sin daños',           'Técnica no destructiva. CABA y GBA. Disponible las 24 horas.',                            5000.00, 'visita',   1),
  ((SELECT id FROM users WHERE email='javier@zerbis.dev'),    (SELECT id FROM categories WHERE name='Cerrajería'),          'Instalación de cerradura de seguridad',   'Cerraduras de alta seguridad, bombines y cajas fuertes.',                                 3500.00, 'unidad',   1),
  ((SELECT id FROM users WHERE email='maria@zerbis.dev'),     (SELECT id FROM categories WHERE name='Jardinería y Paisajismo'), 'Mantenimiento mensual de jardín',     'Corte, poda, riego y abono. Frecuencia quincenal o mensual.',                             4000.00, 'visita',   1),
  ((SELECT id FROM users WHERE email='maria@zerbis.dev'),     (SELECT id FROM categories WHERE name='Jardinería y Paisajismo'), 'Diseño y armado de jardín',           'Proyecto de paisajismo, selección de plantas y ejecución completa.',                      20000.00, 'proyecto', 1);
