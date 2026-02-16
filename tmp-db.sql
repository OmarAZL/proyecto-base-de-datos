DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS tareas CASCADE;
DROP TABLE IF EXISTS blacklist_tokens CASCADE;


CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tareas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT,
    story_points INTEGER CHECK (story_points >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' 
    CHECK (estado IN ('pendiente', 'en progreso', 'en revisión', 'completado')),
    fecha_entrega DATE,
    creador_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    asignado_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blacklist_tokens (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  revocado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (username, email, password) VALUES
    ('admin', 'admin@todo.com', 'admin'),
    ('juan', 'juan@todo.com', 'juan'),
    ('maria', 'maria@todo.com', 'maria'),
    ('omar', 'omar@todo.com', 'omar')
;
