CREATE DATABASE IF NOT EXISTS zerbis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zerbis;

-- Roles fijos
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO roles(name) VALUES ('admin'), ('client'), ('provider');

-- Usuarios base
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(40),
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active','inactive','banned') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Perfiles de cliente
CREATE TABLE client_profiles (
  user_id BIGINT PRIMARY KEY,
  bio VARCHAR(500),
  city VARCHAR(120),
  avatar_url VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Perfiles de prestador
CREATE TABLE provider_profiles (
  user_id BIGINT PRIMARY KEY,
  headline VARCHAR(120),
  bio VARCHAR(800),
  city VARCHAR(120),
  avatar_url VARCHAR(500),
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categorías (ej: Plomería, Diseño, etc.)
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

-- Servicios ofrecidos por prestadores (ABM)
CREATE TABLE provider_services (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  provider_id BIGINT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(120) NOT NULL,
  description VARCHAR(800),
  price_from DECIMAL(10,2),
  price_unit VARCHAR(30), -- "hora", "trabajo", etc.
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Pedido de contacto (cliente -> prestador)
CREATE TABLE contact_requests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  client_id BIGINT NOT NULL,
  provider_id BIGINT NOT NULL,
  message VARCHAR(1000),
  status ENUM('pending','accepted','rejected','closed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (provider_id) REFERENCES users(id)
);

-- Conversaciones (mensajería interna) vinculadas a un contact_request
CREATE TABLE conversations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  contact_request_id BIGINT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_request_id) REFERENCES contact_requests(id) ON DELETE CASCADE
);

-- Mensajes
CREATE TABLE messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  conversation_id BIGINT NOT NULL,
  sender_id BIGINT NOT NULL,
  content VARCHAR(2000) NOT NULL,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Reseñas (cliente->prestador y prestador->cliente)
CREATE TABLE reviews (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  from_user_id BIGINT NOT NULL,
  to_user_id BIGINT NOT NULL,
  contact_request_id BIGINT NOT NULL,
  rating INT NOT NULL,
  comment VARCHAR(1200),
  status ENUM('visible','hidden','flagged') NOT NULL DEFAULT 'visible',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id),
  FOREIGN KEY (contact_request_id) REFERENCES contact_requests(id),
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
  UNIQUE KEY uniq_review_once (from_user_id, to_user_id, contact_request_id)
);

-- Índices útiles
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_provider_city ON provider_profiles(city);
CREATE INDEX idx_services_category ON provider_services(category_id);
CREATE INDEX idx_requests_provider ON contact_requests(provider_id, status);
CREATE INDEX idx_requests_client ON contact_requests(client_id, status);
CREATE INDEX idx_messages_convo ON messages(conversation_id, created_at);