import React, { useState, useEffect, useCallback } from 'react';
import useFetch from '../hooks/useFetch';
import { normalizeShow, getTrailerUrl, FALLBACK_IMAGE } from '../utils/tvmaze';
import TrailerModal from './TrailerModal';
import './Banner.css';

// Pick a random show from the first page of trending shows
function pickRandomShow(shows) {
    if (!shows || shows.length === 0) return null;
    // Filter to shows that have a good original image
    const withImages = shows.filter(s => s.image?.original);
    const pool = withImages.length > 0 ? withImages : shows;
    const randomIndex = Math.floor(Math.random() * Math.min(pool.length, 20));
    return pool[randomIndex];
}

function Banner() {
    const { data, loading, error } = useFetch('https://api.tvmaze.com/shows?page=0');
    const [show, setShow] = useState(null);
    const [trailerOpen, setTrailerOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            const picked = pickRandomShow(data);
            if (picked) setShow(normalizeShow(picked));
        }
    }, [data]);

    const handlePlayClick = useCallback(() => setTrailerOpen(true), []);
    const handleModalClose = useCallback(() => setTrailerOpen(false), []);
    const handleImageLoad = useCallback(() => setImageLoaded(true), []);
    const handleImageError = useCallback(() => setImageError(true), []);

    // Skeleton while loading
    if (loading) {
        return (
            <div className="banner banner--skeleton" aria-busy="true" aria-label="Loading featured show">
                <div className="banner__skeleton-content">
                    <div className="skeleton-line skeleton-line--title" />
                    <div className="skeleton-line skeleton-line--desc" />
                    <div className="skeleton-line skeleton-line--desc skeleton-line--short" />
                    <div className="banner__skeleton-buttons">
                        <div className="skeleton-btn" />
                        <div className="skeleton-btn" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !show) {
        return (
            <div className="banner banner--error" role="alert">
                <div className="banner__error-content">
                    <h2>Unable to load content</h2>
                    <p>Please check your connection and refresh the page.</p>
                </div>
            </div>
        );
    }

    const bgImage = imageError ? FALLBACK_IMAGE : show.original;

    return (
        <>
            <section
                className="banner"
                aria-label={`Featured show: ${show.name}`}
                role="banner"
            >
                {/* Background Image */}
                <div className="banner__bg" aria-hidden="true">
                    <img
                        src={bgImage}
                        alt=""
                        className={`banner__bg-img ${imageLoaded ? 'banner__bg-img--loaded' : ''}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        loading="eager"
                    />
                </div>

                {/* Gradient Overlays */}
                <div className="banner__gradient-bottom" aria-hidden="true" />
                <div className="banner__gradient-left" aria-hidden="true" />

                {/* Content */}
                <div className="banner__content">
                    {/* Badges */}
                    {show.genres.length > 0 && (
                        <div className="banner__badges" aria-label="Genres">
                            {show.genres.slice(0, 3).map(genre => (
                                <span key={genre} className="banner__badge">{genre}</span>
                            ))}
                        </div>
                    )}

                    <h1 className="banner__title">{show.name}</h1>

                    {show.rating && (
                        <div className="banner__rating" aria-label={`Rating: ${show.rating} out of 10`}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="#f5c518" aria-hidden="true">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span>{show.rating} / 10</span>
                        </div>
                    )}

                    <p className="banner__description">
                        {show.summary.length > 200
                            ? show.summary.substring(0, 200) + '…'
                            : show.summary}
                    </p>

                    {/* Action Buttons */}
                    <div className="banner__buttons">
                        <button
                            id="banner-play-btn"
                            className="banner__btn banner__btn--play"
                            onClick={handlePlayClick}
                            aria-label={`Watch trailer for ${show.name}`}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>Play</span>
                        </button>

                        <button
                            id="banner-info-btn"
                            className="banner__btn banner__btn--info"
                            aria-label={`More info about ${show.name}`}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                            <span>More Info</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Trailer Modal */}
            {trailerOpen && (
                <TrailerModal
                    showName={show.name}
                    trailerUrl={getTrailerUrl(show.name)}
                    onClose={handleModalClose}
                />
            )}
        </>
    );
}

export default Banner;
