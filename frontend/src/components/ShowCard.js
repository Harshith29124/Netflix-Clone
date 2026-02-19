import React, { useState, useCallback } from 'react';
import { FALLBACK_IMAGE, getTrailerUrl } from '../utils/tvmaze';
import TrailerModal from './TrailerModal';
import './ShowCard.css';

function ShowCard({ show, isLarge = false }) {
    const [trailerOpen, setTrailerOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleImgError = useCallback(() => setImgError(true), []);
    const openTrailer = useCallback(() => setTrailerOpen(true), []);
    const closeTrailer = useCallback(() => setTrailerOpen(false), []);
    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    const imageSrc = imgError ? FALLBACK_IMAGE : show.image;

    return (
        <>
            <article
                className={`show-card ${isLarge ? 'show-card--large' : ''} ${isHovered ? 'show-card--hovered' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label={show.name}
            >
                {/* Card Image */}
                <div className="show-card__img-wrapper">
                    <img
                        src={imageSrc}
                        alt={show.name}
                        className="show-card__img"
                        onError={handleImgError}
                        loading="lazy"
                    />

                    {/* Hover / Tap Overlay */}
                    <div className="show-card__overlay" aria-hidden={!isHovered}>
                        <div className="show-card__overlay-content">
                            {/* Rating badge */}
                            {show.rating && (
                                <div className="show-card__rating">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="#f5c518" aria-hidden="true">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    <span>{show.rating}</span>
                                </div>
                            )}

                            {/* Show title in overlay */}
                            <h3 className="show-card__overlay-title">{show.name}</h3>

                            {/* Genres */}
                            {show.genres.length > 0 && (
                                <p className="show-card__genres">
                                    {show.genres.slice(0, 2).join(' · ')}
                                </p>
                            )}

                            {/* Meta info */}
                            <div className="show-card__meta">
                                {show.status && (
                                    <span className={`show-card__status show-card__status--${show.status.toLowerCase().replace(' ', '-')}`}>
                                        {show.status}
                                    </span>
                                )}
                                {show.premiered && (
                                    <span className="show-card__year">
                                        {show.premiered.substring(0, 4)}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="show-card__desc">
                                {show.summary.length > 100
                                    ? show.summary.substring(0, 100) + '…'
                                    : show.summary}
                            </p>

                            {/* Action Buttons */}
                            <div className="show-card__actions">
                                <button
                                    id={`play-show-${show.id}`}
                                    className="show-card__btn show-card__btn--play"
                                    onClick={openTrailer}
                                    aria-label={`Watch trailer for ${show.name}`}
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>

                                <button
                                    id={`add-list-${show.id}`}
                                    className="show-card__btn show-card__btn--add"
                                    aria-label={`Add ${show.name} to my list`}
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </button>

                                <button
                                    id={`like-show-${show.id}`}
                                    className="show-card__btn show-card__btn--like"
                                    aria-label={`Like ${show.name}`}
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Footer — always visible */}
                <div className="show-card__footer">
                    <h3 className="show-card__title">{show.name}</h3>
                </div>
            </article>

            {trailerOpen && (
                <TrailerModal
                    showName={show.name}
                    trailerUrl={getTrailerUrl(show.name)}
                    onClose={closeTrailer}
                />
            )}
        </>
    );
}

export default ShowCard;
