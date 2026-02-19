/**
 * backend/routes/auth.js
 *
 * Authentication routes:
 *   POST /api/register  — Create a new user account
 *   POST /api/login     — Authenticate an existing user
 *   GET  /api/health    — Liveness check
 *
 * Security practices:
 *  - All DB queries use parameterized statements (no string concatenation)
 *  - Passwords are hashed with bcrypt (saltRounds=10) before storage
 *  - Timing-safe comparison via bcrypt.compare (prevents timing attacks)
 *  - Duplicate UserId and duplicate email return clear, distinct errors
 */

'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db/connection');
const { registerRules, loginRules, handleValidation } = require('../middleware/validate');

const router = express.Router();
const SALT_ROUNDS = 10;

// ── Health Check ─────────────────────────────────────────────
router.get('/health', async (req, res) => {
    try {
        // Ping the database to confirm connectivity
        await db.query('SELECT 1');
        res.json({
            status: 'ok',
            message: 'Netflix Clone API is running.',
            database: 'connected',
            time: new Date().toISOString(),
        });
    } catch (err) {
        res.status(503).json({
            status: 'degraded',
            message: 'API is running but database is unreachable.',
            database: 'disconnected',
            error: err.message,
        });
    }
});

// ── Register ──────────────────────────────────────────────────
router.post('/register', registerRules, handleValidation, async (req, res, next) => {
    const { UserId, name, email, phone, password } = req.body;

    try {
        // 1. Check for duplicate UserId (parameterized query)
        const [existingById] = await db.query(
            'SELECT UserId FROM User WHERE UserId = ?',
            [UserId]
        );
        if (existingById.length > 0) {
            return res.status(409).json({
                success: false,
                message: `User ID "${UserId}" is already taken. Please choose a different one.`,
            });
        }

        // 2. Check for duplicate email (parameterized query)
        const [existingByEmail] = await db.query(
            'SELECT UserId FROM User WHERE email = ?',
            [email]
        );
        if (existingByEmail.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'An account with that email address already exists. Try signing in instead.',
            });
        }

        // 3. Hash the password — bcrypt is intentionally slow to resist brute-force
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // 4. Insert the new user (parameterized query)
        await db.query(
            'INSERT INTO User (UserId, name, password, email, phone) VALUES (?, ?, ?, ?, ?)',
            [UserId, name, hashedPassword, email, phone]
        );

        return res.status(201).json({
            success: true,
            message: 'Registration successful! You can now sign in.',
        });

    } catch (err) {
        // Pass to global error handler
        next(err);
    }
});

// ── Login ─────────────────────────────────────────────────────
router.post('/login', loginRules, handleValidation, async (req, res, next) => {
    const { UserId, password } = req.body;

    try {
        // 1. Find user by UserId (parameterized query)
        const [rows] = await db.query(
            'SELECT UserId, name, password FROM User WHERE UserId = ?',
            [UserId]
        );

        if (rows.length === 0) {
            // Return 401 — don't reveal whether the UserId or password was wrong
            // (prevents user enumeration). The message is kept vague on purpose.
            return res.status(401).json({
                success: false,
                message: 'Invalid User ID or password.',
            });
        }

        const user = rows[0];

        // 2. Timing-safe password comparison (bcrypt internally handles this)
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid User ID or password.',
            });
        }

        // 3. Success — return user info (never return the password hash)
        return res.json({
            success: true,
            message: 'Login successful. Welcome back!',
            user: {
                UserId: user.UserId,
                name: user.name,
            },
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router;
