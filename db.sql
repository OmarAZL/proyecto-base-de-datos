-- Eliminar base de datos si existe (solo para desarrollo)
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS tareas CASCADE;
DROP TABLE IF EXISTS blacklist_tokens CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS tareas_categorias CASCADE;

-- ============================================================
-- TABLA DE USUARIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- ============================================================
-- TABLA DE TAREAS
-- ============================================================
CREATE TABLE IF NOT EXISTS tareas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT,
    story_points INTEGER CHECK (story_points >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' 
    CHECK (estado IN ('pendiente', 'en progreso', 'en revisión', 'completado')),
    fecha_entrega DATE,
    creador_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    asignado_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLA DE CATEGORÍAS
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion VARCHAR(255) ,
  color VARCHAR(7) NOT NULL CHECK (color ~ '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')
);

-- ============================================================
-- TABLA DE RELACIÓN TAREAS-CATEGORÍAS (MUCHOS A MUCHOS)
-- ============================================================
CREATE TABLE IF NOT EXISTS tareas_categorias (
  tarea_id INTEGER NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  PRIMARY KEY (tarea_id, categoria_id)
);

-- ============================================================
-- TABLA DE COMENTARIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS comentarios (
  id SERIAL PRIMARY KEY,
  fecha_creacion DATE DEFAULT CURRENT_DATE,
  contenido TEXT NOT NULL,
  tarea_id INTEGER NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
  creador_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLA PARA DESHABILITAR LOS TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS blacklist_tokens (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  revocado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- DATOS DE PRUEBA (OPCIONAL - PARA DEMOSTRACIÓN)
-- ============================================================

-- Usuarios precargadas
INSERT INTO usuarios (username, email, password) VALUES
    ('admin', 'admin@todo.com', 'admin'),
    ('juan', 'juan@todo.com', 'juan'),
    ('maria', 'maria@todo.com', 'maria'),
    ('omar', 'omar@todo.com', 'omar')
;

-- Categorías precargadas
INSERT INTO categorias (nombre, descripcion, color) VALUES
('Trabajo', 'Tareas laborales y profesionales', '#3B82F6'),
('Personal', 'Tareas personales y del hogar', '#10B981'),
('Urgente', 'Alta prioridad - resolver inmediatamente', '#EF4444'),
('Estudio', 'Proyectos académicos y aprendizaje', '#8B5CF6'),
('Reunión', 'Preparación y seguimiento de reuniones', '#F59E0B');

-- Tarea de ejemplo
INSERT INTO tareas (nombre, descripcion, story_points, estado, fecha_entrega, creador_id, asignado_id) VALUES
('Configurar entorno de desarrollo', 'Instalar Node.js, NestJS y PostgreSQL', 3, 'en progreso', '2026-02-10', 1, 2);

-- Comentario de ejemplo
INSERT INTO comentarios (contenido, tarea_id, creador_id) VALUES
('¡Empecemos con el setup del proyecto!', 1, 1);

-- Asociación de categorías a tarea
INSERT INTO tareas_categorias (tarea_id, categoria_id) VALUES
(1, 1), -- Trabajo
(1, 3); -- Urgente