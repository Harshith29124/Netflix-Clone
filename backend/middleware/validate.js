/**
 * backend/middleware/validate.js
 *
 * Express-Validator rule sets for the auth endpoints.
 * Keeps validation logic separate from route handlers.
 */

'use strict';

const { body, validationResult } = require('express-validator');

// ── Reusable validation chains ────────────────────────────────

const registerRules = [
    body('UserId')
        .trim()
        .notEmpty().withMessage('User ID is required.')
        .isLength({ min: 3, max: 50 }).withMessage('User ID must be 3–50 characters.')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('User ID may only contain letters, numbers, and underscores.'),

    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required.')
        .matches(/^[+]?[\d\s\-(]{7,15}$/).withMessage('Please provide a valid phone number.'),

    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
        .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
];

const loginRules = [
    body('UserId')
        .trim()
        .notEmpty().withMessage('User ID is required.'),

    body('password')
        .notEmpty().withMessage('Password is required.'),
];

// ── Validation result handler ─────────────────────────────────

/**
 * handleValidation - middleware that checks for validation errors
 * and returns a structured 422 response if any exist.
 * Must be used AFTER the validation rule chains.
 */
function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return the first error for simplicity on the client side
        return res.status(422).json({
            success: false,
            message: errors.array()[0].msg,
            errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
        });
    }
    next();
}

module.exports = { registerRules, loginRules, handleValidation };
