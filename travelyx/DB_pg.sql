-- Crear extensiones necesarias para usar earthdistance (cálculo de distancias geoespaciales)
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

-- Tabla: Restaurantes
CREATE TABLE IF NOT EXISTS restaurantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    direccion TEXT,
    latitud DOUBLE PRECISION, -- Cambiado de VARCHAR a DOUBLE PRECISION
    longitud DOUBLE PRECISION, -- Cambiado de VARCHAR a DOUBLE PRECISION
    rating_promedio DECIMAL(2, 1) DEFAULT 0,
    nivel_precio VARCHAR(10),
    telefono VARCHAR(50),
    website VARCHAR(255),
    foto_portada VARCHAR(255),
    estado VARCHAR(20) CHECK (estado IN ('pending', 'active', 'blocked')) DEFAULT 'pending',
    owner_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Usuarios (Admins y Dueños)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(30) CHECK (rol IN ('SUPER_ADMIN', 'RESTAURANT_OWNER')) NOT NULL,
    nombre VARCHAR(100),
    restaurant_id INT DEFAULT NULL, -- Vinculacion directa para dueños
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurantes(id) ON DELETE SET NULL
);

-- Tabla: Platillos
CREATE TABLE IF NOT EXISTS platillos (
    id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    foto_url VARCHAR(255),
    categoria VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_restaurant_platillo FOREIGN KEY (restaurant_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

-- Insertar Super Admin por defecto (Password: admin123)
-- Usamos ON CONFLICT para evitar errores si ya existe (el email es UNIQUE)
INSERT INTO users (email, password_hash, rol, nombre) 
VALUES ('super@admin.com', 'admin123', 'SUPER_ADMIN', 'Super Admin')
ON CONFLICT (email) DO NOTHING;
