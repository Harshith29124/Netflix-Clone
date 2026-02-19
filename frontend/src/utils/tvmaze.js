/**
 * tvmaze.js - TVMaze API endpoint configuration and helper utilities
 * All endpoints are free — no API key required.
 */

// Base API endpoints
export const API = {
    trending: 'https://api.tvmaze.com/shows?page=0',
    drama: 'https://api.tvmaze.com/search/shows?q=drama',
    action: 'https://api.tvmaze.com/search/shows?q=action',
    comedy: 'https://api.tvmaze.com/search/shows?q=comedy',
    horror: 'https://api.tvmaze.com/search/shows?q=horror',
    crime: 'https://api.tvmaze.com/search/shows?q=crime',
    scifi: 'https://api.tvmaze.com/search/shows?q=scifi',
    romance: 'https://api.tvmaze.com/search/shows?q=romance',
};

// Row display configuration
export const ROWS = [
    { title: '🔥 Trending Now', endpoint: API.trending, isTrending: true },
    { title: '🎭 Drama', endpoint: API.drama, isTrending: false },
    { title: '💥 Action', endpoint: API.action, isTrending: false },
    { title: '😂 Comedy', endpoint: API.comedy, isTrending: false },
    { title: '😱 Horror', endpoint: API.horror, isTrending: false },
    { title: '🔍 Crime', endpoint: API.crime, isTrending: false },
    { title: '🚀 Sci-Fi', endpoint: API.scifi, isTrending: false },
    { title: '❤️  Romance', endpoint: API.romance, isTrending: false },
];

// Fallback image when a show has no image
export const FALLBACK_IMAGE = 'https://via.placeholder.com/300x450/1a1a1a/808080?text=No+Image';

/**
 * Normalizes a show object from either:
 *  - Trending endpoint: the show object itself (show.image, show.name, ...)
 *  - Search endpoint: wrapped in { score, show: { ... } }
 *
 * Returns a consistent shape for all components.
 */
export function normalizeShow(item) {
    const show = item.show || item;
    return {
        id: show.id,
        name: show.name || 'Unknown Show',
        image: show.image?.medium || FALLBACK_IMAGE,
        original: show.image?.original || FALLBACK_IMAGE,
        summary: show.summary
            ? show.summary.replace(/<[^>]+>/g, '') // strip HTML tags
            : 'No description available.',
        rating: show.rating?.average || null,
        genres: show.genres || [],
        language: show.language || 'N/A',
        status: show.status || 'N/A',
        network: show.network?.name || show.webChannel?.name || 'N/A',
        premiered: show.premiered || null,
        url: show.url || null,
        // For YouTube trailer search we use the show name
        trailerQuery: encodeURIComponent(`${show.name} trailer`),
    };
}

/**
 * Returns a YouTube embed search URL for a given show name.
 * This opens a YouTube search iframe — no API key needed.
 */
export function getTrailerUrl(showName) {
    const query = encodeURIComponent(`${showName} official trailer`);
    return `https://www.youtube.com/embed?listType=search&list=${query}&autoplay=1&mute=0`;
}

/**
 * Formats a premiere date string to a readable format.
 * Returns 'N/A' if date is null.
 */
export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
