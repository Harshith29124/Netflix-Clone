import { getConnection } from './db.js';

export async function initDB() {
    const connection = await getConnection();
    try {
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
        console.log('Table ready');
    } finally {
        await connection.end();
    }
}
