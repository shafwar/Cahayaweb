import { useEffect, useState } from 'react';

/**
 * Custom hook to dynamically detect and track header height
 * Handles window resize and orientation changes
 * Returns the actual header height for accurate calculations
 */
export function useHeaderHeight(): number {
    const [headerHeight, setHeaderHeight] = useState(80); // Default fallback

    useEffect(() => {
        const updateHeaderHeight = () => {
            // Try to get actual header element
            const header = document.querySelector('header');

            if (header) {
                // Get computed height including padding and border
                const height = header.getBoundingClientRect().height;
                setHeaderHeight(height);
            } else {
                // Fallback to default if header not found
                setHeaderHeight(80);
            }
        };

        // Initial measurement
        updateHeaderHeight();

        // Update on resize with debounce for performance
        let resizeTimer: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateHeaderHeight, 150);
        };

        // Update on orientation change (mobile)
        const handleOrientationChange = () => {
            setTimeout(updateHeaderHeight, 200); // Small delay for browser to adjust
        };

        // Add event listeners
        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

        // Observe header changes (if header is dynamically updated)
        const header = document.querySelector('header');
        let resizeObserver: ResizeObserver | null = null;

        if (header && typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
                updateHeaderHeight();
            });
            resizeObserver.observe(header);
        }

        // Cleanup
        return () => {
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleOrientationChange);
            if (resizeObserver && header) {
                resizeObserver.unobserve(header);
                resizeObserver.disconnect();
            }
        };
    }, []);

    return headerHeight;
}

