import { useCallback, useEffect, useRef } from 'react';

interface ScrollOptimizerProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function ScrollOptimizer({ children, className = '', style = {} }: ScrollOptimizerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>();
    const lastScrollTime = useRef<number>(0);

    // Throttled scroll handler for better performance
    const handleScroll = useCallback((e: Event) => {
        const now = Date.now();
        if (now - lastScrollTime.current < 16) return; // ~60fps

        lastScrollTime.current = now;

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            // Smooth scroll handling
            const target = e.target as HTMLElement;
            if (target) {
                // Add smooth scroll behavior
                target.style.scrollBehavior = 'smooth';
            }
        });
    }, []);

    // Optimize scroll performance
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Add scroll event listener with passive option for better performance
        container.addEventListener('scroll', handleScroll, { passive: true });

        // Optimize CSS for better scroll performance
        container.style.willChange = 'scroll-position';
        container.style.transform = 'translateZ(0)'; // Force hardware acceleration
        container.style.backfaceVisibility = 'hidden';
        container.style.perspective = '1000px';

        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [handleScroll]);

    return (
        <div
            ref={containerRef}
            className={`scroll-optimized ${className}`}
            style={{
                ...style,
                // CSS optimizations for smooth scrolling
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                contain: 'layout style paint',
            }}
        >
            {children}
        </div>
    );
}

// Hook for scroll performance optimization
export function useScrollOptimization() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);

    const optimizeScroll = useCallback(() => {
        if (!scrollRef.current) return;

        const element = scrollRef.current;

        // Add performance optimizations
        element.style.willChange = 'scroll-position';
        element.style.transform = 'translateZ(0)';
        element.style.backfaceVisibility = 'hidden';

        // Smooth scroll behavior
        element.style.scrollBehavior = 'smooth';
        element.style.WebkitOverflowScrolling = 'touch';
        element.style.overscrollBehavior = 'contain';
    }, []);

    const handleScrollStart = useCallback(() => {
        isScrollingRef.current = true;
        if (scrollRef.current) {
            scrollRef.current.style.willChange = 'scroll-position';
        }
    }, []);

    const handleScrollEnd = useCallback(() => {
        isScrollingRef.current = false;
        if (scrollRef.current) {
            scrollRef.current.style.willChange = 'auto';
        }
    }, []);

    useEffect(() => {
        optimizeScroll();
    }, [optimizeScroll]);

    return {
        scrollRef,
        isScrolling: isScrollingRef.current,
        handleScrollStart,
        handleScrollEnd,
        optimizeScroll,
    };
}
