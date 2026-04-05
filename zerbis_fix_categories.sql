-- =============================================================
--  ZERBIS — Fix de categorías duplicadas con encoding roto
--  Correr en MySQL Workbench con Ctrl+Shift+Enter
-- =============================================================
USE zerbis;

-- Borrar referencias a categorías con encoding roto (tienen "Ã" por mojibake)
DELETE FROM provider_categories
WHERE category_id IN (SELECT id FROM categories WHERE name LIKE '%Ã%');

DELETE FROM provider_services
WHERE category_id IN (SELECT id FROM categories WHERE name LIKE '%Ã%');

-- Borrar las categorías con encoding roto
DELETE FROM categories WHERE name LIKE '%Ã%';

-- Verificar que quedaron exactamente 30
SELECT COUNT(*) AS total_categorias FROM categories;
