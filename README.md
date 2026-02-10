# Zerbis Backend (Express.js)

Backend en Express.js con autenticación (`login`) y acceso dinámico a tablas con permisos por usuario.

## Requisitos

- Node.js 18+
- MySQL 8+

## Instalación

```bash
npm install
cp .env.example .env
```

Configura `.env` con tus datos de base de datos y tablas permitidas.

## Ejecutar

```bash
npm run dev
# o
npm start
```

## Endpoints

### `POST /auth/login`

Recibe:

```json
{
  "user": "admin",
  "password": "secret"
}
```

Responde con:

```json
{
  "token": "jwt...",
  "user": { "id": 1, "user": "admin", "active": 1 },
  "permissions": ["users:read", "users:create", "roles:*"]
}
```

> `permissions` puede venir desde una columna JSON/string en la tabla de usuarios (`USER_PERMISSIONS_COLUMN`).

### Acceso por tabla

Todos los endpoints de `/tables/*` requieren `Authorization: Bearer <token>`.

- `GET /tables/:table` → lista con paginación (`page`, `pageSize`) y filtros (`?campo=valor`).
- `GET /tables/:table/:id` → detalle por id.
- `POST /tables/:table` → crear registro.
- `PUT /tables/:table/:id` → actualizar registro.
- `DELETE /tables/:table/:id` → eliminar registro.

Permisos esperados:

- Lectura: `<tabla>:read`
- Crear: `<tabla>:create`
- Actualizar: `<tabla>:update`
- Eliminar: `<tabla>:delete`

También soporta comodines:

- `*` acceso total
- `<tabla>:*` acceso total a una tabla

## Seguridad implementada

- Lista blanca de tablas con `TABLES_ALLOWED`.
- Validación de identificadores SQL para evitar inyección por nombres de tabla/columnas.
- Uso de placeholders (`?`) para valores SQL.
- Validación JWT.
