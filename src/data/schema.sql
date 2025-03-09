-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verificar si la columna rol existe en la tabla users
PRAGMA table_info(users);

-- Agregar la columna rol si no existe
ALTER TABLE users ADD COLUMN rol TEXT DEFAULT 'user';

-- Actualizar el usuario administrador
UPDATE users SET role = 'admin' WHERE id = 1 OR email = 'franjuaache@gmail.com';

-- Si el usuario administrador no existe, crearlo
INSERT OR IGNORE INTO users (name, email, password, rol)
VALUES ('Admin', 'franjuaache@gmail.com', 'admin123', 'admin'); 