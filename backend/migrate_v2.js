const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to DB');

    // 1. Add manual_cerrado to restaurantes
    await client.query('ALTER TABLE restaurantes ADD COLUMN IF NOT EXISTS manual_cerrado BOOLEAN DEFAULT FALSE');
    console.log('Added column manual_cerrado to restaurantes');

    // 2. Create horarios table
    await client.query(`
      CREATE TABLE IF NOT EXISTS horarios (
        id SERIAL PRIMARY KEY,
        restaurant_id INT NOT NULL,
        dia_semana INT NOT NULL, -- 0 (Dom) a 6 (Sab)
        apertura TIME,
        cierre TIME,
        cerrado BOOLEAN DEFAULT FALSE,
        CONSTRAINT fk_restaurant_horario FOREIGN KEY (restaurant_id) REFERENCES restaurantes(id) ON DELETE CASCADE
      )
    `);
    console.log('Created table horarios');

    // 3. Create restaurante_fotos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurante_fotos (
        id SERIAL PRIMARY KEY,
        restaurant_id INT NOT NULL,
        foto_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_restaurant_foto FOREIGN KEY (restaurant_id) REFERENCES restaurantes(id) ON DELETE CASCADE
      )
    `);
    console.log('Created table restaurante_fotos');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
