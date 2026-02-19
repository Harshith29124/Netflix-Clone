import bcrypt from 'bcrypt';
import { getConnection } from '../lib/db.js';

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

    const { UserId, password } = req.body;

    if (!UserId || !password) {
        return res.status(400).json({
            message: 'UserId and password are required'
        });
    }

    let connection;
    try {
        connection = await getConnection();

        const [users] = await connection.execute(
            'SELECT * FROM User WHERE UserId = ?',
            [UserId]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        const match = await bcrypt.compare(
            password,
            users[0].password
        );

        if (!match) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    } finally {
        if (connection) await connection.end();
    }
}
