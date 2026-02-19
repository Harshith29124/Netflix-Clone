import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Field-level validation
function validateForm(fields) {
    const errors = {};
    if (!fields.userId || !fields.userId.trim()) {
        errors.userId = 'User ID is required.';
    }
    if (!fields.password) {
        errors.password = 'Password is required.';
    } else if (fields.password.length < 6) {
        errors.password = 'Password must be at least 6 characters.';
    }
    return errors;
}

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [fields, setFields] = useState({ userId: '', password: '' });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    // Validate a single field on blur
    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const fieldErrors = validateForm({ ...fields, [name]: e.target.value });
        setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }, [fields]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFields(prev => ({ ...prev, [name]: value }));
        // Clear error as user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (apiError) setApiError('');
    }, [errors, apiError]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched and validate
        const allTouched = { userId: true, password: true };
        setTouched(allTouched);
        const validationErrors = validateForm(fields);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);
        setApiError('');

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/login`,
                { UserId: fields.userId, password: fields.password },
                { timeout: 10000 }
            );

            if (response.data.success) {
                // Use the auth context login
                login(fields.userId);
                navigate('/', { replace: true });
            }
        } catch (err) {
            const data = err.response?.data;
            const msg =
                data?.message ||
                (err.code === 'ECONNABORTED' ? 'Request timed out. Server might be slow.' : null) ||
                (err.code === 'ECONNREFUSED' ? 'Cannot connect to server.' : null) ||
                err.message ||
                'Login failed.';
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="login-page">
            {/* Background */}
            <div className="login-page__bg" aria-hidden="true">
                <div className="login-page__bg-overlay" />
            </div>

            {/* Logo */}
            <header className="login-page__header">
                <Link to="/" className="login-page__logo" aria-label="Netflix Clone Home">
                    <svg viewBox="0 0 111 30" className="login-page__logo-svg" aria-hidden="true" focusable="false">
                        <path fill="#e50914" d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.Pick 0h5.094l3.062 7.874L105.875 0h5.187l-6 14.28zM90.47 0h-5v27.531c1.625.094 3.293.156 4.937.344L90.47 0zm-9.906 6.375h-8.875V0h-5.095v30c2.813-.094 5.625-.22 8.438-.313v-6.031h5.53v-5.25h-5.53V6.375h5.53V6.375zM50.312 12.305L45.47 0h-4.875l7.5 18.75L48 30c1.688-.156 3.344-.28 5.032-.344l-2.72-17.35zM32.345.001l-4.187 16.062L23.97 0H18.5l8.093 30c1.719 0 3.407-.03 5.094-.063L40.47.001h-8.125zm-23.407 0H3.843v27.094c1.625.062 3.25.156 4.875.25L8.938.001z" />
                    </svg>
                </Link>
            </header>

            {/* Form Box */}
            <main className="login-page__main">
                <div className="login-form-box" role="main">
                    <h1 className="login-form-box__title">Sign In</h1>

                    {/* API Error Banner */}
                    {apiError && (
                        <div className="login-form-box__api-error" role="alert" aria-live="assertive">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {apiError}
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit} noValidate aria-label="Sign in form">
                        {/* User ID Field */}
                        <div className={`form-field ${touched.userId && errors.userId ? 'form-field--error' : ''}`}>
                            <label htmlFor="login-userId" className="form-field__label">User ID</label>
                            <input
                                id="login-userId"
                                type="text"
                                name="userId"
                                className="form-field__input"
                                value={fields.userId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter your User ID"
                                autoComplete="username"
                                aria-required="true"
                                aria-invalid={!!(touched.userId && errors.userId)}
                                aria-describedby={touched.userId && errors.userId ? 'userId-error' : undefined}
                                disabled={loading}
                            />
                            {touched.userId && errors.userId && (
                                <span id="userId-error" className="form-field__error" role="alert">{errors.userId}</span>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className={`form-field ${touched.password && errors.password ? 'form-field--error' : ''}`}>
                            <label htmlFor="login-password" className="form-field__label">Password</label>
                            <div className="form-field__input-wrapper">
                                <input
                                    id="login-password"
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    className="form-field__input form-field__input--padded-right"
                                    value={fields.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    aria-required="true"
                                    aria-invalid={!!(touched.password && errors.password)}
                                    aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="form-field__eye-btn"
                                    onClick={() => setShowPass(p => !p)}
                                    aria-label={showPass ? 'Hide password' : 'Show password'}
                                    tabIndex={0}
                                >
                                    {showPass ? (
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <span id="password-error" className="form-field__error" role="alert">{errors.password}</span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            id="login-submit-btn"
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" aria-hidden="true" />
                                    <span>Signing in…</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Helper Links */}
                    <div className="login-form-box__footer">
                        <a href="#help" className="login-form-box__help-link">Need help?</a>
                        <p className="login-form-box__signup-prompt">
                            New to Netflix?{' '}
                            <Link to="/register" className="login-form-box__signup-link">
                                Sign up now
                            </Link>
                        </p>
                        <p className="login-form-box__recaptcha">
                            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
                            <a href="#learn-more" className="login-form-box__learn-more">Learn more.</a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Login;
