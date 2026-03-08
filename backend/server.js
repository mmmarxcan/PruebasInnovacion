const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static('uploads'));

const multer = require('multer');
const path = require('path');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Asegúrate de crear esta carpeta
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST: Subir Imagen
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json("No se subió ningún archivo.");
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.status(200).json({ url: imageUrl });
});

// Configuración de Base de Datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres', // default user en postgres es 'postgres'
    database: process.env.DB_NAME || 'travelyx_db',
    port: process.env.DB_PORT || 5432
};

// Solo agregar el password si no está vacío, para evitar el error de SASL de node-postgres
const pass = process.env.DB_PASSWORD || '';
if (pass !== '') {
    dbConfig.password = pass;
}

const db = new Pool(dbConfig);

db.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL:', err);
        return;
    }
    console.log('✅ Conectado a PostgreSQL Database');
    release(); // liberas el cliente de test de conexión rápida
});

// Rutas Básicas

// GET: Restaurantes (Público + Filtros)
app.get('/api/restaurantes', (req, res) => {
    const q = "SELECT * FROM restaurantes";
    db.query(q, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result.rows);
    });
});

// POST: Crear Restaurante (Admin/Dueño)
app.post('/api/restaurantes', (req, res) => {
    const q = "INSERT INTO restaurantes (nombre, categoria, direccion, latitud, longitud, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
    const values = [
        req.body.nombre,
        req.body.categoria,
        req.body.direccion,
        req.body.latitud,
        req.body.longitud,
        'pending' // Por defecto pendiente
    ];

    db.query(q, values, (err, result) => {
        if (err) return res.status(500).json(err);

        const restaurantId = result.rows[0].id;
        const userId = req.body.user_id;

        // Si se envió un user_id, vinculamos el restaurante al usuario
        if (userId) {
            const qUpdateUser = "UPDATE users SET restaurant_id = $1 WHERE id = $2";
            db.query(qUpdateUser, [restaurantId, userId], (err, data) => {
                if (err) return res.status(500).json(err); // Ojo: Restaurante se creó pero falló link
                return res.json({ message: "Restaurante creado y vinculado exitosamente", restaurantId });
            });
        } else {
            return res.json({ message: "Restaurante creado exitosamente", restaurantId });
        }
    });
});

// GET: Restaurante por ID
app.get('/api/restaurantes/:id', (req, res) => {
    const q = "SELECT * FROM restaurantes WHERE id = $1";
    db.query(q, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result.rows[0]);
    });
});

// PUT: Actualizar Restaurante
app.put('/api/restaurantes/:id', (req, res) => {
    const q = "UPDATE restaurantes SET nombre=$1, categoria=$2, direccion=$3, telefono=$4, website=$5, foto_portada=$6, latitud=$7, longitud=$8, manual_cerrado=$9 WHERE id=$10";
    const values = [
        req.body.nombre,
        req.body.categoria,
        req.body.direccion,
        req.body.telefono,
        req.body.website,
        req.body.foto_portada,
        req.body.latitud,
        req.body.longitud,
        req.body.manual_cerrado,
        req.params.id
    ];
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Restaurante actualizado exitosamente");
    });
});

// GET: Horarios de un Restaurante
app.get('/api/restaurantes/:id/horarios', (req, res) => {
    const q = "SELECT * FROM horarios WHERE restaurant_id = $1 ORDER BY dia_semana ASC";
    db.query(q, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result.rows);
    });
});

// PUT: Actualizar Horarios de un Restaurante
app.put('/api/restaurantes/:id/horarios', async (req, res) => {
    const { id } = req.params;
    const { schedules } = req.body; // Array de {dia_semana, apertura, cierre, cerrado}
    
    try {
        await db.query("DELETE FROM horarios WHERE restaurant_id = $1", [id]);
        
        for (const s of schedules) {
            await db.query(
                "INSERT INTO horarios (restaurant_id, dia_semana, apertura, cierre, cerrado) VALUES ($1, $2, $3, $4, $5)",
                [id, s.dia_semana, s.apertura, s.cierre, s.cerrado]
            );
        }
        res.json("Horarios actualizados exitosamente");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET: Galería de un Restaurante
app.get('/api/restaurantes/:id/galeria', (req, res) => {
    const q = "SELECT * FROM restaurante_fotos WHERE restaurant_id = $1 ORDER BY id DESC";
    db.query(q, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result.rows);
    });
});

// POST: Agregar Foto a Galería
app.post('/api/restaurantes/:id/galeria', (req, res) => {
    const { id } = req.params;
    const { foto_url } = req.body;
    const q = "INSERT INTO restaurante_fotos (restaurant_id, foto_url) VALUES ($1, $2)";
    db.query(q, [id, foto_url], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Foto agregada a la galería");
    });
});

// DELETE: Eliminar Foto de Galería
app.delete('/api/restaurantes/galeria/:photoId', (req, res) => {
    const q = "DELETE FROM restaurante_fotos WHERE id = $1";
    db.query(q, [req.params.photoId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Foto eliminada de la galería");
    });
});

// --- PLATILLOS ---

// GET: Menú de un Restaurante
app.get('/api/restaurantes/:id/platillos', (req, res) => {
    const q = "SELECT * FROM platillos WHERE restaurant_id = $1";
    db.query(q, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result.rows);
    });
});

// POST: Agregar Platillo
app.post('/api/platillos', (req, res) => {
    const q = "INSERT INTO platillos (restaurant_id, nombre, descripcion, precio, foto_url, categoria) VALUES ($1, $2, $3, $4, $5, $6)";
    const values = [
        req.body.restaurant_id,
        req.body.nombre,
        req.body.descripcion,
        req.body.precio,
        req.body.foto_url,
        req.body.categoria
    ];
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Platillo creado exitosamente");
    });
});

// DELETE: Eliminar Platillo
app.delete('/api/platillos/:id', (req, res) => {
    const q = "DELETE FROM platillos WHERE id = $1";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Platillo eliminado exitosamente");
    });
});

// PUT: Actualizar Platillo
app.put('/api/platillos/:id', (req, res) => {
    const q = "UPDATE platillos SET nombre=$1, descripcion=$2, precio=$3, foto_url=$4, categoria=$5 WHERE id=$6";
    const values = [
        req.body.nombre,
        req.body.descripcion,
        req.body.precio,
        req.body.foto_url,
        req.body.categoria,
        req.params.id
    ];
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Platillo actualizado exitosamente");
    });
});

// Login Simulado (Debería usar JWT y bcrypt)
app.post('/api/login', (req, res) => {
    console.log('📌 Request received: POST /api/login', req.body);
    const q = "SELECT * FROM users WHERE email = $1 AND password_hash = $2";

    db.query(q, [req.body.email, req.body.password], (err, result) => {
        if (err) {
            console.error('❌ Error Login DB:', err);
            return res.status(500).json(err);
        }
        if (result.rows.length === 0) {
            console.warn('⚠️ Login failed: User not found or wrong password');
            return res.status(404).json("Usuario no encontrado o contraseña incorrecta");
        }

        console.log('✅ Login successful for:', result.rows[0].email);
        // Retornar usuario sin password
        const { password_hash, ...other } = result.rows[0];
        return res.status(200).json(other);
    });
});

// --- STATISTICS & ANALYTICS (Phase 1) ---

// GET: SuperAdmin Stats
app.get('/api/super-admin/stats', async (req, res) => {
    try {
        const activeRest = await db.query("SELECT COUNT(*) FROM restaurantes WHERE estado = 'active'");
        const inactiveRest = await db.query("SELECT COUNT(*) FROM restaurantes WHERE estado = 'inactive'");
        const pendingRest = await db.query("SELECT COUNT(*) FROM restaurantes WHERE estado = 'pending'");
        const totalUsers = await db.query("SELECT COUNT(*) FROM users");

        res.json({
            activeRestaurants: parseInt(activeRest.rows[0].count),
            inactiveRestaurants: parseInt(inactiveRest.rows[0].count),
            pendingRequests: parseInt(pendingRest.rows[0].count),
            activeUsers: parseInt(totalUsers.rows[0].count)
        });
    } catch (err) {
        console.error('❌ Error fetching super-admin stats:', err);
        res.status(500).json(err);
    }
});

// GET: All Restaurants for Super Admin
app.get('/api/super-admin/restaurants', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM restaurantes ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error fetching super-admin restaurants:', err);
        res.status(500).json(err);
    }
});

// PUT: Update Restaurant Status (Approve/Reject/Block)
app.put('/api/super-admin/restaurants/:id/status', async (req, res) => {
    console.log(`📌 Recibida solicitud de cambio de estado: ID=${req.params.id}, Status=${req.body.status}`);
    try {
        const { status } = req.body;
        const { id } = req.params;
        
        const q = "UPDATE restaurantes SET estado = $1 WHERE id = $2";
        const result = await db.query(q, [status, id]);
        
        console.log(`✅ Resultado DB: Rows affected = ${result.rowCount}`);
        if (result.rowCount === 0) {
            console.warn(`⚠️ No se encontró el restaurante con ID ${id}`);
        }

        res.json({ message: `Restaurante ${id} actualizado a ${status}` });
    } catch (err) {
        console.error('❌ Error updating restaurant status:', err);
        res.status(500).json(err);
    }
});

// GET: Restaurant Analytics (Real data + some simulation for charts)
app.get('/api/admin/analytics/:restaurantId', async (req, res) => {
    try {
        const totalDishes = await db.query("SELECT COUNT(*) FROM platillos WHERE restaurant_id = $1", [req.params.restaurantId]);
        
        // Simulating weekly views but using real dish count as a factor
        const dishCount = parseInt(totalDishes.rows[0].count);
        const weeklyViews = [
            { day: 'L', value: 10 + dishCount * 2 },
            { day: 'M', value: 20 + dishCount * 3 },
            { day: 'X', value: 15 + dishCount * 2 },
            { day: 'J', value: 30 + dishCount * 4 },
            { day: 'V', value: 50 + dishCount * 5 },
            { day: 'S', value: 70 + dishCount * 6 },
            { day: 'D', value: 60 + dishCount * 5 }
        ];

        res.json({
            totalDishes: dishCount,
            weeklyViews: weeklyViews,
            interactionRate: Math.min(100, 50 + dishCount) // Just a mock formula for now
        });
    } catch (err) {
        console.error('❌ Error fetching restaurant analytics:', err);
        res.status(500).json(err);
    }
});

// Registro de Usuario Nuevo
app.post('/api/register', (req, res) => {
    console.log('📌 Request received: POST /api/register', req.body);
    // 1. Verificar si el email existe
    const qCheck = "SELECT * FROM users WHERE email = $1";
    db.query(qCheck, [req.body.email], (err, resultCheck) => {
        if (err) {
            console.error('❌ Error checking user:', err);
            return res.status(500).json(err);
        }
        if (resultCheck.rows.length > 0) return res.status(409).json("El usuario ya existe");

        // 2. Crear usuario
        const q = "INSERT INTO users (email, password_hash, rol, nombre) VALUES ($1, $2, $3, $4) RETURNING id";
        const values = [
            req.body.email,
            req.body.password,
            'RESTAURANT_OWNER',
            req.body.nombre
        ];

        db.query(q, values, (err, resultCreate) => {
            if (err) {
                console.error('❌ Error creating user:', err);
                return res.status(500).json(err);
            }
            console.log('✅ User created:', resultCreate.rows[0].id);
            return res.status(200).json({ message: "Usuario creado exitosamente", userId: resultCreate.rows[0].id });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
