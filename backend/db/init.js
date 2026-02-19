/**
 * backend/db/init.js
 *
 * Runs on server startup.
 * Creates the User table if it does not already exist.
 * This is idempotent — safe to run on every restart.
 */

'use strict';

const db = require('./connection');

const CREATE_USER_TABLE = `
  CREATE TABLE IF NOT EXISTS User (
    UserId     VARCHAR(50)  PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    phone      VARCHAR(15)  NOT NULL,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
  )
`;

/**
 * initDB - Initialises the database schema.
 * Returns a promise so the caller can await it before accepting requests.
 */
async function initDB() {
    try {
        await db.query(CREATE_USER_TABLE);
        console.log('✅ Database: User table ready.');
    } catch (err) {
        // Log the error clearly so the developer knows what went wrong,
        // but do not crash the process — the server can still serve the
        // frontend even if the DB is temporarily unavailable.
        console.error('❌ Database init failed:', err.message);
        console.error(
            '   Make sure your Aiven credentials in backend/.env are correct\n' +
            '   and that your IP is whitelisted in the Aiven dashboard.'
        );
        throw err; // re-throw so server.js can decide whether to exit
    }
}

module.exports = initDB;
