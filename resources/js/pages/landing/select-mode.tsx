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
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            // First time ever - show full splash animation
            const timer = setTimeout(() => {
                setShowSplash(false);
                localStorage.setItem('cahaya-anbiya-visited', 'true');
                sessionStorage.setItem('cahaya-anbiya-session', 'true');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    // Splash screen animation variants
    const splashVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            scale: 1.1,
            transition: {
                duration: 0.6,
                ease: 'easeIn',
            },
        },
    };

    const logoVariants = {
        hidden: {
            opacity: 0,
            scale: 0.5,
            rotate: -180,
        },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2,
            },
        },
    };

    const textVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            filter: 'blur(10px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.5,
                ease: 'easeOut',
                delay: 0.6,
            },
        },
    };

    const subtitleVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: 'easeOut',
                delay: 0.8,
            },
        },
    };

    const glowVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: [0, 0.5, 0.3, 0.5, 0.3],
            scale: [0.8, 1.2, 1, 1.1, 1],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.8,
            },
        },
    };

    // Container animation variants untuk staggered children
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                duration: 0.4,
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    // Card animation variants dengan enhanced hover effects
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
            filter: 'blur(10px)',
        },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 0.7,
                ease: [0.25, 0.25, 0, 1], // Custom cubic bezier untuk smooth easing
            },
        },
    };

    // Button hover animation variants
    const buttonVariants = {
        rest: { scale: 1, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' },
        hover: {
            scale: 1.02,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
            transition: { duration: 0.2, ease: 'easeOut' },
        },
        tap: { scale: 0.98, transition: { duration: 0.1 } },
    };

    return (
        <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background p-6 text-foreground">
            <Head title="Welcome" />

            {/* Welcome Splash Screen */}
            <AnimatePresence>
                {showSplash && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
                        variants={splashVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Background glow effects */}
                        <motion.div
                            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(188,142,46,0.15),transparent_70%)]"
                            variants={glowVariants}
                            initial="hidden"
                            animate="visible"
                        />

                        <div className="relative z-10 flex flex-col items-center justify-center text-center">
                            {/* Logo Animation */}
                            <motion.div variants={logoVariants} initial="hidden" animate="visible" className="mb-8">
                                <img src="/cahayanbiyalogo.png" alt="Cahaya Anbiya Logo" className="h-32 w-auto drop-shadow-2xl md:h-40 lg:h-48" />
                            </motion.div>

                            {/* Welcome Text */}
                            <motion.h1
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                className="mb-4 bg-gradient-to-br from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl"
                                style={{
                                    lineHeight: '1.1',
                                    letterSpacing: '-0.02em',
                                    fontFamily: 'Playfair Display, serif',
                                }}
                            >
                                Welcome to
                            </motion.h1>

                            <motion.h2
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                className="mb-6 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl"
                                style={{
                                    lineHeight: '1.1',
                                    letterSpacing: '-0.02em',
                                    fontFamily: 'Playfair Display, serif',
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
                                }}
                            >
                                Wisata Indonesia
                            </motion.h3>

                            {/* Loading dots */}
                            <motion.div variants={subtitleVariants} initial="hidden" animate="visible" className="mt-8 flex space-x-2">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="h-3 w-3 rounded-full bg-amber-400"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.2,
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
                className="z-10 grid w-full max-w-6xl gap-12"
                variants={containerVariants}
                initial="hidden"
                animate={!showSplash ? 'show' : 'hidden'}
            >
                {/* Header Section dengan improved typography */}
                <motion.div className="text-center" variants={cardVariants}>
                    <motion.h1
                        className="bg-gradient-to-br from-accent via-primary to-secondary bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl"
                        style={{
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em', // Tighter letter spacing untuk font besar
                        }}
                    >
                        Cahaya Anbiya Wisata
                    </motion.h1>
                    <motion.p
                        className="mt-6 text-lg text-muted-foreground md:text-xl"
                        style={{
                            lineHeight: '1.6',
                            letterSpacing: '0.01em',
                        }}
                        variants={cardVariants}
                    >
                        Choose your experience
                    </motion.p>
                </motion.div>

                {/* Cards Grid dengan enhanced glassmorphism */}
                <motion.div className="grid grid-cols-1 gap-8 md:grid-cols-2" variants={containerVariants}>
                    {/* B2B Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
                            transition: { duration: 0.3, ease: 'easeOut' },
                        }}
                        className="group relative overflow-hidden rounded-3xl border border-white/20 bg-card/60 p-10 shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl supports-[backdrop-filter]:bg-card/40"
                        style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}
                    >
                        {/* Subtle inner glow pada hover */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="mb-6">
                                <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">Business to Business</h2>
                                <p className="text-muted-foreground">Tailored solutions for travel agencies and corporate partners.</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="tap" className="flex-1">
                                    <Link href={route('b2b.index')}>
                                        <RippleButton className="w-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-primary/25">
                                            Enter B2B
                                        </RippleButton>
                                    </Link>
                                </motion.div>
                                <motion.a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-medium text-accent transition-all duration-200 hover:scale-105 hover:border-accent/50 hover:bg-accent/20"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="text-sm">💬</span>
                                    <span className="hidden sm:inline">WhatsApp Corporate</span>
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>

                    {/* B2C Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
                            transition: { duration: 0.3, ease: 'easeOut' },
                        }}
                        className="group relative overflow-hidden rounded-3xl border border-white/20 bg-card/60 p-10 shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl supports-[backdrop-filter]:bg-card/40"
                        style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}
                    >
                        {/* Subtle inner glow pada hover */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="mb-6">
                                <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">Business to Consumer</h2>
                                <p className="text-muted-foreground">Explore destinations, packages, blogs, and more.</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="tap" className="flex-1">
                                    <Link href={route('b2c.home')}>
                                        <RippleButton className="w-full bg-secondary px-6 py-3 text-base font-semibold text-secondary-foreground shadow-lg transition-all duration-300 hover:shadow-secondary/25">
                                            Enter Website
                                        </RippleButton>
                                    </Link>
                                </motion.div>
                                <motion.a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-medium text-accent transition-all duration-200 hover:scale-105 hover:border-accent/50 hover:bg-accent/20"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="text-sm">💬</span>
                                    <span className="hidden sm:inline">WhatsApp Personal</span>
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
            >
                © 2025 PT Cahaya Anbiya Wisata
            </motion.div>
        </div>
    );
}
