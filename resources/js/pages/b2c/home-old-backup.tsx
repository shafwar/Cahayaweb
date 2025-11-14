import { CardImage } from '@/components/CardImage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HeroImage } from '@/components/HeroImage';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useHeaderHeight } from '@/hooks/use-header-height';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

/**
 * Optimized smooth scroll function - Cidata pattern (no scrollIntoView conflicts)
 * Now uses dynamic header height for accurate scroll positioning
 */
const smoothScrollTo = (elementId: string, headerHeight: number) => {
    const element = document.getElementById(elementId);
    if (element) {
        // Use window.scrollTo instead of scrollIntoView to avoid conflicts
        const elementTop = element.offsetTop - headerHeight; // Dynamic header offset
        window.scrollTo({
            top: elementTop,
            behavior: 'smooth',
        });
    }
};

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    image: string;
}

const slidesSeed: Slide[] = [
    { id: 1, title: 'Umrah Premium', subtitle: 'Comfort-first journeys', image: '/umrah.jpeg' },
    { id: 2, title: 'Turkey Highlights', subtitle: 'Istanbul to Cappadocia', image: '/TURKEY.jpeg' },
    { id: 3, title: 'Bali Serenity', subtitle: 'Island escapes', image: '/bali.jpeg' },
    { id: 4, title: 'Jordan Discovery', subtitle: 'Wadi Rum & Petra', image: '/jordan.jpeg' },
    { id: 5, title: 'Egypt Wonders', subtitle: 'Pyramids & Nile River', image: '/egypt.jpeg' },
];

export default function Home() {
    const [index, setIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

    // 🎯 Dynamic header height detection for perfect hero section sizing
    const headerHeight = useHeaderHeight();

    // 🎯 Calculate perfect hero height without scroll conflicts
    const heroHeight = `calc(100vh - ${headerHeight}px)`;

    // 🎯 ULTIMATE FIX: Force no scroll on hero section at DOM level - macOS OPTIMIZED
    useEffect(() => {
        const forceNoScroll = () => {
            const heroSection = document.querySelector('.b2c-hero-section');
            if (heroSection) {
                // Force overflow hidden at DOM level
                (heroSection as HTMLElement).style.overflow = 'hidden';
                (heroSection as HTMLElement).style.overflowX = 'hidden';
                (heroSection as HTMLElement).style.overflowY = 'hidden';
                (heroSection as HTMLElement).style.scrollbarWidth = 'none';
                (heroSection as HTMLElement).style.msOverflowStyle = 'none';

                // macOS specific fixes
                (heroSection as HTMLElement).style.webkitOverflowScrolling = 'auto';
                (heroSection as HTMLElement).style.overscrollBehavior = 'none';
                (heroSection as HTMLElement).style.overscrollBehaviorX = 'none';
                (heroSection as HTMLElement).style.overscrollBehaviorY = 'none';

                // Additional macOS fixes
                (heroSection as HTMLElement).style.webkitTransform = 'translateZ(0)';
                (heroSection as HTMLElement).style.transform = 'translateZ(0)';
                (heroSection as HTMLElement).style.willChange = 'auto';
                (heroSection as HTMLElement).style.webkitBackfaceVisibility = 'hidden';
                (heroSection as HTMLElement).style.backfaceVisibility = 'hidden';

                // Force on all children
                const allChildren = heroSection.querySelectorAll('*');
                allChildren.forEach((child) => {
                    (child as HTMLElement).style.overflow = 'hidden';
                    (child as HTMLElement).style.overflowX = 'hidden';
                    (child as HTMLElement).style.overflowY = 'hidden';
                    (child as HTMLElement).style.scrollbarWidth = 'none';
                    (child as HTMLElement).style.msOverflowStyle = 'none';

                    // macOS specific fixes for children
                    (child as HTMLElement).style.webkitOverflowScrolling = 'auto';
                    (child as HTMLElement).style.overscrollBehavior = 'none';
                    (child as HTMLElement).style.overscrollBehaviorX = 'none';
                    (child as HTMLElement).style.overscrollBehaviorY = 'none';

                    // Additional macOS fixes for children
                    (child as HTMLElement).style.webkitTransform = 'translateZ(0)';
                    (child as HTMLElement).style.transform = 'translateZ(0)';
                    (child as HTMLElement).style.willChange = 'auto';
                    (child as HTMLElement).style.webkitBackfaceVisibility = 'hidden';
                    (child as HTMLElement).style.backfaceVisibility = 'hidden';
                });
            }
        };

        // Run immediately
        forceNoScroll();

        // Run after animations - more frequent for macOS
        setTimeout(forceNoScroll, 25);
        setTimeout(forceNoScroll, 50);
        setTimeout(forceNoScroll, 100);
        setTimeout(forceNoScroll, 200);
        setTimeout(forceNoScroll, 300);
        setTimeout(forceNoScroll, 500);
        setTimeout(forceNoScroll, 1000);

        // Run on window resize
        window.addEventListener('resize', forceNoScroll);

        // Run on scroll (macOS specific)
        window.addEventListener('scroll', forceNoScroll);

        // Run on touch events (macOS specific)
        window.addEventListener('touchstart', forceNoScroll);
        window.addEventListener('touchmove', forceNoScroll);
        window.addEventListener('touchend', forceNoScroll);

        return () => {
            window.removeEventListener('resize', forceNoScroll);
            window.removeEventListener('scroll', forceNoScroll);
            window.removeEventListener('touchstart', forceNoScroll);
            window.removeEventListener('touchmove', forceNoScroll);
            window.removeEventListener('touchend', forceNoScroll);
        };
    }, []);

    // Optimized auto-slide - longer interval for better scroll performance
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isTransitioning) {
                setIsTransitioning(true);
                setIndex((i) => (i + 1) % slidesSeed.length);
                setTimeout(() => setIsTransitioning(false), 800);
            }
        }, 8000); // Increased from 5000ms to 8000ms for better performance

        return () => clearInterval(interval);
    }, [isTransitioning]);

    const slide = slidesSeed[index];

    // Image loading handler
    const handleImageLoad = (imageId: number) => {
        setImagesLoaded((prev) => ({ ...prev, [imageId]: true }));
    };

    // Optimized animation variants - simplified for better performance
    const heroImageVariants = {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.4,
                ease: 'easeIn',
            },
        },
    };

    const heroContentVariants = {
        initial: {
            opacity: 0,
            y: 15,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.1,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.3,
                ease: 'easeIn',
            },
        },
    };

    const titleVariants = {
        initial: { opacity: 0, y: 10 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.2,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            y: -5,
            transition: {
                duration: 0.3,
                ease: 'easeIn',
            },
        },
    };

    const subtitleVariants = {
        initial: { opacity: 0, y: 8 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.3,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            y: -5,
            transition: {
                duration: 0.3,
                ease: 'easeIn',
            },
        },
    };

    const buttonVariants = {
        initial: { opacity: 0, y: 10 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.4,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            y: -5,
            transition: {
                duration: 0.3,
                ease: 'easeIn',
            },
        },
    };

    // Optimized hover effects untuk mobile
    const buttonHover = {
        rest: {
            scale: 1,
            boxShadow: '0 4px 12px rgba(188, 142, 46, 0.25)',
            transition: { duration: 0.2, ease: 'easeOut' },
        },
        hover: {
            scale: 1.02,
            boxShadow: '0 8px 25px rgba(188, 142, 46, 0.35)',
            transition: { duration: 0.2, ease: 'easeOut' },
        },
        tap: {
            scale: 0.98,
            transition: { duration: 0.1 },
        },
    };

    // Animation variants untuk section lainnya
    const fadeInUp = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
            },
        },
    };

    const cardHover = {
        rest: {
            scale: 1,
            y: 0,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            transition: { duration: 0.2, ease: 'easeOut' },
        },
        hover: {
            scale: 1.02,
            y: -4,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
            transition: { duration: 0.2, ease: 'easeOut' },
        },
    };

    // Smooth slide change handler
    const handleSlideChange = useCallback(
        (newIndex: number) => {
            if (!isTransitioning && newIndex !== index) {
                setIsTransitioning(true);
                setIndex(newIndex);
                setTimeout(() => setIsTransitioning(false), 1000);
            }
        },
        [index, isTransitioning],
    );

    return (
        <ErrorBoundary>
            <PublicLayout>
                <Head title="Home" />

                {/* 🎯 Hero Section - RADICAL SCROLL FIX */}
                <section
                    className="hero-section b2c-hero-section"
                    style={{
                        height: heroHeight,
                        maxHeight: heroHeight,
                        minHeight: heroHeight,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    {/* 🎯 SINGLE CONTAINER - ABSOLUTE POSITIONING */}
                    <div
                        className="absolute inset-0 h-full w-full"
                        style={{
                            height: '100%',
                            width: '100%',
                            overflow: 'hidden',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <HeroImage
                                key={slide.id}
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 h-full w-full"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                }}
                                variants={heroImageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            />
                        </AnimatePresence>

                        {/* 🎯 GRADIENT OVERLAYS */}
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 sm:from-black/80 sm:via-black/40 md:from-black/75 md:via-black/35"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }}
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 sm:bg-gradient-to-r sm:from-black/40 sm:to-transparent md:from-black/45"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }}
                        />

                        {/* 🎯 HERO CONTENT */}
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={`content-${slide.id}`}
                                className="absolute inset-0 flex items-center justify-center"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    padding: '1rem',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    boxSizing: 'border-box',
                                }}
                                variants={heroContentVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <div className="text-center text-white">
                                    <motion.h1
                                        className="text-xl leading-tight font-bold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                                        style={{
                                            letterSpacing: '-0.02em',
                                            textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
                                        }}
                                        variants={titleVariants}
                                    >
                                        {slide.title}
                                    </motion.h1>

                                    <motion.p
                                        className="mt-2 text-sm leading-relaxed opacity-95 sm:mt-3 sm:text-base md:mt-4 md:text-lg lg:text-xl xl:text-2xl"
                                        style={{
                                            lineHeight: '1.4',
                                            letterSpacing: '0.01em',
                                            textShadow: '0 3px 12px rgba(0, 0, 0, 0.8)',
                                        }}
                                        variants={subtitleVariants}
                                    >
                                        {slide.subtitle}
                                    </motion.p>

                                    <motion.div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10" variants={buttonVariants}>
                                        <motion.button
                                            variants={buttonHover}
                                            initial="rest"
                                            whileHover="hover"
                                            whileTap="tap"
                                            onClick={() => smoothScrollTo('packages', headerHeight)}
                                            className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-xl backdrop-blur-sm transition-all duration-300 hover:brightness-110 sm:px-10 sm:py-5 sm:text-lg md:px-12 md:py-6 md:text-xl"
                                        >
                                            Explore Packages
                                            <motion.svg
                                                className="ml-2 h-4 w-4 sm:ml-3 sm:h-6 sm:w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                initial={{ x: 0 }}
                                                whileHover={{ x: 4 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </motion.svg>
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* 🎯 SLIDE INDICATORS */}
                        <div
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-10 md:bottom-12"
                            style={{
                                position: 'absolute',
                                bottom: '1.5rem',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                {slidesSeed.map((s, i) => (
                                    <motion.button
                                        key={s.id}
                                        aria-label={`Slide ${i + 1}`}
                                        className={`rounded-full transition-all duration-300 ${
                                            i === index
                                                ? 'h-2 w-6 bg-secondary shadow-lg shadow-secondary/50 sm:h-3 sm:w-8'
                                                : 'h-2 w-2 border border-white/30 bg-white/70 hover:bg-white/90 sm:h-3 sm:w-3'
                                        }`}
                                        onClick={() => handleSlideChange(i)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mobile-First Best Sellers Section - Integrated with hero section */}
                <motion.section
                    id="packages"
                    className="xs:px-4 xs:py-10 content-section home-page mx-auto max-w-7xl px-3 py-8 sm:px-5 sm:py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-10"
                    style={{ marginTop: 0 }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-30px' }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center sm:text-left">
                        <h2 className="xs:text-2xl text-xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">Best Sellers</h2>
                        <p className="xs:mt-2 xs:text-base mt-1.5 text-sm text-muted-foreground sm:mt-3 sm:text-lg md:text-xl lg:text-2xl">
                            Discover our most loved travel experiences
                        </p>
                    </motion.div>

                    <motion.div
                        className="xs:mt-7 xs:gap-4 mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5 md:mt-10 md:gap-6 lg:grid-cols-4 lg:gap-8"
                        variants={staggerContainer}
                    >
                        {[
                            {
                                id: 1,
                                title: 'Arab Saudi',
                                subtitle: 'Spiritual journey to Holy Land',
                                image: '/arabsaudi.jpg',
                                duration: '9D8N',
                                price: 'Rp 28.5M',
                                location: 'Makkah & Madinah',
                                highlights: '5-star hotels, direct flights, professional guide',
                            },
                            {
                                id: 2,
                                title: 'Turkey Heritage',
                                subtitle: 'Istanbul to Cappadocia',
                                image: '/TURKEY.jpeg',
                                duration: '8D7N',
                                price: 'Rp 15.8M',
                                location: 'Istanbul, Cappadocia',
                                highlights: 'Historical sites, hot air balloon, cultural experience',
                            },
                            {
                                id: 3,
                                title: 'Egypt Wonders',
                                subtitle: 'Pyramids & Nile River',
                                image: '/egypt.jpeg',
                                duration: '8D7N',
                                price: 'Rp 16.5M',
                                location: 'Cairo, Luxor, Aswan',
                                highlights: 'Pyramids of Giza, Nile cruise, ancient temples',
                            },
                            {
                                id: 4,
                                title: 'Dubai Luxury',
                                subtitle: 'Modern wonders',
                                image: '/dubai1.jpeg',
                                duration: '5D4N',
                                price: 'Rp 14.2M',
                                location: 'Dubai, UAE',
                                highlights: 'Burj Khalifa, desert safari, luxury shopping',
                            },
                        ].map((pkg) => (
                            <Dialog key={pkg.id}>
                                <DialogTrigger asChild>
                                    <motion.article
                                        variants={fadeInUp}
                                        initial="rest"
                                        whileHover="hover"
                                        whileTap={{ scale: 0.98 }}
                                        className="group xs:rounded-2xl cursor-pointer overflow-hidden rounded-xl border border-secondary/20 bg-white shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/10"
                                        style={{
                                            background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                        }}
                                    >
                                        <motion.div variants={cardHover}>
                                            <div className="relative overflow-hidden">
                                                {/* Loading skeleton */}
                                                {!imagesLoaded[pkg.id] && (
                                                    <div className="xs:aspect-[4/3] absolute inset-0 aspect-[5/4] w-full animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted sm:aspect-video" />
                                                )}
                                                <CardImage
                                                    src={pkg.image}
                                                    alt={pkg.title}
                                                    className="xs:aspect-[4/3] aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:aspect-video"
                                                    onLoad={() => handleImageLoad(pkg.id)}
                                                    style={{
                                                        opacity: imagesLoaded[pkg.id] ? 1 : 0,
                                                        transition: 'opacity 0.3s ease-in-out',
                                                    }}
                                                />
                                                {/* Mobile-optimized overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                {/* Badge */}
                                                <div className="absolute top-3 right-3">
                                                    <span className="rounded-full bg-secondary px-2 py-1 text-xs font-bold text-black shadow-lg">
                                                        Best Seller
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="xs:p-4 p-3 sm:p-5 md:p-6">
                                                <h3 className="xs:text-base text-sm leading-tight font-semibold tracking-tight sm:text-lg md:text-lg">
                                                    {pkg.title}
                                                </h3>
                                                <p className="xs:mt-1.5 xs:text-sm mt-1 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                                                    {pkg.subtitle}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </motion.article>
                                </DialogTrigger>
                                <DialogContent className="xs:mx-4 xs:w-[calc(100vw-32px)] xs:rounded-2xl mx-3 max-h-[90vh] w-[calc(100vw-24px)] overflow-y-auto rounded-xl border-white/20 bg-card/90 backdrop-blur-xl sm:mx-auto sm:w-full sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle className="xs:text-lg text-base font-bold sm:text-xl">{pkg.title}</DialogTitle>
                                        <DialogDescription className="xs:text-sm text-xs leading-relaxed sm:text-base">
                                            {pkg.subtitle} - Experience the best of {pkg.location} with our carefully curated package.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="xs:mt-4 xs:gap-3 xs:text-sm mt-3 grid gap-2.5 text-xs sm:gap-4">
                                        <div className="xs:rounded-xl xs:p-3 rounded-lg border border-white/20 bg-card/60 p-2.5 backdrop-blur-sm sm:p-4">
                                            <strong>Location:</strong> {pkg.location} · <strong>Duration:</strong> {pkg.duration}
                                        </div>
                                        <div className="xs:rounded-xl xs:p-3 rounded-lg border border-white/20 bg-card/60 p-2.5 backdrop-blur-sm sm:p-4">
                                            <strong>Price:</strong> {pkg.price} per person
                                        </div>
                                        <div className="xs:rounded-xl xs:p-3 rounded-lg border border-white/20 bg-card/60 p-2.5 backdrop-blur-sm sm:p-4">
                                            <strong>Highlights:</strong> {pkg.highlights}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </motion.div>
                </motion.section>

                {/* Mobile-First New Destinations Section */}
                <motion.section
                    className="xs:px-4 xs:py-10 content-section mx-auto max-w-7xl px-3 py-8 sm:px-5 sm:py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-10"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-30px' }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center sm:text-left">
                        <h2 className="xs:text-2xl text-xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                            New Destinations
                        </h2>
                        <p className="xs:mt-2 xs:text-base mt-1.5 text-sm text-muted-foreground sm:mt-3 sm:text-lg md:text-xl lg:text-2xl">
                            Fresh adventures and undiscovered gems
                        </p>
                    </motion.div>

                    <motion.div
                        className="xs:mt-7 xs:gap-4 mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5 md:mt-10 md:gap-6 lg:grid-cols-4 lg:gap-8"
                        variants={staggerContainer}
                    >
                        {[
                            {
                                id: 1,
                                title: 'Oman Adventure',
                                subtitle: 'Muscat + Nizwa + Wahiba Sands',
                                image: '/oman.jpg',
                                duration: '6D5N',
                                price: 'Rp 18.9M',
                                location: 'Muscat, Nizwa, Wahiba Sands',
                                highlights: 'Desert camping, forts, wadis',
                            },
                            {
                                id: 2,
                                title: 'Qatar Luxury',
                                subtitle: 'Doha + The Pearl + Desert',
                                image: '/qatar.jpg',
                                duration: '5D4N',
                                price: 'Rp 16.2M',
                                location: 'Doha, The Pearl, Desert',
                                highlights: 'Museum of Islamic Art, Souq Waqif, desert safari',
                            },
                            {
                                id: 3,
                                title: 'Kuwait Heritage',
                                subtitle: 'Kuwait City + Failaka Island',
                                image: '/kuwait.jpg',
                                duration: '4D3N',
                                price: 'Rp 12.8M',
                                location: 'Kuwait City, Failaka Island',
                                highlights: 'Kuwait Towers, Grand Mosque, island visit',
                            },
                            {
                                id: 4,
                                title: 'Bahrain Pearl',
                                subtitle: "Manama + Qal'at al-Bahrain",
                                image: '/bahrain.jpg',
                                duration: '4D3N',
                                price: 'Rp 11.5M',
                                location: "Manama, Qal'at al-Bahrain",
                                highlights: 'Pearl diving, ancient forts, Formula 1 circuit',
                            },
                        ].map((destination) => (
                            <Dialog key={destination.id}>
                                <DialogTrigger asChild>
                                    <motion.article
                                        variants={fadeInUp}
                                        initial="rest"
                                        whileHover="hover"
                                        whileTap={{ scale: 0.98 }}
                                        className="group xs:rounded-2xl cursor-pointer overflow-hidden rounded-xl border border-secondary/20 bg-white shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/10"
                                        style={{
                                            background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                        }}
                                    >
                                        <motion.div variants={cardHover}>
                                            <div className="relative overflow-hidden">
                                                {/* Loading skeleton */}
                                                {!imagesLoaded[destination.id + 100] && (
                                                    <div className="xs:aspect-[4/3] absolute inset-0 aspect-[5/4] w-full animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted sm:aspect-video" />
                                                )}
                                                <CardImage
                                                    src={destination.image}
                                                    alt={destination.title}
                                                    className="xs:aspect-[4/3] aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:aspect-video"
                                                    onLoad={() => handleImageLoad(destination.id + 100)}
                                                    style={{
                                                        opacity: imagesLoaded[destination.id + 100] ? 1 : 0,
                                                        transition: 'opacity 0.3s ease-in-out',
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                {/* New Badge */}
                                                <div className="absolute top-3 right-3">
                                                    <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-white shadow-lg">
                                                        New
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="xs:p-4 p-3 sm:p-5 md:p-6">
                                                <h3 className="xs:text-base text-sm leading-tight font-semibold tracking-tight sm:text-lg md:text-lg">
                                                    {destination.title}
                                                </h3>
                                                <p className="xs:mt-1.5 xs:text-sm mt-1 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                                                    {destination.subtitle}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </motion.article>
                                </DialogTrigger>
                                <DialogContent className="xs:mx-4 xs:w-[calc(100vw-32px)] xs:rounded-2xl mx-3 max-h-[90vh] w-[calc(100vw-24px)] overflow-y-auto rounded-xl border-white/20 bg-card/90 backdrop-blur-xl sm:mx-auto sm:w-full sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle className="xs:text-lg text-base font-bold sm:text-xl">{destination.title}</DialogTitle>
                                        <DialogDescription className="xs:text-sm text-xs leading-relaxed sm:text-base">
                                            {destination.subtitle} - Discover the hidden gems of {destination.location} with our exclusive new
                                            package.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="xs:mt-4 xs:gap-3 xs:text-sm mt-3 grid gap-2.5 text-xs sm:gap-4">
                                        <div className="xs:rounded-xl xs:p-3 rounded-lg border border-white/20 bg-card/60 p-2.5 backdrop-blur-sm sm:p-4">
                                            <strong>Location:</strong> {destination.location} · <strong>Duration:</strong> {destination.duration}
                                        </div>
                                        <div className="xs:rounded-xl xs:p-3 rounded-lg border border-white/20 bg-card/60 p-2.5 backdrop-blur-sm sm:p-4">
                                            <strong>Price:</strong> {destination.price} per person
                                        </div>
                                        <div className="xs:rounded-xl xs:p-3 rounded-lg border border-white/20 bg-card/60 p-2.5 backdrop-blur-sm sm:p-4">
                                            <strong>Highlights:</strong> {destination.highlights}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </motion.div>
                </motion.section>

                {/* Mobile-First Highlights Section */}
                <motion.section
                    className="xs:px-4 xs:py-10 content-section mx-auto max-w-7xl px-3 py-8 sm:px-5 sm:py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-10"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-30px' }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center sm:text-left">
                        <h2 className="xs:text-2xl text-xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">Highlights</h2>
                        <p className="xs:mt-2 xs:text-base mt-1.5 text-sm text-muted-foreground sm:mt-3 sm:text-lg md:text-xl lg:text-2xl">
                            Moments that make every journey unforgettable
                        </p>
                    </motion.div>

                    <motion.div
                        className="xs:mt-7 xs:gap-4 mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5 md:mt-10 md:gap-6 lg:grid-cols-4 lg:gap-8"
                        variants={staggerContainer}
                    >
                        {[
                            {
                                id: 1,
                                title: 'Kaaba Experience',
                                subtitle: 'Spiritual journey to the heart of Islam',
                                image: '/umrah.jpeg',
                                description:
                                    'Experience the divine atmosphere of Masjid al-Haram, where millions of pilgrims gather to perform their spiritual journey. Feel the sacred energy as you stand before the Kaaba, the holiest site in Islam.',
                                features: ['Masjid al-Haram visit', 'Kaaba tawaf experience', 'Spiritual guidance', 'Halal accommodation'],
                            },
                            {
                                id: 2,
                                title: 'Cappadocia Magic',
                                subtitle: 'Hot air balloon adventure',
                                image: '/turkey2.jpg',
                                description:
                                    'Float above the fairy chimneys of Cappadocia at sunrise, witnessing one of the most breathtaking landscapes on earth. This magical experience combines adventure with natural wonder.',
                                features: ['Hot air balloon ride', 'Fairy chimney views', 'Sunrise experience', 'Professional pilots'],
                            },
                            {
                                id: 3,
                                title: 'Pyramids Wonder',
                                subtitle: 'Ancient Egyptian marvels',
                                image: '/egypt.jpeg',
                                description:
                                    'Stand in awe of the Great Pyramids of Giza, one of the Seven Wonders of the Ancient World. Explore the mysteries of ancient Egypt and discover the secrets of the pharaohs.',
                                features: ['Pyramids of Giza', 'Sphinx visit', 'Ancient temples', 'Egyptian history'],
                            },
                            {
                                id: 4,
                                title: 'Dubai Desert',
                                subtitle: 'Luxury desert safari',
                                image: '/dubai1.jpeg',
                                description:
                                    'Experience Arabian nights in the golden dunes of Dubai. From thrilling dune bashing to serene sunset views, discover the beauty of the desert landscape.',
                                features: ['Desert safari', 'Dune bashing', 'Sunset views', 'Traditional camp'],
                            },
                        ].map((highlight) => (
                            <Dialog key={highlight.id}>
                                <DialogTrigger asChild>
                                    <motion.article
                                        variants={fadeInUp}
                                        initial="rest"
                                        whileHover="hover"
                                        whileTap={{ scale: 0.98 }}
                                        className="group xs:rounded-2xl cursor-pointer overflow-hidden rounded-xl border border-secondary/20 bg-white shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/10"
                                        style={{
                                            background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                        }}
                                    >
                                        <motion.div variants={cardHover}>
                                            <div className="relative overflow-hidden">
                                                {/* Loading skeleton */}
                                                {!imagesLoaded[highlight.id + 200] && (
                                                    <div className="xs:aspect-[4/3] absolute inset-0 aspect-[5/4] w-full animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted sm:aspect-video" />
                                                )}
                                                <CardImage
                                                    src={highlight.image}
                                                    alt={highlight.title}
                                                    className="xs:aspect-[4/3] aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:aspect-video"
                                                    onLoad={() => handleImageLoad(highlight.id + 200)}
                                                    style={{
                                                        opacity: imagesLoaded[highlight.id + 200] ? 1 : 0,
                                                        transition: 'opacity 0.3s ease-in-out',
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                {/* Featured Badge */}
                                                <div className="absolute top-3 right-3">
                                                    <span className="rounded-full bg-secondary px-2 py-1 text-xs font-bold text-black shadow-lg">
                                                        Featured
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="xs:p-4 p-3 sm:p-5 md:p-6">
                                                <h3 className="xs:text-base text-sm leading-tight font-semibold tracking-tight sm:text-lg md:text-lg">
                                                    {highlight.title}
                                                </h3>
                                                <p className="xs:mt-1.5 xs:text-sm mt-1 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                                                    {highlight.subtitle}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </motion.article>
                                </DialogTrigger>
                                <DialogContent className="xs:mx-4 xs:w-[calc(100vw-32px)] xs:rounded-2xl mx-3 max-h-[90vh] w-[calc(100vw-24px)] overflow-y-auto rounded-xl border-white/20 bg-card/90 backdrop-blur-xl sm:mx-auto sm:w-full sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle className="xs:text-lg text-base font-bold sm:text-xl">{highlight.title}</DialogTitle>
                                        <DialogDescription className="xs:text-sm text-xs leading-relaxed sm:text-base">
                                            {highlight.subtitle} - Discover what makes this experience truly special.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="xs:mt-4 xs:gap-3 xs:text-sm mt-3 space-y-4 text-xs sm:gap-4">
                                        <div className="xs:rounded-xl xs:p-3 rounded-lg border border-white/20 bg-card/60 p-2.5 backdrop-blur-sm sm:p-4">
                                            <p className="text-sm leading-relaxed text-gray-300">{highlight.description}</p>
                                        </div>
                                        <div className="xs:rounded-xl xs:p-3 rounded-lg border border-white/20 bg-card/60 p-2.5 backdrop-blur-sm sm:p-4">
                                            <h4 className="mb-2 text-sm font-semibold text-white">What's Included:</h4>
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {highlight.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                                                        <span className="text-xs text-gray-300">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </motion.div>
                </motion.section>

                {/* Mobile-First Enhanced Footer */}
                <footer className="content-section border-t border-white/20 bg-card/60 backdrop-blur-xl">
                    <motion.div
                        className="xs:px-4 xs:py-10 mx-auto max-w-7xl px-3 py-8 sm:px-5 sm:py-12 md:flex md:items-center md:justify-between md:px-6 md:py-12 lg:px-8 xl:px-10"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Contact Info */}
                        <div className="xs:text-sm text-center text-xs leading-relaxed text-muted-foreground sm:text-left md:text-sm">
                            <div className="font-medium">Email: hello@cahaya-anbiya.com</div>
                            <div className="xs:mt-1 mt-0.5 font-medium">WhatsApp: +62 812-3456-7890</div>
                        </div>

                        {/* Social Links */}
                        <div className="xs:gap-5 xs:text-sm mt-4 flex items-center justify-center gap-4 text-xs sm:mt-6 sm:gap-6 md:mt-0 md:text-sm">
                            {[
                                { name: 'Instagram', url: 'https://instagram.com' },
                                { name: 'TikTok', url: 'https://tiktok.com' },
                                { name: 'YouTube', url: 'https://youtube.com' },
                            ].map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium transition-colors duration-200 hover:text-accent"
                                    whileHover={{ scale: 1.05, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} // Touch-friendly
                                >
                                    {social.name}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </footer>
            </PublicLayout>
        </ErrorBoundary>
    );
}
