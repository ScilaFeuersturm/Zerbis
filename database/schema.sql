-- Esquema base para usuarios, roles y avisos/comunidad

-- 1) Tipos de usuario: 1 admin, 2 prestador, 3 cliente
CREATE TABLE IF NOT EXISTS tipos_usuario (
    id SMALLINT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO tipos_usuario (id, nombre) VALUES
    (1, 'admin'),
    (2, 'prestador'),
    (3, 'cliente')
ON CONFLICT (id) DO NOTHING;

-- 2) Tabla de roles (dos campos solicitados)
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    moderador BOOLEAN NOT NULL DEFAULT FALSE,
    masterofall BOOLEAN NOT NULL DEFAULT FALSE,
    CHECK (moderador OR masterofall)
);

-- 3) Tabla de admins
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    tipo_usuario_id SMALLINT NOT NULL DEFAULT 1 REFERENCES tipos_usuario(id)
);

-- 4) Clientes con usuario y password
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    tipo_usuario_id SMALLINT NOT NULL DEFAULT 3 REFERENCES tipos_usuario(id)
);

-- 5) Prestadores con usuario y password
CREATE TABLE IF NOT EXISTS prestadores (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    tipo_usuario_id SMALLINT NOT NULL DEFAULT 2 REFERENCES tipos_usuario(id)
);

-- 6) Tabla de avisos/noticias para la comunidad
CREATE TABLE IF NOT EXISTS avisos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    visible_en_feed BOOLEAN NOT NULL DEFAULT TRUE, -- 1/0 visible/no visible
    publico_objetivo VARCHAR(20) NOT NULL DEFAULT 'todos', -- todos | clientes | prestadores
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (publico_objetivo IN ('todos', 'clientes', 'prestadores'))
);

-- Compatibilidad si las tablas ya existían sin credenciales
ALTER TABLE IF EXISTS clientes
    ADD COLUMN IF NOT EXISTS usuario VARCHAR(100),
    ADD COLUMN IF NOT EXISTS password VARCHAR(255),
    ADD COLUMN IF NOT EXISTS tipo_usuario_id SMALLINT DEFAULT 3 REFERENCES tipos_usuario(id);

ALTER TABLE IF EXISTS prestadores
    ADD COLUMN IF NOT EXISTS usuario VARCHAR(100),
    ADD COLUMN IF NOT EXISTS password VARCHAR(255),
    ADD COLUMN IF NOT EXISTS tipo_usuario_id SMALLINT DEFAULT 2 REFERENCES tipos_usuario(id);
