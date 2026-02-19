import React from 'react';
import './LoadingSkeleton.css';

/**
 * LoadingSkeleton - Renders shimmer placeholder cards
 * while real content is loading.
 *
 * @param {'card' | 'banner' | 'text'} type - Shape of skeleton to render
 * @param {number} count - Number of skeleton items (for 'text' type)
 */
function LoadingSkeleton({ type = 'card', count = 3 }) {
    if (type === 'banner') {
        return (
            <div className="skeleton skeleton--banner" aria-hidden="true">
                <div className="skeleton__banner-content">
                    <div className="skeleton__line skeleton__line--title" />
                    <div className="skeleton__line skeleton__line--subtitle" />
                    <div className="skeleton__line skeleton__line--desc" />
                    <div className="skeleton__line skeleton__line--desc skeleton__line--short" />
                    <div className="skeleton__banner-buttons">
                        <div className="skeleton__btn" />
                        <div className="skeleton__btn" />
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'text') {
        return (
            <div className="skeleton skeleton--text" aria-hidden="true">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className={`skeleton__line ${i === count - 1 ? 'skeleton__line--short' : ''}`} />
                ))}
            </div>
        );
    }

    // Default: card type
    return (
        <div className="skeleton skeleton--card" aria-hidden="true" aria-label="Loading show card">
            <div className="skeleton__img" />
            <div className="skeleton__card-footer">
                <div className="skeleton__line skeleton__line--card-title" />
            </div>
        </div>
    );
}

export default LoadingSkeleton;
