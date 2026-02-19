/**
 * backend/db/connection.js
 *
 * Creates a MySQL2 connection pool configured for Aiven MySQL.
 * All credentials are read from environment variables — never hardcoded.
 *
 * SSL: rejectUnauthorized=false avoids needing a ca.pem certificate
 * while still encrypting the connection in transit.
 */

'use strict';

const mysql = require('mysql2');
require('dotenv').config();

// Validate that essential env vars are present before creating the pool.
const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
    console.warn(
        `⚠️  Warning: The following database environment variables are not set: ${missingEnv.join(', ')}\n` +
        '   The application will start, but database operations will fail.\n' +
        '   Fill in backend/.env with your Aiven credentials.'
    );
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'netflix_clone',

    // Aiven requires SSL — rejectUnauthorized:false works without a CA cert
    ssl: {
        rejectUnauthorized: false,
    },

    // Connection pool settings
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,         // unlimited queue
    connectTimeout: 30000,     // 30 seconds
    idleTimeout: 60000,     // release idle connections after 60s
});

// Export the promise-based API for clean async/await usage
module.exports = pool.promise();
