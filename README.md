# Modelo de base de datos - Plataforma de clientes y prestadores

Este repositorio incluye un esquema SQL (`schema.sql`) para almacenar:

- Datos de **prestadores** y **clientes**.
- Historial de trabajos realizados.
- Opiniones y calificaciones de ambas partes.
- Información adicional relevante para operar la aplicación (categorías, contacto e historial).

## Tablas principales incluidas

1. `usuarios` (base para cualquier persona registrada)
2. `prestadores`
3. `clientes`
4. `trabajos`
5. `trabajos_anteriores`
6. `opiniones`

Y tablas de soporte:

- `categorias_servicio`
- `prestador_categorias`
- `contacto_historial`

## Cómo usar

En PostgreSQL:

```bash
psql -d tu_base -f schema.sql
```

Esto crea todas las tablas, claves foráneas e índices básicos.
