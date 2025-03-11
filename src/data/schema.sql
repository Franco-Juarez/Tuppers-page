-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verificar si la columna role existe en la tabla users
PRAGMA table_info(users);

-- Agregar la columna role si no existe
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';

-- Actualizar el usuario administrador
UPDATE users SET role = 'admin' WHERE id = 1 OR email = 'franjuaache@gmail.com';

-- Si el usuario administrador no existe, crearlo
INSERT OR IGNORE INTO users (name, email, password, role)
VALUES ('Admin', 'franjuaache@gmail.com', 'admin123', 'admin');

-- Tabla de consultas
CREATE TABLE IF NOT EXISTS consultas (
  id_consulta INTEGER PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  id_materia INTEGER NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado TEXT DEFAULT 'pendiente', -- pendiente, aprobada, rechazada
  revisada INTEGER DEFAULT 0, -- 0 = no revisada, 1 = revisada
  reportada INTEGER DEFAULT 0, -- 0 = no reportada, 1 = reportada
  nombre_autor TEXT DEFAULT '', -- nombre del autor de la consulta
  email_autor TEXT DEFAULT '', -- email del autor de la consulta
  FOREIGN KEY (id_materia) REFERENCES materias(id_materia)
);

-- Agregar columna revisada a la tabla consultas si no existe
ALTER TABLE consultas ADD COLUMN revisada INTEGER DEFAULT 0;

-- Agregar columna reportada a la tabla consultas si no existe
ALTER TABLE consultas ADD COLUMN reportada INTEGER DEFAULT 0;

-- Agregar columna nombre_autor a la tabla consultas si no existe
ALTER TABLE consultas ADD COLUMN nombre_autor TEXT DEFAULT '';

-- Agregar columna email_autor a la tabla consultas si no existe
ALTER TABLE consultas ADD COLUMN email_autor TEXT DEFAULT '';

-- Tabla de respuestas
CREATE TABLE IF NOT EXISTS respuestas (
  id_respuesta INTEGER PRIMARY KEY,
  id_consulta INTEGER NOT NULL,
  contenido TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado TEXT DEFAULT 'pendiente', -- pendiente, aprobada, rechazada
  revisada INTEGER DEFAULT 0, -- 0 = no revisada, 1 = revisada
  reportada INTEGER DEFAULT 0, -- 0 = no reportada, 1 = reportada
  es_solucion BOOLEAN DEFAULT FALSE,
  votos INTEGER DEFAULT 0, -- contador de votos para mejor respuesta
  nombre_autor TEXT DEFAULT '', -- nombre del autor de la respuesta
  email_autor TEXT DEFAULT '', -- email del autor de la respuesta
  FOREIGN KEY (id_consulta) REFERENCES consultas(id_consulta)
);

-- Agregar columna revisada a la tabla respuestas si no existe
ALTER TABLE respuestas ADD COLUMN revisada INTEGER DEFAULT 0;

-- Agregar columna reportada a la tabla respuestas si no existe
ALTER TABLE respuestas ADD COLUMN reportada INTEGER DEFAULT 0;

-- Agregar columna votos a la tabla respuestas si no existe
ALTER TABLE respuestas ADD COLUMN votos INTEGER DEFAULT 0;

-- Agregar columna nombre_autor a la tabla respuestas si no existe
ALTER TABLE respuestas ADD COLUMN nombre_autor TEXT DEFAULT '';

-- Agregar columna email_autor a la tabla respuestas si no existe
ALTER TABLE respuestas ADD COLUMN email_autor TEXT DEFAULT ''; 