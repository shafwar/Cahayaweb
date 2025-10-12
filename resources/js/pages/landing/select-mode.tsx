import { RippleButton } from '@/components/ui/ripple-button';
import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SelectMode() {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // Check if user has visited before and current session
        const visited = localStorage.getItem('cahaya-anbiya-visited');
        const sessionVisited = sessionStorage.getItem('cahaya-anbiya-session');

        if (sessionVisited) {
            // Already visited in this session - show main content immediately
            setShowSplash(false);
        } else if (visited) {
            // Return visit but new session - show smooth splash animation
            const timer = setTimeout(() => {
                setShowSplash(false);
                sessionStorage.setItem('cahaya-anbiya-session', 'true');
            }, 2800); // Slightly longer for better experience
            return () => clearTimeout(timer);
        } else {
            // First time ever - show full splash animation
            const timer = setTimeout(() => {
                setShowSplash(false);
                localStorage.setItem('cahaya-anbiya-visited', 'true');
                sessionStorage.setItem('cahaya-anbiya-session', 'true');
            }, 3200); // Optimal duration for first-time users
            return () => clearTimeout(timer);
        }
    }, []);

    // Ultra-smooth splash screen animation variants
    const splashVariants = {
        hidden: {
            opacity: 0,
            scale: 0.98,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom easing untuk smoothness
            },
        },
        exit: {
            opacity: 0,
            scale: 1.05,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    // Enhanced logo animation dengan smoother transitions
    const logoVariants = {
        hidden: {
            opacity: 0,
            scale: 0.3,
            rotate: -180,
            filter: 'blur(8px)',
        },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.3,
            },
        },
    };

    // Smooth text animations dengan staggered timing
    const textVariants = {
        hidden: {
            opacity: 0,
            y: 40,
            filter: 'blur(6px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.9,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.8,
            },
        },
    };

    const subtitleVariants = {
        hidden: {
            opacity: 0,
            y: 25,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 1.1,
            },
        },
    };

    // Enhanced glow effects dengan smoother pulsing
    const glowVariants = {
        hidden: {
            opacity: 0,
            scale: 0.7,
        },
        visible: {
            opacity: [0, 0.6, 0.4, 0.6, 0.4],
            scale: [0.7, 1.3, 1, 1.2, 1],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.2,
            },
        },
    };

    // Smooth loading dots animation
    const dotVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 1.4,
            },
        },
    };

    // Container animation variants untuk staggered children
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.08,
                delayChildren: 0.2,
            },
        },
    };

    // Card animation variants dengan enhanced hover effects
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
            filter: 'blur(8px)',
        },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    return (
        <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background p-6 text-foreground">
            <Head title="Welcome" />

            {/* Ultra-Smooth Welcome Splash Screen */}
            <AnimatePresence mode="wait">
                {showSplash && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
                        variants={splashVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Enhanced background glow effects */}
                        <motion.div
                            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(188,142,46,0.18),transparent_70%)]"
                            variants={glowVariants}
                            initial="hidden"
                            animate="visible"
                        />

                        <div className="relative z-10 flex flex-col items-center justify-center text-center">
                            {/* Enhanced Logo Animation */}
                            <motion.div
                                variants={logoVariants}
                                initial="hidden"
                                animate="visible"
                                className="mb-10"
                                style={{
                                    willChange: 'transform, opacity, filter',
                                }}
                            >
                                <img
                                    src="/cahayanbiyalogo.png"
                                    alt="Cahaya Anbiya Logo"
                                    className="h-40 w-auto drop-shadow-2xl sm:h-48 md:h-56 lg:h-64"
                                    style={{
                                        willChange: 'transform',
                                    }}
                                />
                            </motion.div>

                            {/* Smooth Welcome Text */}
                            <motion.h1
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                className="mb-6 bg-gradient-to-br from-blue-400 via-orange-400 to-yellow-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl"
                                style={{
                                    lineHeight: '1.1',
                                    letterSpacing: '-0.02em',
                                    fontFamily: 'Playfair Display, serif',
                                    willChange: 'transform, opacity',
                                    textShadow: '0 0 30px rgba(254, 201, 1, 0.3)',
                                }}
                            >
                                Welcome to
                            </motion.h1>

                            <motion.h2
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                className="mb-8 bg-gradient-to-br from-orange-400 via-yellow-400 to-blue-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl"
                                style={{
                                    lineHeight: '1.1',
                                    letterSpacing: '-0.02em',
                                    fontFamily: 'Playfair Display, serif',
                                    willChange: 'transform, opacity',
                                }}
                            >
                                Cahaya Anbiya
                            </motion.h2>

                            <motion.h3
                                variants={subtitleVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-xl font-medium text-gray-300 md:text-2xl lg:text-3xl"
                                style={{
                                    letterSpacing: '0.05em',
                                    fontFamily: 'Poppins, sans-serif',
                                    willChange: 'transform, opacity',
                                }}
                            >
                                Wisata Indonesia
                            </motion.h3>

                            {/* Enhanced Loading dots dengan smoother animation */}
                            <motion.div variants={dotVariants} initial="hidden" animate="visible" className="mt-10 flex space-x-3">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="h-3 w-3 rounded-full bg-orange-400"
                                        animate={{
                                            scale: [1, 1.6, 1],
                                            opacity: [0.4, 1, 0.4],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                        }}
                                        style={{
                                            willChange: 'transform, opacity',
                                        }}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced background glow effects dengan lebih banyak lapisan */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(188,142,46,0.18),transparent_60%)] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 left-10 h-[400px] w-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(130,26,101,0.15),transparent_60%)] blur-2xl" />
            {/* Tambahan subtle glow untuk depth */}
            <div className="pointer-events-none absolute top-1/2 right-10 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(188,142,46,0.08),transparent_70%)] blur-xl" />

            <motion.div
                className="z-10 grid w-full max-w-6xl gap-4 px-3 sm:gap-6 sm:px-4 md:gap-8 lg:gap-12"
                variants={containerVariants}
                initial="hidden"
                animate={!showSplash ? 'show' : 'hidden'}
            >
                {/* Header Section dengan improved typography */}
                <motion.div className="text-center" variants={cardVariants}>
                    <motion.h1
                        className="bg-gradient-to-br from-accent via-primary to-secondary bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl"
                        style={{
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Cahaya Anbiya Wisata
                    </motion.h1>
                    <motion.p
                        className="mt-2 text-xs text-muted-foreground sm:mt-3 sm:text-sm md:mt-4 md:text-base lg:text-lg"
                        style={{
                            lineHeight: '1.6',
                            letterSpacing: '0.01em',
                        }}
                        variants={cardVariants}
                    >
                        Choose your experience
                    </motion.p>
                </motion.div>

                {/* Cards Grid dengan enhanced mobile-first design */}
                <motion.div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-2" variants={containerVariants}>
                    {/* B2B Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{
                            y: -2,
                            scale: 1.005,
                            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)',
                            transition: { duration: 0.3, ease: 'easeOut' },
                        }}
                        className="group relative overflow-hidden rounded-lg border p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:rounded-xl sm:p-4 md:rounded-2xl md:p-5 lg:p-6"
                        style={{
                            background: 'var(--luxury-gradient)',
                            borderColor: 'var(--champagne-gold)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}
                    >
                        {/* Subtle inner glow pada hover */}
                        <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:rounded-xl md:rounded-2xl" style={{background: 'var(--pearl-gradient)'}} />

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="mb-2.5 sm:mb-3 md:mb-4">
                                <h2 className="mb-1 text-sm font-bold text-white sm:mb-1.5 sm:text-base md:mb-2 md:text-lg lg:text-xl">
                                    Business to Business
                                </h2>
                                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
                                    Tailored solutions for travel agencies and corporate partners.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:gap-2.5 md:flex-row md:items-center md:gap-3">
                                <Link href="/b2b" className="w-full md:w-auto">
                                    <RippleButton className="w-full bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-primary/25 sm:px-4 sm:py-3 sm:text-sm md:px-5 md:text-base">
                                        Enter B2B
                                    </RippleButton>
                                </Link>
                                <RippleButton
                                    className="flex w-full items-center justify-center border border-muted-foreground/20 bg-transparent px-3 py-2.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted-foreground/10 md:w-auto md:px-4 md:py-3 md:text-sm"
                                    onClick={() => window.open('https://wa.me/6281234567890?text=Hi, I am interested in your B2B services', '_blank')}
                                >
                                    <svg className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 sm:mr-2 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                    </svg>
                                    <span className="text-xs whitespace-nowrap sm:text-sm">WhatsApp Corporate</span>
                                </RippleButton>
                            </div>
                        </div>
                    </motion.div>

                    {/* B2C Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{
                            y: -2,
                            scale: 1.005,
                            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)',
                            transition: { duration: 0.3, ease: 'easeOut' },
                        }}
                        className="group relative overflow-hidden rounded-lg border p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:rounded-xl sm:p-4 md:rounded-2xl md:p-5 lg:p-6"
                        style={{
                            background: 'var(--luxury-gradient)',
                            borderColor: 'var(--champagne-gold)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}
                    >
                        {/* Subtle inner glow pada hover */}
                        <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:rounded-xl md:rounded-2xl" style={{background: 'var(--pearl-gradient)'}} />

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="mb-2.5 sm:mb-3 md:mb-4">
                                <h2 className="mb-1 text-sm font-bold text-white sm:mb-1.5 sm:text-base md:mb-2 md:text-lg lg:text-xl">
                                    Business to Consumer
                                </h2>
                                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
                                    Explore destinations, packages, blogs, and more.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:gap-2.5 md:flex-row md:items-center md:gap-3">
                                <Link href="/home" className="w-full md:w-auto">
                                    <RippleButton className="w-full bg-secondary px-3 py-2.5 text-xs font-semibold text-secondary-foreground shadow-lg transition-all duration-300 hover:shadow-secondary/25 sm:px-4 sm:py-3 sm:text-sm md:px-5 md:text-base">
                                        Enter Website
                                    </RippleButton>
                                </Link>
                                <RippleButton
                                    className="flex w-full items-center justify-center border border-muted-foreground/20 bg-transparent px-3 py-2.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted-foreground/10 md:w-auto md:px-4 md:py-3 md:text-sm"
                                    onClick={() =>
                                        window.open('https://wa.me/6281234567890?text=Hi, I am interested in your travel packages', '_blank')
                                    }
                                >
                                    <svg className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 sm:mr-2 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                    </svg>
                                    <span className="text-xs whitespace-nowrap sm:text-sm">WhatsApp Personal</span>
                                </RippleButton>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Enhanced Footer with Social Links - Fixed for Mobile */}
            <motion.div
                className="absolute bottom-2 left-1/2 w-full max-w-[280px] -translate-x-1/2 px-3 text-center sm:bottom-4 sm:max-w-xs sm:px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
            >
                {/* Social Media Links */}
                <div className="mb-2 flex justify-center sm:mb-3">
                    <motion.div
                        className="flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 backdrop-blur-md sm:gap-2 sm:px-3 sm:py-2"
                        style={{background: 'var(--white-gold-gradient)', borderColor: 'var(--champagne-gold)'}}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="text-xs font-medium text-white/80 sm:text-sm">Follow us:</span>
                        <motion.a
                            href="https://www.instagram.com/cahayaanbiya_id/"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-orange-500 to-yellow-500 p-1 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl sm:h-7 sm:w-7 sm:p-1.5"
                            whileHover={{
                                scale: 1.1,
                                boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)',
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg
                                className="h-3 w-3 transition-transform duration-300 group-hover:rotate-12 sm:h-3.5 sm:w-3.5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </motion.a>
                    </motion.div>
                </div>

                {/* Copyright */}
                <div className="text-xs font-medium text-muted-foreground/80 sm:text-sm">© 2025 PT Cahaya Anbiya Wisata</div>
            </motion.div>
        </div>
    );
}
