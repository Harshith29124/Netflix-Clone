import bcrypt from 'bcrypt';
import { getConnection } from '../lib/db.js';
import { initDB } from '../lib/init.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers',
        'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method not allowed'
        });
    }

    const { UserId, name, password, email, phone } = req.body;

    if (!UserId || !name || !password || !email || !phone) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    let connection;
    try {
        await initDB();
        connection = await getConnection();

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
        return res.status(500).json({
            message: 'Internal server error'
        });
    } finally {
        if (connection) await connection.end();
    }
}
