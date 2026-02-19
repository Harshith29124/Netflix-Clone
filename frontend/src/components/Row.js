import React, { useRef, useCallback } from 'react';
import useFetch from '../hooks/useFetch';
import { normalizeShow } from '../utils/tvmaze';
import ShowCard from './ShowCard';
import LoadingSkeleton from './LoadingSkeleton';
import './Row.css';

function Row({ title, endpoint, isTrending = false }) {
    const { data, loading, error } = useFetch(endpoint);
    const rowRef = useRef(null);

    // Normalize shows from either API shape
    const shows = React.useMemo(() => {
        if (!data || !Array.isArray(data)) return [];
        return data
            .map(item => normalizeShow(item))
            .filter(show => show && show.id); // filter out any malformed shows
    }, [data]);

    // Smooth horizontal scroll for desktop arrow buttons
    const scroll = useCallback((direction) => {
        if (!rowRef.current) return;
        const container = rowRef.current;
        const scrollAmount = container.clientWidth * 0.75;
        container.scrollBy({
            left: direction === 'right' ? scrollAmount : -scrollAmount,
            behavior: 'smooth',
        });
    }, []);

    if (error) {
        return (
            <div className="row row--error" role="alert">
                <h2 className="row__title">{title}</h2>
                <p className="row__error-msg">Failed to load shows. Please try again later.</p>
            </div>
        );
    }

    return (
        <section className={`row ${isTrending ? 'row--large' : ''}`} aria-label={title}>
            <h2 className="row__title">{title}</h2>

            <div className="row__wrapper">
                {/* Left Arrow — desktop only */}
                <button
                    className="row__arrow row__arrow--left"
                    onClick={() => scroll('left')}
                    aria-label={`Scroll ${title} left`}
                >
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                {/* Scrollable Container */}
                <div
                    ref={rowRef}
                    className="row__container"
                    role="list"
                    aria-label={`${title} shows`}
                >
                    {loading ? (
                        /* Skeleton placeholders */
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="row__skeleton-item" role="listitem" aria-hidden="true">
                                <LoadingSkeleton type="card" />
                            </div>
                        ))
                    ) : (
                        shows.map(show => (
                            <div key={show.id} className="row__item" role="listitem">
                                <ShowCard show={show} isLarge={isTrending} />
                            </div>
                        ))
                    )}
                </div>

                {/* Right Arrow — desktop only */}
                <button
                    className="row__arrow row__arrow--right"
                    onClick={() => scroll('right')}
                    aria-label={`Scroll ${title} right`}
                >
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </section>
    );
}

export default Row;
