/**
 * backend/server.js
 *
 * Entry point for the Netflix Clone backend API.
 *
 * Startup sequence:
 *  1. Load environment variables
 *  2. Initialize database (create tables if needed)
 *  3. Configure Express middleware
 *  4. Mount routes
 *  5. Add global error handler
 *  6. Start listening
 */

'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const initDB = require('./db/init');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// ── CORS ─────────────────────────────────────────────────────
// Allow requests only from the configured frontend origin.
// In development this is http://localhost:3000.
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    // Also allow no-origin requests (e.g. Postman, curl) in development
    ...(process.env.NODE_ENV !== 'production' ? [undefined, null] : []),
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow if no origin (same-origin / server-to-server) or whitelisted
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin "${origin}" is not allowed.`));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200,
}));

// ── Body Parsing ─────────────────────────────────────────────
// Limit payload size to prevent abuse
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Security Headers (basic, no extra package needed) ────────
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// ── Request Logging (development only) ───────────────────────
if (process.env.NODE_ENV !== 'production') {
    app.use((req, _res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
}

// ── Routes ───────────────────────────────────────────────────
app.use('/api', authRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found.`,
    });
});

// ── Global Error Handler ─────────────────────────────────────
// Must have 4 parameters for Express to recognise it as an error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);

    // CORS error
    if (err.message && err.message.startsWith('CORS:')) {
        return res.status(403).json({ success: false, message: err.message });
    }

    // MySQL-specific errors
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            message: 'A record with that ID or email already exists.',
        });
    }

    // Default: 500 Internal Server Error
    // Don't leak error details in production
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({
        success: false,
        message: 'An unexpected server error occurred. Please try again later.',
        ...(isDev && { detail: err.message }),
    });
});

// ── Start Server ─────────────────────────────────────────────
async function start() {
    console.log('\n🎬 Netflix Clone Backend — Starting up…\n');

    // Attempt DB init before accepting traffic
    try {
        await initDB();
    } catch (dbErr) {
        console.warn(
            '\n⚠️  Could not connect to the database at startup.\n' +
            '   The server will still start so you can test other endpoints,\n' +
            '   but /api/register and /api/login will fail until the DB is reachable.\n' +
            '   → Fill in backend/.env with your Aiven MySQL credentials.\n'
        );
        // We intentionally do NOT exit — let the server start degraded
    }

    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log(`   Frontend origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        console.log(`   Health check:    http://localhost:${PORT}/api/health\n`);
    });
}

start();
