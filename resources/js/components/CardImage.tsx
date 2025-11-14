import { useEffect, useRef, useState } from 'react';

interface CardImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    onLoad?: () => void; // Callback when image finishes loading
}

export function CardImage({ src, alt, className = '', style = {}, onLoad }: CardImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    // Call parent onLoad callback when image loads
    const handleImageLoad = () => {
        setIsLoaded(true);
        if (onLoad) {
            onLoad();
        }
    };

    // Generate optimized image paths
    const getOptimizedSrc = (originalSrc: string) => {
        const filename = originalSrc
            .split('/')
            .pop()
            ?.replace(/\.(jpeg|jpg|png)$/i, '');
        if (!filename) return originalSrc;

        // Check if WebP is supported
        const supportsWebP = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            } catch {
                return false;
            }
        };

        if (supportsWebP()) {
            return `/optimized/${filename}.webp`;
        } else {
            return `/optimized/${filename}_optimized.jpg`;
        }
    };

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!imgRef.current) return;

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
                rootMargin: '100px', // Load images 100px before they enter viewport
                threshold: 0.01,
            },
        );

        observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, []);

    const optimizedSrc = getOptimizedSrc(src);

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${className}`} style={style}>
            {/* Loading placeholder */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-300 border-t-blue-500"></div>
                </div>
            )}

            {/* Lazy loaded optimized image */}
            {isInView && (
                <picture>
                    <source
                        srcSet={`/optimized/${src
                            .split('/')
                            .pop()
                            ?.replace(/\.(jpeg|jpg|png)$/i, '')}.webp`}
                        type="image/webp"
                    />
                    <source
                        srcSet={`/optimized/${src
                            .split('/')
                            .pop()
                            ?.replace(/\.(jpeg|jpg|png)$/i, '')}_optimized.jpg`}
                        type="image/jpeg"
                    />
                    <img
                        src={hasError ? src : optimizedSrc}
                        alt={alt}
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full object-cover object-center transition-all duration-500 ${
                            isLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                        }`}
                        onLoad={handleImageLoad}
                        onError={() => {
                            setHasError(true);
                            setIsLoaded(true);
                            if (onLoad) {
                                onLoad(); // Still call onLoad even on error
                            }
                        }}
                    />
                </picture>
            )}
        </div>
    );
}
