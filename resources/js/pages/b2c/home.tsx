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
    { id: 1, title: 'Umrah Premium', subtitle: 'Comfort-first journeys', image: '/umrah.jpeg' },
    { id: 2, title: 'Turkey Highlights', subtitle: 'Istanbul to Cappadocia', image: '/TURKEY.jpeg' },
    { id: 3, title: 'Bali Serenity', subtitle: 'Island escapes', image: '/bali.jpeg' },
    { id: 4, title: 'Jordan Discovery', subtitle: 'Wadi Rum & Petra', image: '/jordan.jpeg' },
    { id: 5, title: 'Egypt Wonders', subtitle: 'Pyramids & Nile River', image: '/egypt.jpeg' },
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
                            className="size-full object-cover object-center transition-all duration-700"
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
                                    Explore Packages
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
                                    className="group xs:rounded-2xl cursor-pointer overflow-hidden rounded-xl border border-white/20 bg-card/60 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-card/40"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                    }}
                                >
                                    <motion.div variants={cardHover}>
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={pkg.image}
                                                alt={pkg.title}
                                                className="xs:aspect-[4/3] aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:aspect-video"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                                    if (nextElement) {
                                                        nextElement.style.display = 'block';
                                                    }
                                                }}
                                            />
                                            <PlaceholderImage className="xs:aspect-[4/3] hidden aspect-[5/4] w-full transition-transform duration-500 group-hover:scale-105 sm:aspect-video" />
                                            {/* Mobile-optimized overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            {/* Badge */}
                                            <div className="absolute top-3 right-3">
                                                <span className="rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
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
                                    className="group xs:rounded-2xl cursor-pointer overflow-hidden rounded-xl border border-white/20 bg-card/60 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-card/40"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                    }}
                                >
                                    <motion.div variants={cardHover}>
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={destination.image}
                                                alt={destination.title}
                                                className="xs:aspect-[4/3] aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:aspect-video"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                                    if (nextElement) {
                                                        nextElement.style.display = 'block';
                                                    }
                                                }}
                                            />
                                            <PlaceholderImage className="xs:aspect-[4/3] hidden aspect-[5/4] w-full transition-transform duration-500 group-hover:scale-105 sm:aspect-video" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            {/* New Badge */}
                                            <div className="absolute top-3 right-3">
                                                <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white shadow-lg">New</span>
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
                                        {destination.subtitle} - Discover the hidden gems of {destination.location} with our exclusive new package.
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
