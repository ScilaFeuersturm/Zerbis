-- =============================================================
--  ZERBIS — Seed de categorías y prestadores de prueba
--  Contraseña de todos los prestadores de prueba: zerbis123
--  Ejecutar: mysql -u root -p zerbis < zerbis_seed.sql
-- =============================================================
USE zerbis;

-- Tabla de rubros del prestador (si no existe aún)
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
INSERT IGNORE INTO categories (name) VALUES
  ('Electricidad'),
  ('Gas y Calefacción'),
  ('Plomería'),
  ('Pintura'),
  ('Albañilería'),
  ('Carpintería'),
  ('Cerrajería'),
  ('Limpieza'),
  ('Jardinería y Paisajismo'),
  ('Mudanzas'),
  ('Aire Acondicionado'),
  ('Herrería'),
  ('Techado e Impermeabilización'),
  ('Redes y Computación'),
  ('Diseño Gráfico'),
  ('Costura y Modistería'),
  ('Peluquería y Estética'),
  ('Masajes y Bienestar'),
  ('Catering y Cocina'),
  ('Clases Particulares'),
  ('Idiomas'),
  ('Música y Arte'),
  ('Contabilidad y Finanzas'),
  ('Asesoría Legal'),
  ('Psicología y Coaching'),
  ('Fotografía y Video'),
  ('Veterinaria a Domicilio'),
  ('Cuidado de Niños'),
  ('Cuidado de Adultos Mayores'),
  ('Mecánica a Domicilio');

-- ─────────────────────────────────────────────────────────────
--  PRESTADORES DE PRUEBA
--  Contraseña: zerbis123
--  Hash: $2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru
-- ─────────────────────────────────────────────────────────────
SET @pw = '$2a$10$bTWFiEI8Y6Ch0RHAclxtkOdIN9vyalHhTQSxWZA0Xa1kvHcuvJQru';
SET @role_provider = (SELECT id FROM roles WHERE name = 'provider');

INSERT IGNORE INTO users (role_id, full_name, email, phone, password_hash, status) VALUES
  (@role_provider, 'Carlos Méndez',       'carlos@zerbis.dev',     '1134500001', @pw, 'active'),
  (@role_provider, 'Ana Rodríguez',        'ana@zerbis.dev',        '1134500002', @pw, 'active'),
  (@role_provider, 'Miguel Torres',        'miguel@zerbis.dev',     '1134500003', @pw, 'active'),
  (@role_provider, 'Laura Sánchez',        'laura@zerbis.dev',      '1134500004', @pw, 'active'),
  (@role_provider, 'Roberto Gómez',        'roberto@zerbis.dev',    '1134500005', @pw, 'active'),
  (@role_provider, 'Sofía Martínez',       'sofia@zerbis.dev',      '1134500006', @pw, 'active'),
  (@role_provider, 'Diego Fernández',      'diego@zerbis.dev',      '1134500007', @pw, 'active'),
  (@role_provider, 'Valentina López',      'valentina@zerbis.dev',  '1134500008', @pw, 'active'),
  (@role_provider, 'Javier Gutiérrez',     'javier@zerbis.dev',     '1134500009', @pw, 'active'),
  (@role_provider, 'María González',       'maria@zerbis.dev',      '1134500010', @pw, 'active');

-- Perfiles de prestador
INSERT IGNORE INTO provider_profiles (user_id, headline, bio, city, avatar_url, avg_rating) VALUES
  (
    (SELECT id FROM users WHERE email='carlos@zerbis.dev'),
    'Electricista matriculado + urgencias 24h',
    'Más de 15 años de experiencia en instalaciones eléctricas residenciales e industriales. Atención en CABA y GBA.',
    'Buenos Aires',
    'https://api.dicebear.com/9.x/initials/svg?seed=CM&backgroundColor=1f6f78&fontColor=ffffff',
    4.80
  ),
  (
    (SELECT id FROM users WHERE email='ana@zerbis.dev'),
    'Pintora de interiores y exteriores',
    'Especialista en pintura decorativa, esmaltes y texturas. Presupuesto sin cargo. Trabajo prolijo y puntual.',
    'Córdoba',
    'https://api.dicebear.com/9.x/initials/svg?seed=AR&backgroundColor=34b38a&fontColor=ffffff',
    4.60
  ),
  (
    (SELECT id FROM users WHERE email='miguel@zerbis.dev'),
    'Gasista matriculado — instalaciones y service',
    'Habilitado para instalaciones de gas natural y envasado. Certificados e informes técnicos.',
    'Buenos Aires',
    'https://api.dicebear.com/9.x/initials/svg?seed=MT&backgroundColor=1f6f78&fontColor=ffffff',
    4.90
  ),
  (
    (SELECT id FROM users WHERE email='laura@zerbis.dev'),
    'Limpieza de hogares y oficinas',
    'Servicio de limpieza profunda, mantenimiento y post-obra. Equipo propio de insumos ecológicos.',
    'Rosario',
    'https://api.dicebear.com/9.x/initials/svg?seed=LS&backgroundColor=34b38a&fontColor=ffffff',
    4.70
  ),
  (
    (SELECT id FROM users WHERE email='roberto@zerbis.dev'),
    'Plomero — reparaciones y destapaciones',
    'Plomería general, destapaciones de urgencia, colocación de sanitarios. Disponible fines de semana.',
    'Buenos Aires',
    'https://api.dicebear.com/9.x/initials/svg?seed=RG&backgroundColor=1f6f78&fontColor=ffffff',
    4.50
  ),
  (
    (SELECT id FROM users WHERE email='sofia@zerbis.dev'),
    'Diseñadora gráfica — logos, redes y branding',
    'Especialista en identidad visual para pymes y emprendedores. Entrega rápida con revisiones incluidas.',
    'Buenos Aires',
    'https://api.dicebear.com/9.x/initials/svg?seed=SM&backgroundColor=34b38a&fontColor=ffffff',
    4.95
  ),
  (
    (SELECT id FROM users WHERE email='diego@zerbis.dev'),
    'Carpintero — muebles a medida y restauración',
    'Fabricación de muebles, placards, cocinas y restauración de piezas antiguas. 20 años de oficio.',
    'Mendoza',
    'https://api.dicebear.com/9.x/initials/svg?seed=DF&backgroundColor=1f6f78&fontColor=ffffff',
    4.75
  ),
  (
    (SELECT id FROM users WHERE email='valentina@zerbis.dev'),
    'Profesora particular — Matemática y Física',
    'Clases para secundaria, ingreso universitario y CBC. Modalidad presencial y virtual. Resultados garantizados.',
    'Buenos Aires',
    'https://api.dicebear.com/9.x/initials/svg?seed=VL&backgroundColor=34b38a&fontColor=ffffff',
    4.85
  ),
  (
    (SELECT id FROM users WHERE email='javier@zerbis.dev'),
    'Cerrajero — aperturas y colocación de cerraduras',
    'Apertura sin daños, cambio de cilindros, cajas de seguridad y duplicado de llaves. Urgencias las 24h.',
    'Buenos Aires',
    'https://api.dicebear.com/9.x/initials/svg?seed=JG&backgroundColor=1f6f78&fontColor=ffffff',
    4.65
  ),
  (
    (SELECT id FROM users WHERE email='maria@zerbis.dev'),
    'Jardinería y diseño de espacios verdes',
    'Diseño, mantenimiento y poda. Armado de canteros, huertas orgánicas y riego automático.',
    'Córdoba',
    'https://api.dicebear.com/9.x/initials/svg?seed=MG&backgroundColor=34b38a&fontColor=ffffff',
    4.55
  );

-- Servicios de cada prestador
INSERT IGNORE INTO provider_services (provider_id, category_id, title, description, price_from, price_unit, is_active) VALUES

-- Carlos — Electricidad
(
  (SELECT id FROM users WHERE email='carlos@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Electricidad'),
  'Instalación eléctrica residencial',
  'Tableros, circuitos, tomas e iluminación. Documentación incluida.',
  8000.00, 'trabajo', 1
),
(
  (SELECT id FROM users WHERE email='carlos@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Electricidad'),
  'Reparación y urgencias eléctricas',
  'Cortocircuitos, disyuntores, tomas dañadas. Respuesta en menos de 2 horas.',
  3500.00, 'visita', 1
),

-- Ana — Pintura
(
  (SELECT id FROM users WHERE email='ana@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Pintura'),
  'Pintura de interiores',
  'Látex, esmalte sintético y pinturas decorativas. Mano de obra + materiales.',
  5000.00, 'ambiente', 1
),
(
  (SELECT id FROM users WHERE email='ana@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Pintura'),
  'Pintura de frentes y exteriores',
  'Preparación de superficie, impermeabilización y pintura.',
  12000.00, 'trabajo', 1
),

-- Miguel — Gas
(
  (SELECT id FROM users WHERE email='miguel@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Gas y Calefacción'),
  'Instalación de gas natural',
  'Tendido de cañerías, instalación de artefactos y certificación.',
  15000.00, 'trabajo', 1
),
(
  (SELECT id FROM users WHERE email='miguel@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Gas y Calefacción'),
  'Service de calefón y caldera',
  'Limpieza, ajuste y diagnóstico completo de artefactos a gas.',
  4500.00, 'visita', 1
),

-- Laura — Limpieza
(
  (SELECT id FROM users WHERE email='laura@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Limpieza'),
  'Limpieza de hogar por horas',
  'Limpieza general de ambientes, cocina y baños. Insumos incluidos.',
  1200.00, 'hora', 1
),
(
  (SELECT id FROM users WHERE email='laura@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Limpieza'),
  'Limpieza profunda post-obra',
  'Retiro de escombros, polvo de construcción, limpieza de pisos y ababajur.',
  25000.00, 'trabajo', 1
),

-- Roberto — Plomería
(
  (SELECT id FROM users WHERE email='roberto@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Plomería'),
  'Destapación de cañerías',
  'Cocinas, baños, columnas. Equipos de alta presión. Urgencias 24h.',
  4000.00, 'visita', 1
),
(
  (SELECT id FROM users WHERE email='roberto@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Plomería'),
  'Instalación sanitaria',
  'Inodoros, lavatorios, duchas y termotanques. Planos y garantía incluidos.',
  10000.00, 'trabajo', 1
),

-- Sofía — Diseño Gráfico
(
  (SELECT id FROM users WHERE email='sofia@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Diseño Gráfico'),
  'Diseño de logo e identidad de marca',
  'Propuestas, revisiones y archivos editables finales.',
  18000.00, 'proyecto', 1
),
(
  (SELECT id FROM users WHERE email='sofia@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Diseño Gráfico'),
  'Pack de redes sociales (Instagram/Facebook)',
  '12 artes mensuales, stories y portada. Entrega en 48h.',
  8000.00, 'mes', 1
),

-- Diego — Carpintería
(
  (SELECT id FROM users WHERE email='diego@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Carpintería'),
  'Muebles a medida',
  'Cocinas, placards, bibliotecas y escritorios. Presupuesto sin cargo.',
  30000.00, 'proyecto', 1
),
(
  (SELECT id FROM users WHERE email='diego@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Carpintería'),
  'Restauración de muebles',
  'Lijado, laqueado y reemplazo de herrajes. Piezas de época y modernas.',
  5000.00, 'pieza', 1
),

-- Valentina — Clases
(
  (SELECT id FROM users WHERE email='valentina@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Clases Particulares'),
  'Matemática — Secundaria y CBC',
  'Clases individuales o grupales (hasta 3 alumnos). Online y presencial.',
  1500.00, 'hora', 1
),
(
  (SELECT id FROM users WHERE email='valentina@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Clases Particulares'),
  'Física universitaria',
  'Mecánica, termodinámica y electromagnetismo. Resolución de ejercicios y exámenes.',
  1800.00, 'hora', 1
),

-- Javier — Cerrajería
(
  (SELECT id FROM users WHERE email='javier@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Cerrajería'),
  'Apertura de puertas sin daños',
  'Técnica no destructiva. CABA y GBA. Disponible las 24 horas.',
  5000.00, 'visita', 1
),
(
  (SELECT id FROM users WHERE email='javier@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Cerrajería'),
  'Instalación de cerradura de seguridad',
  'Cerraduras de alta seguridad, bombines y cajas fuertes.',
  3500.00, 'unidad', 1
),

-- María — Jardinería
(
  (SELECT id FROM users WHERE email='maria@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Jardinería y Paisajismo'),
  'Mantenimiento mensual de jardín',
  'Corte, poda, riego y abono. Frecuencia quincenal o mensual.',
  4000.00, 'visita', 1
),
(
  (SELECT id FROM users WHERE email='maria@zerbis.dev'),
  (SELECT id FROM categories WHERE name='Jardinería y Paisajismo'),
  'Diseño y armado de jardín',
  'Proyecto de paisajismo, selección de plantas y ejecución completa.',
  20000.00, 'proyecto', 1
);

-- ─────────────────────────────────────────────────────────────
--  RUBROS DE LOS PRESTADORES DE PRUEBA
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
