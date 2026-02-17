const fs = require('fs');
const mysql = require('mysql2');
const csv = require('csv-parser');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'travelyx_db'
});

const csvFilePath = '../restaurantes_progreso.csv';

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        process.exit(1);
    }
    console.log('✅ Conectado a MySQL');
    importData();
});

function importData() {
    const results = [];
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(`📂 Leídas ${results.length} filas del CSV.`);

            // Mapear campos CSV a BD
            // CSV: ID,Nombre,Categoría,Dirección,Latitud,Longitud,Rating,Precio,Teléfono,Website

            const queries = results.map(row => {
                return new Promise((resolve, reject) => {
                    // Limpieza básica
                    const lat = row.Latitud || '0';
                    const lng = row.Longitud || '0';
                    const nombre = row.Nombre || 'Desconocido';

                    const q = "INSERT INTO restaurantes (nombre, categoria, direccion, latitud, longitud, estado) VALUES (?, ?, ?, ?, ?, ?)";
                    db.query(q, [nombre, row.Categoría, row.Dirección, lat, lng, 'active'], (err, res) => {
                        if (err) {
                            // Ignorar errores duplicate entry si fuera el caso, o loguear
                            // console.error('Error insertando fila:', err.message);
                            resolve(null);
                        } else {
                            resolve(res);
                        }
                    });
                });
            });

            Promise.all(queries).then(() => {
                console.log('✅ Importación completada.');
                db.end();
                process.exit(0);
            });
        });
}
