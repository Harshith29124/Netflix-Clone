import React, { useEffect, useCallback, useRef } from 'react';
import './TrailerModal.css';

function TrailerModal({ showName, trailerUrl, onClose }) {
    const modalRef = useRef(null);
    const closeRef = useRef(null);
    const previousFocusRef = useRef(null);

    // Store the element that was focused BEFORE the modal opened,
    // so we can restore focus when it closes (accessibility best practice).
    useEffect(() => {
        previousFocusRef.current = document.activeElement;
        // Focus the close button when modal opens
        closeRef.current?.focus();

        return () => {
            previousFocusRef.current?.focus();
        };
    }, []);

    // Prevent background scrolling while modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Close on Escape key
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
            return;
        }

        // Trap focus within modal for accessibility
        if (e.key === 'Tab' && modalRef.current) {
            const focusableEls = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const first = focusableEls[0];
            const last = focusableEls[focusableEls.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
            }
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Close when clicking the backdrop
    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) onClose();
    }, [onClose]);

    return (
        <div
            className="trailer-modal__backdrop"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label={`Trailer for ${showName}`}
            aria-labelledby="trailer-modal-title"
        >
            <div className="trailer-modal__container" ref={modalRef}>
                {/* Header */}
                <div className="trailer-modal__header">
                    <h2 id="trailer-modal-title" className="trailer-modal__title">
                        {showName}
                    </h2>
                    <button
                        ref={closeRef}
                        id="trailer-modal-close"
                        className="trailer-modal__close"
                        onClick={onClose}
                        aria-label="Close trailer"
                    >
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* YouTube iframe — search for trailer */}
                <div className="trailer-modal__video-wrapper">
                    <iframe
                        className="trailer-modal__iframe"
                        src={trailerUrl}
                        title={`${showName} Trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                    />
                </div>

                {/* Footer note */}
                <p className="trailer-modal__note">
                    Powered by YouTube search · Results may vary
                </p>
            </div>
        </div>
    );
}

export default TrailerModal;
