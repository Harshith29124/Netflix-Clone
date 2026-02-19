import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { UserId, name, password, email, phone } = req.body;

    if (!UserId || !name || !password || !email || !phone) {
        return res.status(400).json({ message: 'All fields required' });
    }

    let connection;
    try {
        const mysql = await import('mysql2/promise');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false }
        });

        await connection.execute(`
      CREATE TABLE IF NOT EXISTS User (
        UserId VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        const [existing] = await connection.execute(
            'SELECT UserId FROM User WHERE UserId = ? OR email = ?',
            [UserId, email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: 'User ID or email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
            'INSERT INTO User (UserId, name, password, email, phone) VALUES (?, ?, ?, ?, ?)',
            [UserId, name, hashedPassword, email, phone]
        );

        return res.status(201).json({
            success: true,
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) await connection.end();
    }
}
