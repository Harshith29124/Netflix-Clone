import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { UserId, password } = req.body;
    if (!UserId || !password) return res.status(400).json({ message: 'Fields required' });

    let connection;
    try {
        const dbHost = process.env.DB_HOST;
        const config = dbHost?.startsWith('mysql://')
            ? { uri: dbHost.split('?')[0], ssl: { rejectUnauthorized: false } }
            : {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                ssl: { rejectUnauthorized: false }
            };

        connection = await mysql.createConnection(config);

        const [users] = await connection.execute('SELECT * FROM User WHERE UserId = ?', [UserId]);
        if (users.length === 0) return res.status(401).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, users[0].password);
        if (!match) return res.status(401).json({ message: 'Invalid password' });

        return res.status(200).json({ success: true, message: 'Login successful', userId: users[0].UserId });

    } catch (error) {
        console.error('API Error:', error.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    } finally {
        if (connection) await connection.end();
    }
}
