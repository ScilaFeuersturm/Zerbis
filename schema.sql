-- Esquema base para plataforma de clientes y prestadores de servicios.
-- Compatible con PostgreSQL 13+.

BEGIN;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    tipo_usuario VARCHAR(12) NOT NULL CHECK (tipo_usuario IN ('CLIENTE', 'PRESTADOR')),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion TEXT,
    dni VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    email VARCHAR(150) UNIQUE,
    fecha_nacimiento DATE,
    fecha_alta TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS prestadores (
    usuario_id BIGINT PRIMARY KEY,
    descripcion_perfil TEXT,
    experiencia_anios INT CHECK (experiencia_anios >= 0),
    disponibilidad VARCHAR(120),
    radio_cobertura_km INT CHECK (radio_cobertura_km >= 0),
    tarifa_hora NUMERIC(10, 2) CHECK (tarifa_hora >= 0),
    verificado BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clientes (
    usuario_id BIGINT PRIMARY KEY,
    preferencia_contacto VARCHAR(40),
    notas TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categorias_servicio (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS prestador_categorias (
    prestador_id BIGINT NOT NULL,
    categoria_id BIGINT NOT NULL,
    nivel_experiencia VARCHAR(20) CHECK (nivel_experiencia IN ('JUNIOR', 'SEMI_SENIOR', 'SENIOR', 'EXPERTO')),
    PRIMARY KEY (prestador_id, categoria_id),
    FOREIGN KEY (prestador_id) REFERENCES prestadores(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias_servicio(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS trabajos (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    prestador_id BIGINT NOT NULL,
    categoria_id BIGINT,
    titulo VARCHAR(160) NOT NULL,
    descripcion TEXT,
    direccion_servicio TEXT,
    fecha_solicitud TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_inicio TIMESTAMPTZ,
    fecha_fin TIMESTAMPTZ,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('SOLICITADO', 'ACEPTADO', 'EN_PROCESO', 'FINALIZADO', 'CANCELADO')),
    precio_acordado NUMERIC(10, 2) CHECK (precio_acordado >= 0),
    moneda CHAR(3) DEFAULT 'ARS',
    CONSTRAINT chk_cliente_distinto_prestador CHECK (cliente_id <> prestador_id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(usuario_id) ON DELETE RESTRICT,
    FOREIGN KEY (prestador_id) REFERENCES prestadores(usuario_id) ON DELETE RESTRICT,
    FOREIGN KEY (categoria_id) REFERENCES categorias_servicio(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS trabajos_anteriores (
    id BIGSERIAL PRIMARY KEY,
    trabajo_id BIGINT UNIQUE,
    prestador_id BIGINT NOT NULL,
    cliente_id BIGINT NOT NULL,
    calificacion_cliente SMALLINT CHECK (calificacion_cliente BETWEEN 1 AND 5),
    calificacion_prestador SMALLINT CHECK (calificacion_prestador BETWEEN 1 AND 5),
    comentario_cierre TEXT,
    fecha_cierre TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (trabajo_id) REFERENCES trabajos(id) ON DELETE SET NULL,
    FOREIGN KEY (prestador_id) REFERENCES prestadores(usuario_id) ON DELETE RESTRICT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(usuario_id) ON DELETE RESTRICT,
    CONSTRAINT chk_historial_usuario_distinto CHECK (cliente_id <> prestador_id)
);

CREATE TABLE IF NOT EXISTS opiniones (
    id BIGSERIAL PRIMARY KEY,
    trabajo_id BIGINT,
    autor_id BIGINT NOT NULL,
    receptor_id BIGINT NOT NULL,
    opinion TEXT NOT NULL,
    estrellas SMALLINT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
    fecha_opinion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    es_publica BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (trabajo_id) REFERENCES trabajos(id) ON DELETE SET NULL,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (receptor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_autor_distinto_receptor CHECK (autor_id <> receptor_id)
);

CREATE TABLE IF NOT EXISTS contacto_historial (
    id BIGSERIAL PRIMARY KEY,
    emisor_id BIGINT NOT NULL,
    receptor_id BIGINT NOT NULL,
    medio VARCHAR(20) NOT NULL CHECK (medio IN ('APP', 'TELEFONO', 'EMAIL', 'WHATSAPP')),
    mensaje TEXT,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (emisor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (receptor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_contacto_emisor_receptor_distintos CHECK (emisor_id <> receptor_id)
);

CREATE INDEX IF NOT EXISTS idx_trabajos_cliente_id ON trabajos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_trabajos_prestador_id ON trabajos(prestador_id);
CREATE INDEX IF NOT EXISTS idx_trabajos_estado ON trabajos(estado);
CREATE INDEX IF NOT EXISTS idx_opiniones_receptor_id ON opiniones(receptor_id);
CREATE INDEX IF NOT EXISTS idx_opiniones_autor_id ON opiniones(autor_id);
CREATE INDEX IF NOT EXISTS idx_trabajos_anteriores_prestador_id ON trabajos_anteriores(prestador_id);
CREATE INDEX IF NOT EXISTS idx_trabajos_anteriores_cliente_id ON trabajos_anteriores(cliente_id);

COMMIT;
