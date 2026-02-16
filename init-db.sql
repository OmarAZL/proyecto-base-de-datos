-- ============================================================
-- PROYECTO TODO LIST - BASE DE DATOS POSTGRESQL
-- Universidad de Oriente - Núcleo Nueva Esparta
-- ============================================================

-- Eliminar base de datos si existe (solo para desarrollo)
DROP DATABASE IF EXISTS todo_db;

-- Crear base de datos
CREATE DATABASE todo_db;

-- Conectar a la base de datos
\c todo_db

-- ============================================================
-- TABLA DE USUARIOS
-- ============================================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA DE CATEGORÍAS (GLOBALES)
-- ============================================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) NOT NULL CHECK (color ~ '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA DE TAREAS
-- ============================================================
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  story_points INTEGER CHECK (story_points >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pendiente' 
    CHECK (status IN ('pendiente', 'en progreso', 'en revisión', 'completado')),
  due_date DATE,
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA DE RELACIÓN TAREAS-CATEGORÍAS (MUCHOS A MUCHOS)
-- ============================================================
CREATE TABLE task_categories (
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, category_id)
);

-- ============================================================
-- TABLA DE COMENTARIOS
-- ============================================================
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- DATOS PRECARGADOS (REQUERIMIENTO DEL PROYECTO)
-- ============================================================

-- Usuarios precargados (contraseñas hasheadas con bcrypt)
-- Contraseña para ambos: "password123"
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);INSERT INTO users (name, email, password) VALUES
('Admin', 'admin@todo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Juan Pérez', 'juan@todo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('María López', 'maria@todo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Categorías precargadas
INSERT INTO categories (name, description, color) VALUES
('Trabajo', 'Tareas laborales y profesionales', '#3B82F6'),
('Personal', 'Tareas personales y del hogar', '#10B981'),
('Urgente', 'Alta prioridad - resolver inmediatamente', '#EF4444'),
('Estudio', 'Proyectos académicos y aprendizaje', '#8B5CF6'),
('Reunión', 'Preparación y seguimiento de reuniones', '#F59E0B');

-- ============================================================
-- DATOS DE PRUEBA (OPCIONAL - PARA DEMOSTRACIÓN)
-- ============================================================

-- Tarea de ejemplo
INSERT INTO tasks (name, description, story_points, status, due_date, created_by, assigned_to) VALUES
('Configurar entorno de desarrollo', 'Instalar Node.js, NestJS y PostgreSQL', 3, 'en progreso', '2026-02-10', 1, 2);

-- Comentario de ejemplo
INSERT INTO comments (task_id, user_id, content) VALUES
(1, 1, '¡Empecemos con el setup del proyecto!');

-- Asociación de categorías a tarea
INSERT INTO task_categories (task_id, category_id) VALUES
(1, 1), -- Trabajo
(1, 5); -- Reunión

-- ============================================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================================
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_task_categories_task_id ON task_categories(task_id);

-- ============================================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================================
SELECT '✅ Base de datos creada exitosamente con usuarios y categorías precargados' AS status;