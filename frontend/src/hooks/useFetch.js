import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * useFetch - Custom hook for data fetching with proper cleanup,
 * loading, and error state management. Cancels requests on unmount
 * to prevent memory leaks.
 *
 * @param {string} url - The URL to fetch data from
 * @returns {{ data: any, loading: boolean, error: string|null }}
 */
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Guard against empty URLs
        if (!url) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(url, {
                    signal: controller.signal,
                    timeout: 10000, // 10 second timeout
                });

                if (!cancelled) {
                    setData(response.data);
                }
            } catch (err) {
                // Don't update state if request was cancelled
                if (!cancelled) {
                    if (axios.isCancel(err) || err.name === 'CanceledError') {
                        return;
                    }
                    // Provide a user-friendly error message
                    const message =
                        err.response?.data?.message ||
                        err.message ||
                        'Something went wrong. Please try again.';
                    setError(message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup: cancel the request and mark as stale
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [url]);

    return { data, loading, error };
}

export default useFetch;
