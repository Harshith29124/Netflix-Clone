import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// ── Validation Rules ──────────────────────────────────────────
function validateField(name, value) {
    switch (name) {
        case 'userId':
            if (!value.trim()) return 'User ID is required.';
            if (value.trim().length < 3) return 'User ID must be at least 3 characters.';
            if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) return 'User ID can only contain letters, numbers, and underscores.';
            return '';

        case 'name':
            if (!value.trim()) return 'Full Name is required.';
            if (value.trim().length < 2) return 'Name must be at least 2 characters.';
            return '';

        case 'email':
            if (!value.trim()) return 'Email is required.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.';
            return '';

        case 'phone':
            if (!value.trim()) return 'Phone Number is required.';
            if (!/^[+]?[\d\s\-()]{7,15}$/.test(value.trim())) return 'Please enter a valid phone number (7–15 digits).';
            return '';

        case 'password':
            if (!value) return 'Password is required.';
            if (value.length < 8) return 'Password must be at least 8 characters.';
            if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.';
            if (!/[0-9]/.test(value)) return 'Password must contain at least one number.';
            return '';

        default:
            return '';
    }
}

function validateAll(fields) {
    const errors = {};
    Object.keys(fields).forEach(key => {
        const error = validateField(key, fields[key]);
        if (error) errors[key] = error;
    });
    return errors;
}

// ─────────────────────────────────────────────────────────────

function Register() {
    const navigate = useNavigate();

    const [fields, setFields] = useState({
        userId: '', name: '', email: '', phone: '', password: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    // Validate on blur (when user leaves a field)
    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFields(prev => ({ ...prev, [name]: value }));
        // Clear field error as user types (re-validate silently if already touched)
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
        if (apiError) setApiError('');
        if (success) setSuccess('');
    }, [touched, apiError, success]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all as touched
        const allTouched = Object.keys(fields).reduce((acc, k) => ({ ...acc, [k]: true }), {});
        setTouched(allTouched);

        const validationErrors = validateAll(fields);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);
        setApiError('');
        setSuccess('');

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/register`,
                {
                    UserId: fields.userId.trim(),
                    name: fields.name.trim(),
                    email: fields.email.trim().toLowerCase(),
                    phone: fields.phone.trim(),
                    password: fields.password,
                },
                { timeout: 10000 }
            );

            if (response.data.success) {
                setSuccess('🎉 Registration successful! Redirecting to sign in…');
                // Redirect to login after 2 seconds
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                (err.code === 'ERR_NETWORK' ? 'Cannot connect to server. Is the backend running?' : null) ||
                err.message ||
                'Registration failed. Please try again.';
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    };

    // ── Password strength helper ─────────────────────────────────
    const getPasswordStrength = () => {
        const p = fields.password;
        if (!p) return null;
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        if (score <= 1) return { label: 'Weak', color: '#e50914', width: '25%' };
        if (score === 2) return { label: 'Fair', color: '#e87c03', width: '50%' };
        if (score === 3) return { label: 'Good', color: '#46d369', width: '75%' };
        return { label: 'Strong', color: '#46d369', width: '100%' };
    };

    const strength = getPasswordStrength();

    return (
        <div className="register-page">
            {/* Background */}
            <div className="register-page__bg" aria-hidden="true">
                <div className="register-page__bg-overlay" />
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
                <div className="login-form-box register-form-box" role="main">
                    <h1 className="login-form-box__title">Create Account</h1>

                    {/* API Error Banner */}
                    {apiError && (
                        <div className="login-form-box__api-error" role="alert" aria-live="assertive">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {apiError}
                        </div>
                    )}

                    {/* Success Banner */}
                    {success && (
                        <div className="register-form-box__success" role="status" aria-live="polite">
                            {success}
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit} noValidate aria-label="Registration form">

                        {/* User ID */}
                        <div className={`form-field ${touched.userId && errors.userId ? 'form-field--error' : touched.userId && !errors.userId ? 'form-field--valid' : ''}`}>
                            <label htmlFor="reg-userId" className="form-field__label">User ID</label>
                            <input
                                id="reg-userId"
                                type="text"
                                name="userId"
                                className="form-field__input"
                                value={fields.userId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Choose a unique User ID"
                                autoComplete="username"
                                aria-required="true"
                                aria-invalid={!!(touched.userId && errors.userId)}
                                aria-describedby={errors.userId ? 'userId-error' : 'userId-hint'}
                                disabled={loading}
                            />
                            <span id="userId-hint" className="form-field__hint">Letters, numbers, and underscores only.</span>
                            {touched.userId && errors.userId && (
                                <span id="userId-error" className="form-field__error" role="alert">{errors.userId}</span>
                            )}
                            {touched.userId && !errors.userId && fields.userId && (
                                <span className="form-field__valid">✓ Looks good!</span>
                            )}
                        </div>

                        {/* Full Name */}
                        <div className={`form-field ${touched.name && errors.name ? 'form-field--error' : touched.name && !errors.name ? 'form-field--valid' : ''}`}>
                            <label htmlFor="reg-name" className="form-field__label">Full Name</label>
                            <input
                                id="reg-name"
                                type="text"
                                name="name"
                                className="form-field__input"
                                value={fields.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Your full name"
                                autoComplete="name"
                                aria-required="true"
                                aria-invalid={!!(touched.name && errors.name)}
                                aria-describedby={errors.name ? 'name-error' : undefined}
                                disabled={loading}
                            />
                            {touched.name && errors.name && (
                                <span id="name-error" className="form-field__error" role="alert">{errors.name}</span>
                            )}
                            {touched.name && !errors.name && fields.name && (
                                <span className="form-field__valid">✓ Looks good!</span>
                            )}
                        </div>

                        {/* Email */}
                        <div className={`form-field ${touched.email && errors.email ? 'form-field--error' : touched.email && !errors.email ? 'form-field--valid' : ''}`}>
                            <label htmlFor="reg-email" className="form-field__label">Email Address</label>
                            <input
                                id="reg-email"
                                type="email"
                                name="email"
                                className="form-field__input"
                                value={fields.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="you@example.com"
                                autoComplete="email"
                                aria-required="true"
                                aria-invalid={!!(touched.email && errors.email)}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                disabled={loading}
                            />
                            {touched.email && errors.email && (
                                <span id="email-error" className="form-field__error" role="alert">{errors.email}</span>
                            )}
                            {touched.email && !errors.email && fields.email && (
                                <span className="form-field__valid">✓ Looks good!</span>
                            )}
                        </div>

                        {/* Phone */}
                        <div className={`form-field ${touched.phone && errors.phone ? 'form-field--error' : touched.phone && !errors.phone ? 'form-field--valid' : ''}`}>
                            <label htmlFor="reg-phone" className="form-field__label">Phone Number</label>
                            <input
                                id="reg-phone"
                                type="tel"
                                name="phone"
                                className="form-field__input"
                                value={fields.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="+91 98765 43210"
                                autoComplete="tel"
                                aria-required="true"
                                aria-invalid={!!(touched.phone && errors.phone)}
                                aria-describedby={errors.phone ? 'phone-error' : undefined}
                                disabled={loading}
                            />
                            {touched.phone && errors.phone && (
                                <span id="phone-error" className="form-field__error" role="alert">{errors.phone}</span>
                            )}
                            {touched.phone && !errors.phone && fields.phone && (
                                <span className="form-field__valid">✓ Looks good!</span>
                            )}
                        </div>

                        {/* Password */}
                        <div className={`form-field ${touched.password && errors.password ? 'form-field--error' : touched.password && !errors.password ? 'form-field--valid' : ''}`}>
                            <label htmlFor="reg-password" className="form-field__label">Password</label>
                            <div className="form-field__input-wrapper">
                                <input
                                    id="reg-password"
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    className="form-field__input form-field__input--padded-right"
                                    value={fields.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Min. 8 chars, 1 uppercase, 1 number"
                                    autoComplete="new-password"
                                    aria-required="true"
                                    aria-invalid={!!(touched.password && errors.password)}
                                    aria-describedby="password-error password-strength"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="form-field__eye-btn"
                                    onClick={() => setShowPass(p => !p)}
                                    aria-label={showPass ? 'Hide password' : 'Show password'}
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

                            {/* Password Strength Meter */}
                            {fields.password && strength && (
                                <div className="password-strength" id="password-strength" aria-label={`Password strength: ${strength.label}`}>
                                    <div className="password-strength__bar">
                                        <div
                                            className="password-strength__fill"
                                            style={{ width: strength.width, backgroundColor: strength.color }}
                                        />
                                    </div>
                                    <span className="password-strength__label" style={{ color: strength.color }}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}

                            {touched.password && errors.password && (
                                <span id="password-error" className="form-field__error" role="alert">{errors.password}</span>
                            )}
                            {touched.password && !errors.password && fields.password && (
                                <span className="form-field__valid">✓ Password meets requirements.</span>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            id="register-submit-btn"
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" aria-hidden="true" />
                                    <span>Creating Account…</span>
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="login-form-box__footer">
                        <p className="login-form-box__signup-prompt">
                            Already have an account?{' '}
                            <Link to="/login" className="login-form-box__signup-link">Sign In</Link>
                        </p>
                        <p className="login-form-box__recaptcha">
                            By signing up, you agree to our Terms of Use and Privacy Policy.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Register;
