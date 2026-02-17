const express = require('express');
const mysql = require('mysql2');
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
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'travelyx_db'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL Database');
});

// Rutas Básicas

// GET: Restaurantes (Público + Filtros)
app.get('/api/restaurantes', (req, res) => {
    const q = "SELECT * FROM restaurantes";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// POST: Crear Restaurante (Admin/Dueño)
app.post('/api/restaurantes', (req, res) => {
    const q = "INSERT INTO restaurantes (`nombre`, `categoria`, `direccion`, `latitud`, `longitud`, `estado`) VALUES (?)";
    const values = [
        req.body.nombre,
        req.body.categoria,
        req.body.direccion,
        req.body.latitud,
        req.body.longitud,
        'pending' // Por defecto pendiente
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);

        const restaurantId = data.insertId;
        const userId = req.body.user_id;

        // Si se envió un user_id, vinculamos el restaurante al usuario
        if (userId) {
            const qUpdateUser = "UPDATE users SET restaurant_id = ? WHERE id = ?";
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
    const q = "SELECT * FROM restaurantes WHERE id = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data[0]);
    });
});

// PUT: Actualizar Restaurante
app.put('/api/restaurantes/:id', (req, res) => {
    const q = "UPDATE restaurantes SET nombre=?, categoria=?, direccion=?, telefono=?, website=?, foto_portada=? WHERE id=?";
    const values = [
        req.body.nombre,
        req.body.categoria,
        req.body.direccion,
        req.body.telefono,
        req.body.website,
        req.body.foto_portada,
        req.params.id
    ];
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Restaurante actualizado exitosamente");
    });
});

// --- PLATILLOS ---

// GET: Menú de un Restaurante
app.get('/api/restaurantes/:id/platillos', (req, res) => {
    const q = "SELECT * FROM platillos WHERE restaurant_id = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// POST: Agregar Platillo
app.post('/api/platillos', (req, res) => {
    const q = "INSERT INTO platillos (`restaurant_id`, `nombre`, `descripcion`, `precio`, `foto_url`, `categoria`) VALUES (?)";
    const values = [
        req.body.restaurant_id,
        req.body.nombre,
        req.body.descripcion,
        req.body.precio,
        req.body.foto_url,
        req.body.categoria
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Platillo creado exitosamente");
    });
});

// DELETE: Eliminar Platillo
app.delete('/api/platillos/:id', (req, res) => {
    const q = "DELETE FROM platillos WHERE id = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Platillo eliminado exitosamente");
    });
});

// Login Simulado (Debería usar JWT y bcrypt)
app.post('/api/login', (req, res) => {
    console.log('📌 Request received: POST /api/login', req.body);
    const q = "SELECT * FROM users WHERE email = ? AND password_hash = ?";

    db.query(q, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error('❌ Error Login DB:', err);
            return res.status(500).json(err);
        }
        if (data.length === 0) {
            console.warn('⚠️ Login failed: User not found or wrong password');
            return res.status(404).json("Usuario no encontrado o contraseña incorrecta");
        }

        console.log('✅ Login successful for:', data[0].email);
        // Retornar usuario sin password
        const { password_hash, ...other } = data[0];
        return res.status(200).json(other);
    });
});

// Registro de Usuario Nuevo
app.post('/api/register', (req, res) => {
    console.log('📌 Request received: POST /api/register', req.body);
    // 1. Verificar si el email existe
    const qCheck = "SELECT * FROM users WHERE email = ?";
    db.query(qCheck, [req.body.email], (err, data) => {
        if (err) {
            console.error('❌ Error checking user:', err);
            return res.status(500).json(err);
        }
        if (data.length > 0) return res.status(409).json("El usuario ya existe");

        // 2. Crear usuario
        const q = "INSERT INTO users (`email`, `password_hash`, `rol`, `nombre`) VALUES (?)";
        const values = [
            req.body.email,
            req.body.password,
            'RESTAURANT_OWNER',
            req.body.nombre
        ];

        db.query(q, [values], (err, data) => {
            if (err) {
                console.error('❌ Error creating user:', err);
                return res.status(500).json(err);
            }
            console.log('✅ User created:', data.insertId);
            return res.status(200).json({ message: "Usuario creado exitosamente", userId: data.insertId });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
