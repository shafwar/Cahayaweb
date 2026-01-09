import { motion } from 'framer-motion';
import { useState } from 'react';

interface HeroImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    variants?: {
        [key: string]: {
            [key: string]: string | number;
        };
    };
    initial?: string;
    animate?: string;
    exit?: string;
}

export function HeroImage({ src, alt, className = '', style = {}, variants, initial, animate, exit }: HeroImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <motion.div
            className={`relative ${className}`}
            style={{
                ...style,
                overflow: 'hidden',
            }}
            variants={variants}
            initial={initial}
            animate={animate}
            exit={exit}
        >
            {/* Loading placeholder */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white/80"></div>
                </div>
            )}

            {/* Image */}
            <img
                src={src}
                alt={alt}
                className={`h-full w-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true);
                    setIsLoaded(true);
                }}
            />
        </motion.div>
    );
}
