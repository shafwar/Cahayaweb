import SeoHead from '@/components/SeoHead';
import { RippleButton } from '@/components/ui/ripple-button';
import { getR2Url } from '@/utils/imageHelper';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export default function SelectMode() {
    const [showSplash, setShowSplash] = useState(true);
    const [nextPath, setNextPath] = useState<string | null>(null);

    useEffect(() => {
        // Support redirect back after forced splash (e.g. user clicked /home from Google).
        try {
            const params = new URLSearchParams(window.location.search);
            const next = params.get('next');
            if (next && next.startsWith('/') && !next.startsWith('//')) {
                setNextPath(next);
            }
        } catch {
            // ignore
        }

        const visited = localStorage.getItem('cahaya-anbiya-visited');
        const sessionVisited = sessionStorage.getItem('cahaya-anbiya-session');

        if (sessionVisited) {
            setShowSplash(false);
        } else if (visited) {
            const timer = setTimeout(() => {
                setShowSplash(false);
                sessionStorage.setItem('cahaya-anbiya-session', 'true');
            }, 2800);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setShowSplash(false);
                localStorage.setItem('cahaya-anbiya-visited', 'true');
                sessionStorage.setItem('cahaya-anbiya-session', 'true');
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Premium easing curves
    const ease = [0.22, 1, 0.36, 1];
    const smoothEase = [0.25, 0.46, 0.45, 0.94];

    // Optimized splash screen animation - GPU accelerated, no blur
    const splashVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: smoothEase,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.98,
            transition: {
                duration: 0.5,
                ease: smoothEase,
            },
        },
    };

    // Optimized logo reveal - GPU accelerated, no blur filter
    const logoVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: smoothEase,
                delay: 0.1,
            },
        },
    };

    // Optimized text reveal - GPU accelerated, no blur filter
    const textRevealVariants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: (delay: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: smoothEase,
                delay,
            },
        }),
    };

    // Shimmer animation for gold text
    const shimmerVariants = {
        hidden: { backgroundPosition: '-200% center' },
        visible: {
            backgroundPosition: '200% center',
            transition: {
                duration: 2,
                ease: 'linear',
                repeat: Infinity,
                delay: 1.5,
            },
        },
    };

    // Optimized ambient glow - simplified for better performance
    const glowVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: [0.3, 0.5, 0.3],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    // Optimized particles - reduced complexity for smooth animation
    const particleVariants = {
        hidden: { opacity: 0 },
        visible: (i: number) => ({
            opacity: [0, 0.3, 0],
            y: [-20, -80],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.2,
            },
        }),
    };

    // Loading dots with smooth wave - Smoother animation
    const dotVariants = {
        hidden: { opacity: 0, scale: 0.6 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: 1.2,
                ease: smoothEase,
            },
        },
    };

    // Container with stagger
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    // Fade-in-up for cards
    const fadeInUp = {
        hidden: {
            opacity: 0,
            y: 24,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease,
            },
        },
    };

    return (
        <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-gradient-to-br from-black via-slate-950 to-black p-4 text-foreground sm:p-6">
            <SeoHead
                title="Cahaya Anbiya Travel"
                description="Pilih mode layanan B2C atau B2B di Cahaya Anbiya Travel untuk perjalanan umrah dan wisata halal terbaik."
            />

            {/* Cinematic Splash Screen with Enhanced Animations - ENLARGED MOBILE */}
            <AnimatePresence mode="wait">
                {showSplash && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-black"
                        variants={splashVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{
                            willChange: 'opacity, transform',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'translateZ(0)',
                        }}
                    >
                        {/* Optimized ambient glow - single layer for better performance */}
                        <motion.div
                            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.12),transparent_60%)]"
                            variants={glowVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                                willChange: 'opacity',
                                backfaceVisibility: 'hidden',
                                transform: 'translateZ(0)',
                            }}
                        />

                        {/* Optimized floating particles - reduced count for performance */}
                        <div className="absolute inset-0 overflow-hidden" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    variants={particleVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="absolute h-1 w-1 rounded-full bg-gradient-to-r from-amber-400/30 to-orange-400/15"
                                    style={{
                                        left: `${15 + i * 20}%`,
                                        top: `${40 + (i % 2) * 20}%`,
                                        willChange: 'transform, opacity',
                                        backfaceVisibility: 'hidden',
                                        transform: 'translateZ(0)',
                                    }}
                                />
                            ))}
                        </div>

                        <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                            {/* Logo - Optimized with GPU acceleration */}
                            <motion.div
                                variants={logoVariants}
                                initial="hidden"
                                animate="visible"
                                className="mb-6 sm:mb-8 md:mb-12"
                                style={{
                                    willChange: 'transform, opacity',
                                    backfaceVisibility: 'hidden',
                                    transform: 'translateZ(0)',
                                }}
                            >
                                <motion.img
                                    src={getR2Url('/cahayanbiyalogo.png')}
                                    alt="Cahaya Anbiya Logo"
                                    className="h-auto w-[50vw] max-w-[280px] sm:h-40 sm:w-auto md:h-48 lg:h-56 xl:h-64"
                                    style={{
                                        filter: 'drop-shadow(0 0 30px rgba(254,201,1,0.25))',
                                        willChange: 'transform',
                                        backfaceVisibility: 'hidden',
                                    }}
                                    onError={(e) => {
                                        // Fallback to local logo if R2 logo fails
                                        const target = e.currentTarget;
                                        if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                                            // Try alternative R2 path variations, never fallback to local
                                            const currentUrl = target.src;
                                            let altPath = currentUrl;
                                            if (currentUrl.includes('/public/images/')) {
                                                altPath = currentUrl.replace('/public/images/', '/images/');
                                            } else if (currentUrl.includes('/public/')) {
                                                altPath = currentUrl.replace('/public/', '/');
                                            } else if (currentUrl.includes('/images/')) {
                                                altPath = currentUrl.replace('/images/', '/public/images/');
                                            } else {
                                                altPath = 'https://assets.cahayaanbiya.com/public/images/cahayanbiyalogo.png';
                                            }
                                            console.log('[Select Mode Logo] Trying alternative R2 path:', altPath);
                                            target.src = altPath;
                                        }
                                    }}
                                />
                            </motion.div>

                            {/* "Welcome to" text - GPU accelerated */}
                            <motion.h1
                                custom={0.4}
                                variants={textRevealVariants}
                                initial="hidden"
                                animate="visible"
                                className="mb-3 text-xl font-light tracking-wide text-white/90 sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    willChange: 'transform, opacity',
                                    backfaceVisibility: 'hidden',
                                    transform: 'translateZ(0)',
                                }}
                            >
                                Welcome to
                            </motion.h1>

                            {/* Brand name - GPU accelerated */}
                            <motion.h2
                                custom={0.6}
                                variants={textRevealVariants}
                                initial="hidden"
                                animate="visible"
                                className="relative mb-3 text-[32px] leading-[1.1] font-semibold tracking-tight sm:mb-3 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    willChange: 'transform, opacity',
                                    backfaceVisibility: 'hidden',
                                    transform: 'translateZ(0)',
                                }}
                            >
                                <motion.span
                                    className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent"
                                    style={{
                                        backgroundSize: '200% 100%',
                                    }}
                                    variants={shimmerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    Cahaya Anbiya
                                </motion.span>
                            </motion.h2>

                            {/* Subtitle - GPU accelerated */}
                            <motion.p
                                custom={0.8}
                                variants={textRevealVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-sm font-light tracking-widest text-white/50 sm:text-base md:text-lg lg:text-xl"
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    letterSpacing: '0.25em',
                                    willChange: 'transform, opacity',
                                    backfaceVisibility: 'hidden',
                                    transform: 'translateZ(0)',
                                }}
                            >
                                WISATA INDONESIA
                            </motion.p>

                            {/* Loading dots - Optimized with GPU acceleration */}
                            <motion.div
                                variants={dotVariants}
                                initial="hidden"
                                animate="visible"
                                className="mt-8 flex gap-2.5 sm:mt-10 md:mt-12"
                                style={{
                                    willChange: 'transform, opacity',
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 sm:h-2 sm:w-2"
                                        animate={{
                                            opacity: [0.4, 1, 0.4],
                                            scale: [1, 1.15, 1],
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                            ease: 'easeInOut',
                                        }}
                                        style={{
                                            boxShadow: '0 0 8px rgba(254,201,1,0.4)',
                                            willChange: 'transform, opacity',
                                            backfaceVisibility: 'hidden',
                                            transform: 'translateZ(0)',
                                        }}
                                    />
                                ))}
                            </motion.div>
                        </div>

                        {/* Subtle vignette overlay for depth */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Optimized gradient background - Reduced blur for better performance */}
            <div className="pointer-events-none absolute inset-0" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
                <div
                    className="absolute -top-20 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.05),transparent_70%)] blur-xl sm:-top-40 sm:h-[600px] sm:w-[800px]"
                    style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                />
                <div
                    className="absolute right-0 -bottom-20 h-[300px] w-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,84,255,0.04),transparent_70%)] blur-xl sm:-bottom-40 sm:h-[500px] sm:w-[600px]"
                    style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                />
            </div>

            {/* Main content */}
            <motion.div
                className="relative z-10 w-full max-w-6xl px-3 sm:px-0"
                variants={containerVariants}
                initial="hidden"
                animate={!showSplash ? 'show' : 'hidden'}
            >
                {/* Header - Optimized for mobile */}
                <motion.div className="mb-6 text-center sm:mb-12 md:mb-16" variants={fadeInUp}>
                    <h1 className="mb-1.5 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-xl font-semibold tracking-tight text-transparent sm:mb-3 sm:text-3xl md:text-4xl lg:text-5xl">
                        Cahaya Anbiya Wisata
                    </h1>
                    <p className="text-[10px] font-light tracking-wide text-white/40 sm:text-sm md:text-base">Choose your experience</p>
                </motion.div>

                {/* Cards Grid - Optimized spacing for mobile */}
                <motion.div className="grid gap-3 sm:gap-6 lg:grid-cols-2" variants={containerVariants}>
                    {/* B2B Card - Optimized for mobile */}
                    <motion.div
                        variants={fadeInUp}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.3, ease }}
                        className="group relative overflow-hidden rounded-xl border border-blue-500/10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90 p-4 shadow-2xl sm:rounded-2xl sm:p-6 md:p-8"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-400/0 to-cyan-500/0 opacity-0 transition-all duration-700 group-hover:from-blue-500/5 group-hover:via-blue-400/3 group-hover:to-cyan-500/5 group-hover:opacity-100" />
                        <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 opacity-60 shadow-[0_0_20px_rgba(254,201,1,0.5)] transition-all duration-700 ease-out group-hover:w-full" />
                        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-blue-400/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="relative z-10">
                            <div className="mb-2.5 sm:mb-4">
                                <div className="inline-block rounded-lg bg-blue-500/15 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-blue-300 ring-1 ring-blue-400/30 sm:px-3 sm:py-1.5 sm:text-xs">
                                    CORPORATE
                                </div>
                            </div>
                            <h2 className="mb-1.5 text-lg font-semibold text-white sm:mb-3 sm:text-2xl">Business to Business</h2>
                            <p className="mb-4 text-xs leading-relaxed text-white/60 sm:mb-8 sm:text-base sm:text-white/50">
                                Tailored solutions for travel agencies and corporate partners.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                <div className="flex-1">
                                    <RippleButton
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 sm:px-6 sm:py-3.5 sm:text-base sm:font-medium"
                                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                            e.preventDefault();
                                            // Ensure HTTPS for B2B portal navigation
                                            const currentUrl = window.location.origin;
                                            const b2bUrl = `${currentUrl}/b2b`;
                                            // Use window.location for reliable HTTPS navigation
                                            window.location.href = b2bUrl;
                                        }}
                                    >
                                        Enter B2B Portal
                                    </RippleButton>
                                </div>
                                <RippleButton
                                    className="flex min-w-[48px] items-center justify-center gap-1.5 border border-white/10 bg-white/10 px-3 py-2.5 text-xs font-semibold text-white/80 transition-all duration-300 hover:border-white/20 hover:bg-white/15 hover:text-white sm:min-w-0 sm:gap-2 sm:px-6 sm:py-3.5 sm:text-base sm:font-medium"
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        e.preventDefault();
                                        window.open(
                                            'https://wa.me/6281234567890?text=Hi, I am interested in your B2B services',
                                            '_blank',
                                            'noopener,noreferrer',
                                        );
                                    }}
                                >
                                    <svg className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                    </svg>
                                    <span className="hidden sm:inline">Contact</span>
                                </RippleButton>
                            </div>
                        </div>
                    </motion.div>

                    {/* B2C Card - Optimized for mobile */}
                    <motion.div
                        variants={fadeInUp}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.3, ease }}
                        className="group relative overflow-hidden rounded-xl border border-orange-500/10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90 p-4 shadow-2xl sm:rounded-2xl sm:p-6 md:p-8"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-amber-400/0 to-yellow-500/0 opacity-0 transition-all duration-700 group-hover:from-orange-500/5 group-hover:via-amber-400/3 group-hover:to-yellow-500/5 group-hover:opacity-100" />
                        <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 opacity-60 shadow-[0_0_20px_rgba(255,82,0,0.5)] transition-all duration-700 ease-out group-hover:w-full" />
                        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-orange-400/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="relative z-10">
                            <div className="mb-2.5 sm:mb-4">
                                <div className="inline-block rounded-lg bg-orange-500/15 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-orange-300 ring-1 ring-orange-400/30 sm:px-3 sm:py-1.5 sm:text-xs">
                                    PERSONAL
                                </div>
                            </div>
                            <h2 className="mb-1.5 text-lg font-semibold text-white sm:mb-3 sm:text-2xl">Business to Consumer</h2>
                            <p className="mb-4 text-xs leading-relaxed text-white/60 sm:mb-8 sm:text-base sm:text-white/50">
                                Explore destinations, packages, blogs, and more.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                <Link 
                                    href={nextPath || '/home'} 
                                    className="flex-1"
                                    onClick={() => {
                                        // Set sessionStorage immediately when clicking B2C to prevent redirect loop
                                        try {
                                            sessionStorage.setItem('cahaya-anbiya-session', 'true');
                                        } catch {
                                            // ignore if storage not available
                                        }
                                    }}
                                >
                                    <RippleButton className="w-full bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 sm:px-6 sm:py-3.5 sm:text-base sm:font-medium">
                                        Explore Destinations
                                    </RippleButton>
                                </Link>
                                <RippleButton
                                    className="flex min-w-[48px] items-center justify-center gap-1.5 border border-white/10 bg-white/10 px-3 py-2.5 text-xs font-semibold text-white/80 transition-all duration-300 hover:border-white/20 hover:bg-white/15 hover:text-white sm:min-w-0 sm:gap-2 sm:px-6 sm:py-3.5 sm:text-base sm:font-medium"
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        e.preventDefault();
                                        window.open(
                                            'https://wa.me/6281234567890?text=Hi, I am interested in your travel packages',
                                            '_blank',
                                            'noopener,noreferrer',
                                        );
                                    }}
                                >
                                    <svg className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                    </svg>
                                    <span className="hidden sm:inline">Contact</span>
                                </RippleButton>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Footer - Optimized for mobile */}
            {!showSplash && (
                <motion.div
                    className="absolute bottom-3 left-1/2 w-full -translate-x-1/2 px-4 text-center sm:bottom-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6, ease }}
                >
                    <div className="mb-1.5 flex items-center justify-center gap-2 sm:mb-3 sm:gap-3">
                        <span className="text-[10px] text-white/30 sm:text-sm">Follow us:</span>
                        <motion.a
                            href="https://www.instagram.com/cahayaanbiya_id/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/50 sm:h-9 sm:w-9"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg
                                className="h-3 w-3 transition-transform duration-300 group-hover:scale-110 sm:h-4 sm:w-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </motion.a>
                    </div>
                    <p className="text-[9px] text-white/25 sm:text-xs">© 2025 PT Cahaya Anbiya Wisata</p>
                </motion.div>
            )}
        </div>
    );
}
