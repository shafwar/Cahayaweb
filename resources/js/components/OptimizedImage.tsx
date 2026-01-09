import { useEffect, useRef, useState } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    loading?: 'lazy' | 'eager';
    placeholder?: string;
    onLoad?: () => void;
    onError?: () => void;
}

export function OptimizedImage({
    src,
    alt,
    className = '',
    style = {},
    loading = 'lazy',
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
    onLoad,
    onError,
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Generate optimized image paths
    const getOptimizedSrc = (originalSrc: string) => {
        const filename = originalSrc.split('/').pop()?.split('.')[0];

        if (!filename) return originalSrc;

        // Check if WebP is supported
        const supportsWebP = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        };

        if (supportsWebP()) {
            return `/optimized/${filename}.webp`;
        } else {
            return `/optimized/${filename}_optimized.jpg`;
        }
    };

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (loading === 'lazy' && imgRef.current) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setIsInView(true);
                            observer.disconnect();
                        }
                    });
                },
                {
                    rootMargin: '50px',
                    threshold: 0.1,
                },
            );

            observer.observe(imgRef.current);

            return () => observer.disconnect();
        } else {
            setIsInView(true);
        }
    }, [loading]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    const optimizedSrc = getOptimizedSrc(src);
    const shouldLoad = isInView || loading === 'eager';

    return (
        <div className={`relative overflow-hidden ${className}`} style={style}>
            {/* Placeholder */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200" style={{ minHeight: '200px' }}>
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
                </div>
            )}

            {/* Optimized Image */}
            {shouldLoad && (
                <img
                    ref={imgRef}
                    src={hasError ? src : optimizedSrc}
                    alt={alt}
                    className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                    style={style}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={loading}
                />
            )}

            {/* Fallback for browsers that don't support lazy loading */}
            {!shouldLoad && <img ref={imgRef} src={placeholder} alt="" className="opacity-0" style={{ width: '100%', height: 'auto' }} />}
        </div>
    );
}
