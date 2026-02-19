import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
    { label: 'Home', path: '/' },
    { label: 'TV Shows', path: '/#shows' },
    { label: 'Movies', path: '/#movies' },
    { label: 'New & Popular', path: '/#new' },
    { label: 'My List', path: '/#mylist' },
];

function Navbar() {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();

    // Become solid on scroll
    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 60);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Close mobile menu on route change
    useEffect(() => {
        setMenuOpen(false);
        setProfileOpen(false);
    }, [location]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    // Close profile dropdown on outside click
    useEffect(() => {
        if (!profileOpen) return;
        const handler = () => setProfileOpen(false);
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [profileOpen]);

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const toggleProfile = (e) => { e.stopPropagation(); setProfileOpen(prev => !prev); };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar--solid' : 'navbar--transparent'}`} role="navigation" aria-label="Main navigation">
                {/* Logo */}
                <Link to="/" className="navbar__logo" aria-label="Netflix Clone Home">
                    <svg viewBox="0 0 111 30" className="navbar__logo-svg" aria-hidden="true" focusable="false">
                        <path
                            fill="#e50914"
                            d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.Pick 0h5.094l3.062 7.874L105.875 0h5.187l-6 14.28zM90.47 0h-5v27.531c1.625.094 3.293.156 4.937.344L90.47 0zm-9.906 6.375h-8.875V0h-5.095v30c2.813-.094 5.625-.22 8.438-.313v-6.031h5.53v-5.25h-5.53V6.375h5.53V6.375zM50.312 12.305L45.47 0h-4.875l7.5 18.75L48 30c1.688-.156 3.344-.28 5.032-.344l-2.72-17.35zM32.345.001l-4.187 16.062L23.97 0H18.5l8.093 30c1.719 0 3.407-.03 5.094-.063L40.47.001h-8.125zm-23.407 0H3.843v27.094c1.625.062 3.25.156 4.875.25L8.938.001z"
                        />
                    </svg>
                </Link>

                {/* Desktop Nav Links */}
                <ul className="navbar__links">
                    {NAV_LINKS.map(link => (
                        <li key={link.label}>
                            <Link
                                to={link.path}
                                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Right Side Controls */}
                <div className="navbar__right">
                    {/* Search Icon */}
                    <button className="navbar__icon-btn" aria-label="Search">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>

                    {/* Notifications Icon */}
                    <button className="navbar__icon-btn navbar__icon-btn--desktop" aria-label="Notifications">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="navbar__profile" onClick={toggleProfile} role="button" aria-expanded={profileOpen} aria-haspopup="true" aria-label="Profile menu" tabIndex={0} onKeyDown={e => e.key === 'Enter' && toggleProfile(e)}>
                        <div className="navbar__avatar" aria-hidden="true">{user ? user.charAt(0).toUpperCase() : 'N'}</div>
                        <svg className={`navbar__caret ${profileOpen ? 'navbar__caret--open' : ''}`} viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
                            <path d="M7 10l5 5 5-5z" />
                        </svg>
                        {profileOpen && (
                            <div className="navbar__dropdown" role="menu">
                                {user ? (
                                    <>
                                        <div className="navbar__dropdown-header">
                                            <span>{user}</span>
                                        </div>
                                        <div className="navbar__dropdown-divider" />
                                        <button className="navbar__dropdown-item" role="menuitem" onClick={() => { logout(); setProfileOpen(false); }}>
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                            Sign Out of Netflix
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/register" className="navbar__dropdown-item" role="menuitem">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            Sign Up
                                        </Link>
                                        <Link to="/login" className="navbar__dropdown-item" role="menuitem">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>


                    {/* Hamburger — Mobile Only */}
                    <button
                        className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
                        onClick={toggleMenu}
                        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                    >
                        <span className="navbar__hamburger-bar" aria-hidden="true" />
                        <span className="navbar__hamburger-bar" aria-hidden="true" />
                        <span className="navbar__hamburger-bar" aria-hidden="true" />
                    </button>
                </div>
            </nav>

            {/* Mobile Full-screen Menu */}
            <div
                id="mobile-menu"
                className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}
                aria-hidden={!menuOpen}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                <button className="navbar__mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <ul className="navbar__mobile-links">
                    {NAV_LINKS.map(link => (
                        <li key={link.label}>
                            <Link
                                to={link.path}
                                className="navbar__mobile-link"
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    <li className="navbar__mobile-divider" aria-hidden="true" />
                    {user ? (
                        <li>
                            <button
                                className="navbar__mobile-link"
                                onClick={() => { logout(); setMenuOpen(false); }}
                                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', padding: '0.8rem 0' }}
                            >
                                Sign Out of Netflix
                            </button>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
                            </li>
                            <li>
                                <Link to="/register" className="navbar__mobile-link navbar__mobile-link--signup" onClick={() => setMenuOpen(false)}>
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}

                </ul>
            </div>

            {/* Mobile menu backdrop */}
            {menuOpen && (
                <div
                    className="navbar__backdrop"
                    onClick={() => setMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    );
}

export default Navbar;
