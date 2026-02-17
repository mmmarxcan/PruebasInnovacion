-- Crear Base de Datos
CREATE DATABASE IF NOT EXISTS travelyx_db;
USE travelyx_db;

-- Tabla: Restaurantes
CREATE TABLE IF NOT EXISTS restaurantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    direccion TEXT,
    latitud VARCHAR(50), -- Guardamos como string para evitar problemas de presicion inicial
    longitud VARCHAR(50),
    rating_promedio DECIMAL(2, 1) DEFAULT 0,
    nivel_precio VARCHAR(10),
    telefono VARCHAR(50),
    website VARCHAR(255),
    foto_portada VARCHAR(255),
    estado ENUM('pending', 'active', 'blocked') DEFAULT 'pending',
    owner_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Usuarios (Admins y Dueños)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('SUPER_ADMIN', 'RESTAURANT_OWNER') NOT NULL,
    nombre VARCHAR(100),
    restaurant_id INT DEFAULT NULL, -- Vinculacion directa para dueños
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurantes(id) ON DELETE SET NULL
);

-- Tabla: Platillos
CREATE TABLE IF NOT EXISTS platillos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    foto_url VARCHAR(255),
    categoria VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

-- Insertar Super Admin por defecto (Password: admin123)
-- Nota: En produccion usar hash real (bcrypt). Aquí simulado.
INSERT INTO users (email, password_hash, rol, nombre) 
VALUES ('super@admin.com', 'admin123', 'SUPER_ADMIN', 'Super Admin')
ON DUPLICATE KEY UPDATE email=email;
