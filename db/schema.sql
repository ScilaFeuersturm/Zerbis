-- Zerbis: marketplace de servicios para CABA (Argentina)

CREATE TABLE barrios_caba (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE rubros (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('CONTRATANTE', 'PRESTADOR')),
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni VARCHAR(20) UNIQUE NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  barrio_id INT NOT NULL REFERENCES barrios_caba(id),
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE perfiles_prestadores (
  id SERIAL PRIMARY KEY,
  usuario_id INT UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  rubro_id INT NOT NULL REFERENCES rubros(id),
  descripcion TEXT,
  referencias TEXT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE contrataciones (
  id SERIAL PRIMARY KEY,
  contratante_id INT NOT NULL REFERENCES usuarios(id),
  prestador_id INT NOT NULL REFERENCES usuarios(id),
  fecha_contratacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'EN_CURSO', 'FINALIZADA', 'CANCELADA')),
  CHECK (contratante_id <> prestador_id)
);

CREATE TABLE resenias (
  id SERIAL PRIMARY KEY,
  contratacion_id INT NOT NULL REFERENCES contrataciones(id) ON DELETE CASCADE,
  autor_id INT NOT NULL REFERENCES usuarios(id),
  destinatario_id INT NOT NULL REFERENCES usuarios(id),
  tipo_visibilidad VARCHAR(20) NOT NULL CHECK (tipo_visibilidad IN ('PUBLICA', 'SOLO_PRESTADORES')),
  puntaje SMALLINT CHECK (puntaje BETWEEN 1 AND 5),
  comentario TEXT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Regla funcional (a implementar con lógica de app o trigger):
-- 1) Reseña de contratante -> prestador => PUBLICA
-- 2) Reseña de contratante -> prestador con feedback interno => SOLO_PRESTADORES
-- 3) Reseñas SOLO_PRESTADORES deben verse solo en panel de prestadores

INSERT INTO barrios_caba (nombre) VALUES
('Agronomía'), ('Almagro'), ('Balvanera'), ('Barracas'), ('Belgrano'), ('Boedo'), ('Caballito'),
('Chacarita'), ('Coghlan'), ('Colegiales'), ('Constitución'), ('Flores'), ('Floresta'), ('La Boca'),
('La Paternal'), ('Liniers'), ('Mataderos'), ('Monte Castro'), ('Monserrat'), ('Nueva Pompeya'),
('Núñez'), ('Palermo'), ('Parque Avellaneda'), ('Parque Chacabuco'), ('Parque Chas'), ('Parque Patricios'),
('Puerto Madero'), ('Recoleta'), ('Retiro'), ('Saavedra'), ('San Cristóbal'), ('San Nicolás'),
('San Telmo'), ('Vélez Sarsfield'), ('Versalles'), ('Villa Crespo'), ('Villa del Parque'),
('Villa Devoto'), ('Villa General Mitre'), ('Villa Lugano'), ('Villa Luro'), ('Villa Ortúzar'),
('Villa Pueyrredón'), ('Villa Real'), ('Villa Riachuelo'), ('Villa Santa Rita'), ('Villa Soldati'),
('Villa Urquiza');

INSERT INTO rubros (nombre) VALUES
('Plomería'), ('Electricidad'), ('Pintura'), ('Limpieza'), ('Carpintería'), ('Mudanzas');
