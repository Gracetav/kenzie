const bcrypt = require('bcryptjs');
const db = require('../config/db');
require('dotenv').config();

async function seed() {
    const name = 'Admin Kenzie';
    const email = 'admin@kenzie.com';
    const password = 'admin123';
    
    try {
        const [exists] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (exists.length > 0) {
            console.log('Admin already exists!');
            process.exit(0);
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, 'admin']);
        console.log('Admin user created successfully!');
        console.log('Email: ' + email);
        console.log('Pass: ' + password);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
