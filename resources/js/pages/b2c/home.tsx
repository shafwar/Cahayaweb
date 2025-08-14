import PlaceholderImage from '@/components/media/placeholder-image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Smooth scroll function
const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
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
    { id: 1, title: 'Umrah Premium', subtitle: 'Comfort-first journeys', image: '/images/hero-1.jpg' },
    { id: 2, title: 'Turkey Highlights', subtitle: 'Istanbul to Cappadocia', image: '/images/hero-2.jpg' },
    { id: 3, title: 'Bali Serenity', subtitle: 'Island escapes', image: '/images/hero-3.jpg' },
    { id: 4, title: 'Jordan Discovery', subtitle: 'Wadi Rum & Petra', image: '/images/hero-4.jpg' },
    { id: 5, title: 'Halal Culinary', subtitle: 'Taste the world', image: '/images/hero-5.jpg' },
];

export default function Home() {
    const [index, setIndex] = useState(0);

    // Auto-slide functionality dengan smooth transition
    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % slidesSeed.length), 5000);
        return () => clearInterval(t);
    }, []);

    const slide = slidesSeed[index];

    // Animation variants untuk reusable animations - Mobile optimized
    const fadeInUp = {
        hidden: {
            opacity: 0,
            y: 20, // Reduced movement untuk mobile
            filter: 'blur(8px)', // Reduced blur untuk performance
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.5, // Faster animations untuk mobile
                ease: [0.25, 0.25, 0, 1],
            },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08, // Faster stagger untuk mobile
                delayChildren: 0.1,
            },
        },
    };

    // Mobile-optimized hover effects
    const cardHover = {
        rest: {
            scale: 1,
            y: 0,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', // Lighter shadow untuk mobile
            transition: { duration: 0.2, ease: 'easeOut' },
        },
        hover: {
            scale: 1.02, // Smaller scale untuk mobile
            y: -4, // Reduced movement
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
            transition: { duration: 0.2, ease: 'easeOut' },
        },
    };

    const buttonHover = {
        rest: {
            scale: 1,
            boxShadow: '0 3px 10px rgba(188, 142, 46, 0.2)',
        },
        hover: {
            scale: 1.03, // Smaller scale untuk mobile
            boxShadow: '0 6px 20px rgba(188, 142, 46, 0.3)',
            transition: { duration: 0.2, ease: 'easeOut' },
        },
        tap: {
            scale: 0.97,
            transition: { duration: 0.1 },
        },
    };

    return (
        <PublicLayout>
            <Head title="Home" />

            {/* Mobile-First Hero Section dengan fully responsive design */}
            <motion.section className="relative" initial="hidden" animate="visible" variants={fadeInUp}>
                {/* Mobile-first aspect ratios - Optimized untuk semua screen sizes */}
                <div className="xs:aspect-[4/5] aspect-[3/4] w-full overflow-hidden bg-muted [perspective:1000px] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[16/8] xl:aspect-[16/7] 2xl:aspect-[16/6]">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={slide.id}
                            src={slide.image}
                            alt={slide.title}
                            loading="lazy"
                            className="size-full object-cover object-center"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                            initial={{ opacity: 0, scale: 1.08, rotateX: 2, filter: 'blur(15px)' }}
                            animate={{ opacity: 1, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.96, rotateX: -2, filter: 'blur(8px)' }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                        />
                    </AnimatePresence>

                    {/* Mobile-optimized gradient overlays dengan better readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15 sm:from-black/75 sm:via-black/35 md:from-black/70 md:via-black/30 md:to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 sm:bg-gradient-to-r sm:from-black/35 sm:to-transparent md:from-black/40" />

                    {/* Clean centered hero content - optimized sizing */}
                    <motion.div
                        className="xs:p-6 absolute inset-0 flex items-center justify-center p-4 sm:p-8 md:p-10 lg:p-12"
                        initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                    >
                        {/* Main hero content - balanced sizing */}
                        <div className="text-center text-white">
                            <motion.h1
                                className="xs:text-3xl text-2xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                                style={{
                                    letterSpacing: '-0.02em',
                                    textShadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                            >
                                {slide.title}
                            </motion.h1>
                            <motion.p
                                className="xs:text-lg mt-3 text-base leading-relaxed opacity-95 sm:mt-4 sm:text-xl md:mt-5 md:text-2xl lg:text-3xl xl:text-4xl"
                                style={{
                                    lineHeight: '1.4',
                                    letterSpacing: '0.01em',
                                    textShadow: '0 3px 10px rgba(0, 0, 0, 0.7)',
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                            >
                                {slide.subtitle}
                            </motion.p>
                            <motion.div
                                className="xs:mt-7 mt-6 sm:mt-8 md:mt-10 lg:mt-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.8 }}
                            >
                                <motion.button
                                    variants={buttonHover}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap="tap"
                                    onClick={() => smoothScrollTo('packages')}
                                    className="xs:px-8 xs:py-4 xs:text-base inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-xl backdrop-blur-sm transition-all duration-300 hover:brightness-110 sm:px-10 sm:py-5 sm:text-lg md:px-12 md:py-6 md:text-xl"
                                >
                                    Explore packages
                                    <motion.svg
                                        className="xs:h-5 xs:w-5 ml-2 h-4 w-4 sm:ml-3 sm:h-6 sm:w-6"
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

                    {/* Bottom slide indicators - proportional sizing */}
                    <div className="xs:bottom-8 absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-10 md:bottom-12">
                        <div className="xs:gap-3 flex items-center gap-2 sm:gap-3">
                            {slidesSeed.map((s, i) => (
                                <motion.button
                                    key={s.id}
                                    aria-label={`Slide ${i + 1}`}
                                    className={`rounded-full transition-all duration-300 ${
                                        i === index
                                            ? 'xs:h-2.5 xs:w-7 h-2 w-6 bg-accent shadow-lg sm:h-3 sm:w-8'
                                            : 'xs:h-2.5 xs:w-2.5 h-2 w-2 bg-white/60 hover:bg-white/80 sm:h-3 sm:w-3'
                                    }`}
                                    onClick={() => setIndex(i)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Mobile-First Best Sellers Section dengan enhanced spacing */}
            <motion.section
                id="packages"
                className="xs:px-4 xs:py-10 mx-auto max-w-7xl px-3 py-8 sm:px-5 sm:py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-10"
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
                    {[1, 2, 3, 4].map((i) => (
                        <Dialog key={i}>
                            <DialogTrigger asChild>
                                <motion.article
                                    variants={fadeInUp}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap={{ scale: 0.98 }}
                                    className="group xs:rounded-2xl cursor-pointer overflow-hidden rounded-xl border border-white/20 bg-card/60 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-card/40"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                    }}
                                >
                                    <motion.div variants={cardHover}>
                                        <div className="relative overflow-hidden">
                                            <PlaceholderImage className="xs:aspect-[4/3] aspect-[5/4] w-full transition-transform duration-500 group-hover:scale-105 sm:aspect-video" />
                                            {/* Mobile-optimized overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </div>
                                        <div className="xs:p-4 p-3 sm:p-5 md:p-6">
                                            <h3 className="xs:text-base text-sm leading-tight font-semibold tracking-tight sm:text-lg md:text-lg">
                                                Itinerary {i}
                                            </h3>
                                            <p className="xs:mt-1.5 xs:text-sm mt-1 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                                                Short description here.
                                            </p>
                                        </div>
                                    </motion.div>
                                </motion.article>
                            </DialogTrigger>
                            <DialogContent className="xs:mx-4 xs:w-[calc(100vw-32px)] xs:rounded-2xl mx-3 max-h-[90vh] w-[calc(100vw-24px)] overflow-y-auto rounded-xl border-white/20 bg-card/90 backdrop-blur-xl sm:mx-auto sm:w-full sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="xs:text-lg text-base font-bold sm:text-xl">Itinerary {i}</DialogTitle>
                                    <DialogDescription className="xs:text-sm text-xs leading-relaxed sm:text-base">
                                        Explore a curated journey with beautiful stays and halal-friendly experiences. Perfect for families and small
                                        groups.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="xs:mt-4 xs:gap-3 xs:text-sm mt-3 grid gap-2.5 text-xs sm:gap-4">
                                    <div className="xs:rounded-xl xs:p-3 rounded-lg border border-white/20 bg-card/60 p-2.5 backdrop-blur-sm sm:p-4">
                                        <strong>Location:</strong> Multi-city · <strong>Duration:</strong> 6D5N
                                    </div>
                                    <div className="xs:rounded-xl xs:p-3 rounded-lg border border-white/20 bg-card/60 p-2.5 backdrop-blur-sm sm:p-4">
                                        <strong>Highlights:</strong> Scenic spots, culinary, culture
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </motion.div>
            </motion.section>

            {/* Mobile-First New Destinations Section */}
            <motion.section
                className="xs:px-4 xs:py-10 mx-auto max-w-7xl px-3 py-8 sm:px-5 sm:py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={staggerContainer}
            >
                <motion.div variants={fadeInUp} className="text-center sm:text-left">
                    <h2 className="xs:text-2xl text-xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">New Destinations</h2>
                    <p className="xs:mt-2 xs:text-base mt-1.5 text-sm text-muted-foreground sm:mt-3 sm:text-lg md:text-xl lg:text-2xl">
                        Fresh adventures and undiscovered gems
                    </p>
                </motion.div>

                <motion.div
                    className="xs:mt-7 xs:gap-4 mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5 md:mt-10 md:gap-6 lg:grid-cols-4 lg:gap-8"
                    variants={staggerContainer}
                >
                    {[1, 2, 3, 4].map((i) => (
                        <Dialog key={i}>
                            <DialogTrigger asChild>
                                <motion.article
                                    variants={fadeInUp}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap={{ scale: 0.98 }}
                                    className="group xs:rounded-2xl cursor-pointer overflow-hidden rounded-xl border border-white/20 bg-card/60 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-card/40"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                    }}
                                >
                                    <motion.div variants={cardHover}>
                                        <div className="relative overflow-hidden">
                                            <PlaceholderImage className="xs:aspect-[4/3] aspect-[5/4] w-full transition-transform duration-500 group-hover:scale-105 sm:aspect-video" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </div>
                                        <div className="xs:p-4 p-3 sm:p-5 md:p-6">
                                            <h3 className="xs:text-base text-sm leading-tight font-semibold tracking-tight sm:text-lg md:text-lg">
                                                Blog Article {i}
                                            </h3>
                                            <p className="xs:mt-1.5 xs:text-sm mt-1 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                                                Recently added insights.
                                            </p>
                                        </div>
                                    </motion.div>
                                </motion.article>
                            </DialogTrigger>
                            <DialogContent className="xs:mx-4 xs:w-[calc(100vw-32px)] xs:rounded-2xl mx-3 max-h-[90vh] w-[calc(100vw-24px)] overflow-y-auto rounded-xl border-white/20 bg-card/90 backdrop-blur-xl sm:mx-auto sm:w-full sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="xs:text-lg text-base font-bold sm:text-xl">Blog Article {i}</DialogTitle>
                                    <DialogDescription className="xs:text-sm text-xs leading-relaxed sm:text-base">
                                        Short preview of the article. Click read more to continue on the blog page.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="xs:text-sm text-xs leading-relaxed sm:text-base">
                                    This article covers travel tips, culture, and food highlights from our latest journeys.
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </motion.div>
            </motion.section>

            {/* Mobile-First Highlights Section */}
            <motion.section
                className="xs:px-4 xs:py-10 mx-auto max-w-7xl px-3 py-8 sm:px-5 sm:py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-10"
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
                    {[1, 2, 3, 4].map((i) => (
                        <Dialog key={i}>
                            <DialogTrigger asChild>
                                <motion.article
                                    variants={fadeInUp}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap={{ scale: 0.98 }}
                                    className="group xs:rounded-2xl cursor-pointer overflow-hidden rounded-xl border border-white/20 bg-card/60 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-card/40"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                    }}
                                >
                                    <motion.div variants={cardHover}>
                                        <div className="relative overflow-hidden">
                                            <PlaceholderImage className="xs:aspect-[4/3] aspect-[5/4] w-full transition-transform duration-500 group-hover:scale-105 sm:aspect-video" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </div>
                                        <div className="xs:p-4 p-3 sm:p-5 md:p-6">
                                            <h3 className="xs:text-base text-sm leading-tight font-semibold tracking-tight sm:text-lg md:text-lg">
                                                Highlight {i}
                                            </h3>
                                            <p className="xs:mt-1.5 xs:text-sm mt-1 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                                                Why travelers love this.
                                            </p>
                                        </div>
                                    </motion.div>
                                </motion.article>
                            </DialogTrigger>
                            <DialogContent className="xs:mx-4 xs:w-[calc(100vw-32px)] xs:rounded-2xl mx-3 max-h-[90vh] w-[calc(100vw-24px)] overflow-y-auto rounded-xl border-white/20 bg-card/90 backdrop-blur-xl sm:mx-auto sm:w-full sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="xs:text-lg text-base font-bold sm:text-xl">Highlight {i}</DialogTitle>
                                    <DialogDescription className="xs:text-sm text-xs leading-relaxed sm:text-base">
                                        A quick spotlight on what makes this special.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="xs:text-sm text-xs leading-relaxed sm:text-base">
                                    From stunning landscapes to unique local experiences, this highlight captures the essence of the destination.
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </motion.div>
            </motion.section>

            {/* Mobile-First Enhanced Footer */}
            <footer className="border-t border-white/20 bg-card/60 backdrop-blur-xl">
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
    );
}
