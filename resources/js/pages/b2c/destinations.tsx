import PlaceholderImage from '@/components/media/placeholder-image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Destinations() {
    // Animation variants for stagger effect
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <PublicLayout>
            <Head title="Destinations" />

            <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
                {/* Header Section with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-12 text-center md:mb-16"
                >
                    <h1 className="mb-4 text-4xl font-bold text-foreground md:text-6xl lg:text-7xl">
                        <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                            Explore the World
                        </span>
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                        Discover our handpicked collection of extraordinary travel destinations across the Middle East and beyond
                    </p>
                    <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span>9 Unique Destinations</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            <span>Curated Experiences</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-secondary"></div>
                            <span>Professional Service</span>
                        </div>
                    </div>
                </motion.div>

                {/* All Destinations Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
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
                            badge: 'Featured',
                            badgeColor: 'bg-purple-500',
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
                            badge: 'Featured',
                            badgeColor: 'bg-purple-500',
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
                            badge: 'Featured',
                            badgeColor: 'bg-purple-500',
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
                            badge: 'Featured',
                            badgeColor: 'bg-purple-500',
                        },
                        {
                            id: 5,
                            title: 'Oman Adventure',
                            subtitle: 'Muscat + Nizwa + Wahiba Sands',
                            image: '/oman.jpg',
                            duration: '6D5N',
                            price: 'Rp 18.9M',
                            location: 'Muscat, Nizwa, Wahiba Sands',
                            highlights: 'Desert camping, forts, wadis',
                            badge: 'Featured',
                            badgeColor: 'bg-purple-500',
                        },
                        {
                            id: 6,
                            title: 'Qatar Luxury',
                            subtitle: 'Doha + The Pearl + Desert',
                            image: '/qatar.jpg',
                            duration: '5D4N',
                            price: 'Rp 16.2M',
                            location: 'Doha, The Pearl, Desert',
                            highlights: 'Museum of Islamic Art, Souq Waqif, desert safari',
                            badge: 'Featured',
                            badgeColor: 'bg-purple-500',
                        },
                        {
                            id: 7,
                            title: 'Kuwait Heritage',
                            subtitle: 'Kuwait City + Failaka Island',
                            image: '/kuwait.jpg',
                            duration: '4D3N',
                            price: 'Rp 12.8M',
                            location: 'Kuwait City, Failaka Island',
                            highlights: 'Kuwait Towers, Grand Mosque, island visit',
                            badge: 'Featured',
                            badgeColor: 'bg-purple-500',
                        },
                        {
                            id: 8,
                            title: 'Bahrain Pearl',
                            subtitle: "Manama + Qal'at al-Bahrain",
                            image: '/bahrain.jpg',
                            duration: '4D3N',
                            price: 'Rp 11.5M',
                            location: "Manama, Qal'at al-Bahrain",
                            highlights: 'Pearl diving, ancient forts, Formula 1 circuit',
                            badge: 'Featured',
                            badgeColor: 'bg-purple-500',
                        },
                        {
                            id: 9,
                            title: 'Jordan Discovery',
                            subtitle: 'Wadi Rum & Petra',
                            image: '/jordan.jpeg',
                            duration: '7D6N',
                            price: 'Rp 17.2M',
                            location: 'Amman, Petra, Wadi Rum',
                            highlights: 'Petra ancient city, desert camping, Dead Sea',
                            badge: 'Featured',
                            badgeColor: 'bg-purple-500',
                        },
                    ].map((destination) => (
                        <Dialog key={destination.id}>
                            <DialogTrigger asChild>
                                <motion.article
                                    variants={cardVariants}
                                    whileHover={{
                                        scale: 1.03,
                                        y: -8,
                                        transition: {
                                            duration: 0.3,
                                            ease: 'easeOut',
                                        },
                                    }}
                                    className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-500 ease-in-out hover:shadow-xl"
                                >
                                    {/* Image/Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={destination.image}
                                            alt={destination.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (nextElement) {
                                                    nextElement.style.display = 'block';
                                                }
                                            }}
                                        />
                                        <PlaceholderImage className="hidden h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

                                        {/* Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-bold text-white shadow-lg ${destination.badgeColor}`}
                                            >
                                                {destination.badge}
                                            </span>
                                        </div>

                                        {/* Hover Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5 md:p-6">
                                        <h3 className="mb-2 text-lg font-medium text-card-foreground transition-colors duration-300 group-hover:text-primary md:text-xl">
                                            {destination.title}
                                        </h3>
                                        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{destination.subtitle}</p>

                                        {/* Additional Info */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <span>{destination.duration}</span>
                                            </div>
                                            <div className="text-xs font-medium text-primary transition-transform duration-300 group-hover:scale-105">
                                                View Details →
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Accent Line */}
                                    <div className="h-1 origin-left scale-x-0 transform bg-gradient-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-x-100" />
                                </motion.article>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl border-white/20 bg-card/90 backdrop-blur-xl sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">{destination.title}</DialogTitle>
                                    <DialogDescription className="leading-relaxed">
                                        {destination.subtitle} - Experience the best of {destination.location} with our carefully curated package.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 grid gap-3">
                                    <div className="rounded-lg border border-white/20 bg-card/60 p-3 backdrop-blur-sm">
                                        <strong>Location:</strong> {destination.location} · <strong>Duration:</strong> {destination.duration}
                                    </div>
                                    <div className="rounded-lg border border-white/20 bg-card/60 p-3 backdrop-blur-sm">
                                        <strong>Price:</strong> {destination.price} per person
                                    </div>
                                    <div className="rounded-lg border border-white/20 bg-card/60 p-3 backdrop-blur-sm">
                                        <strong>Highlights:</strong> {destination.highlights}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </motion.div>

                {/* Call to Action Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-12 text-center sm:mt-16 md:mt-20"
                >
                    <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 sm:mb-6 sm:px-6 sm:py-3">
                        <span className="text-xs font-medium text-primary sm:text-sm">✨ Special Packages Available</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground sm:mb-4 sm:text-2xl md:text-3xl">
                        Can't Find the Destination You're Looking For?
                    </h3>
                    <p className="mx-auto mb-6 max-w-2xl text-sm text-muted-foreground sm:mb-8 sm:text-base">
                        Contact our team for travel destination consultation according to your preferences
                    </p>
                    <motion.a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-lg sm:px-8 sm:py-4 sm:text-base"
                    >
                        Free Consultation
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.a>
                </motion.div>
            </section>

            {/* Footer from home.tsx */}
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
