const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    database: process.env.DB_NAME || 'travelyx_db',
    port: process.env.DB_PORT || 5432
};

const pass = process.env.DB_PASSWORD || '';
if (pass !== '') dbConfig.password = pass;

const db = new Pool(dbConfig);

const runMigration = async () => {
    try {
        console.log('Connecting to database...');
        // Check if column exists
        const res = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='restaurantes' and column_name='tipo';
        `);
        
        if (res.rows.length === 0) {
            console.log("Column 'tipo' not found, adding it...");
            await db.query(`ALTER TABLE restaurantes ADD COLUMN tipo VARCHAR(50) DEFAULT 'Restaurante';`);
            console.log('Migration successful: Column tipo added.');
        } else {
            console.log('Migration skipped: Column tipo already exists.');
        }
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await db.end();
    }
};

runMigration();
