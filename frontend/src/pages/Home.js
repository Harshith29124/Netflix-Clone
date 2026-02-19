import React from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Row from '../components/Row';
import { ROWS } from '../utils/tvmaze';
import './Home.css';

function Home() {
    return (
        <main className="home" id="main-content">
            {/* Skip to content for accessibility */}
            <a href="#shows-section" className="home__skip-link">Skip to shows</a>

            {/* Fixed Navbar */}
            <Navbar />

            {/* Hero Banner */}
            <Banner />

            {/* Show Rows */}
            <section
                id="shows-section"
                className="home__rows"
                aria-label="Browse TV Shows by category"
            >
                {ROWS.map(row => (
                    <Row
                        key={row.endpoint}
                        title={row.title}
                        endpoint={row.endpoint}
                        isTrending={row.isTrending}
                    />
                ))}
            </section>

            {/* Footer */}
            <footer className="home__footer" role="contentinfo">
                <div className="home__footer-inner">
                    <p className="home__footer-text">
                        Questions? Call{' '}
                        <a href="tel:000-800-919-1694" className="home__footer-link">
                            000-800-919-1694
                        </a>
                    </p>

                    <nav className="home__footer-nav" aria-label="Footer navigation">
                        <a href="#faq" className="home__footer-link">FAQ</a>
                        <a href="#help" className="home__footer-link">Help Centre</a>
                        <a href="#account" className="home__footer-link">Account</a>
                        <a href="#media" className="home__footer-link">Media Centre</a>
                        <a href="#relations" className="home__footer-link">Investor Relations</a>
                        <a href="#jobs" className="home__footer-link">Jobs</a>
                        <a href="#redemption" className="home__footer-link">Redeem Gift Cards</a>
                        <a href="#buy-cards" className="home__footer-link">Buy Gift Cards</a>
                        <a href="#ways" className="home__footer-link">Ways to Watch</a>
                        <a href="#terms" className="home__footer-link">Terms of Use</a>
                        <a href="#privacy" className="home__footer-link">Privacy</a>
                        <a href="#cookies" className="home__footer-link">Cookie Preferences</a>
                        <a href="#info" className="home__footer-link">Corporate Information</a>
                        <a href="#contact" className="home__footer-link">Contact Us</a>
                        <a href="#speed" className="home__footer-link">Speed Test</a>
                        <a href="#legal" className="home__footer-link">Legal Notices</a>
                        <a href="#notices" className="home__footer-link">Only on Netflix</a>
                    </nav>

                    <div className="home__footer-country">
                        <button className="home__language-btn" aria-label="Change language">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            English
                        </button>
                    </div>

                    <p className="home__footer-copyright">
                        © {new Date().getFullYear()} Netflix Clone — Built with TVMaze API
                    </p>

                    <p className="home__footer-loc">Netflix India</p>
                </div>
            </footer>
        </main>
    );
}

export default Home;
