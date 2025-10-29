import { useCallback, useEffect, useRef, useState } from 'react';

interface ScrollState {
    scrollY: number;
    isScrolled: boolean;
    isScrollingDown: boolean;
    scrollProgress: number;
}

interface UseSmoothScrollOptions {
    threshold?: number;
    hideOnScrollDown?: boolean;
    showOnScrollUp?: boolean;
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
    const { threshold = 10, hideOnScrollDown = false, showOnScrollUp = true } = options;

    const [scrollState, setScrollState] = useState<ScrollState>({
        scrollY: 0,
        isScrolled: false,
        isScrollingDown: false,
        scrollProgress: 0,
    });

    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const rafId = useRef<number>();

    const updateScrollState = useCallback(() => {
        const currentScrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0;

        setScrollState({
            scrollY: currentScrollY,
            isScrolled: currentScrollY > threshold,
            isScrollingDown: currentScrollY > lastScrollY.current && currentScrollY > threshold,
            scrollProgress,
        });

        lastScrollY.current = currentScrollY;
        ticking.current = false;
    }, [threshold]);

    const requestTick = useCallback(() => {
        if (!ticking.current) {
            ticking.current = true;
            rafId.current = requestAnimationFrame(updateScrollState);
        }
    }, [updateScrollState]);

    useEffect(() => {
        const handleScroll = () => {
            requestTick();
        };

        // Passive event listener untuk better performance
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial call
        updateScrollState();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [requestTick, updateScrollState]);

    // Calculate header visibility
    const isVisible = hideOnScrollDown ? !scrollState.isScrollingDown || scrollState.scrollY <= threshold : true;

    // Calculate opacity based on scroll (0 = transparent, 1 = opaque)
    const opacity = Math.min(1, scrollState.scrollY / 100);

    // Calculate blur intensity
    const blurIntensity = Math.min(10, (scrollState.scrollY / 100) * 10);

    return {
        ...scrollState,
        isVisible,
        opacity,
        blurIntensity,
    };
}



