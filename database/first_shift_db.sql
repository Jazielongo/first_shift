CREATE DATABASE first_shift;
USE first_shift;

SELECT * FROM usuarios;
SELECT * FROM alumnos;
SELECT * FROM maestros;
SELECT * FROM clases;
SELECT * FROM alumnos_clases;
DELETE FROM clases WHERE id > 0;
DELETE FROM usuarios WHERE id > 0;

-- Tabla de roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO roles (nombre) VALUES ('Alumno'), ('Maestro'), ('Administrador');
SELECT * FROM roles;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50),
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id)
);

-- Tabla de alumnos
CREATE TABLE alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    matricula VARCHAR(30) NOT NULL UNIQUE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Tabla de maestros
CREATE TABLE maestros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    cedula_profesional VARCHAR(30) UNIQUE,
    especialidad VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Tabla de clases
CREATE TABLE clases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    codigo_clase VARCHAR(10) NOT NULL UNIQUE,
    id_maestro INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_maestro) REFERENCES maestros(id)
);

-- Relación alumnos - clases
CREATE TABLE alumnos_clases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_clase INT NOT NULL,
    fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_alumno) REFERENCES alumnos(id),
    FOREIGN KEY (id_clase) REFERENCES clases(id),
    UNIQUE (id_alumno, id_clase)
);

-- Tabla de actividades
CREATE TABLE actividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_maestro INT NOT NULL,
    fecha_entrega DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_maestro) REFERENCES maestros(id)
);

-- Relación actividades - clases
CREATE TABLE actividades_clases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_actividad INT NOT NULL,
    id_clase INT NOT NULL,
    FOREIGN KEY (id_actividad) REFERENCES actividades(id),
    FOREIGN KEY (id_clase) REFERENCES clases(id),
    UNIQUE (id_actividad, id_clase)
);

-- Resoluciones de los alumnos a las actividades
CREATE TABLE resoluciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_actividad INT NOT NULL,
    estado ENUM('pendiente', 'enviado', 'revisado') DEFAULT 'pendiente',
    observaciones TEXT,
    fecha_entrega TIMESTAMP NULL,
    FOREIGN KEY (id_alumno) REFERENCES alumnos(id),
    FOREIGN KEY (id_actividad) REFERENCES actividades(id)
);

-- Decisiones tomadas por el alumno durante la práctica Twine
CREATE TABLE decisiones_alumno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_resolucion INT NOT NULL,
    paso VARCHAR(100),
    decision TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_resolucion) REFERENCES resoluciones(id)
);



ALTER TABLE actividades DROP COLUMN archivo_twine;
-- Prácticas interactivas vinculadas a cada actividad
CREATE TABLE escenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_actividad INT NOT NULL,
    narrativa TEXT NOT NULL,
    es_final BOOLEAN DEFAULT FALSE,
    mensaje_final VARCHAR(255),
    FOREIGN KEY (id_actividad) REFERENCES actividades(id)
);

CREATE TABLE opciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    escena_id INT NOT NULL,
    opcion_texto VARCHAR(255) NOT NULL,
    escena_destino INT NOT NULL,
    es_confusora BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (escena_id) REFERENCES escenas(id),
    FOREIGN KEY (escena_destino) REFERENCES escenas(id)
);

DROP TABLE IF EXISTS decisiones_alumno;

CREATE TABLE decisiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_resolucion INT NOT NULL,
    escena_id INT NOT NULL,
    opcion_seleccionada CHAR(1) NOT NULL,
    escena_destino INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_resolucion) REFERENCES resoluciones(id),
    FOREIGN KEY (escena_id) REFERENCES escenas(id),
    FOREIGN KEY (escena_destino) REFERENCES escenas(id)
);

CREATE TABLE variables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_resolucion INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    valor VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_resolucion) REFERENCES resoluciones(id)
);


