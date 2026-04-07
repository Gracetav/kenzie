const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrate() {
    // Connect without database first to create it
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        multipleStatements: true // Essential for running schema.sql
    });

    try {
        console.log('--- Database Migration Started ---');
        
        // Read schema.sql
        const schemaPath = path.join(__dirname, '../sql/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema
        await connection.query(schema);
        console.log('✔ Database and tables created successfully.');

        console.log('--- Migration Completed! ---');
        process.exit(0);
    } catch (err) {
        console.error('✘ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
