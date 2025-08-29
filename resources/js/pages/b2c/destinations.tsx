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
            <Head title="Destinations - Cahaya Anbiya Wisata" />

            <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
                {/* Enhanced Header Section with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-12 text-center md:mb-16"
                >
                    <h1 className="mb-4 text-4xl font-bold text-foreground md:text-6xl lg:text-7xl">
                        <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                            Discover Your Dream Destinations
                        </span>
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                        Embark on extraordinary journeys across the Middle East and beyond. From spiritual pilgrimages to luxury adventures,
                        we curate unforgettable experiences that connect you with the world's most captivating destinations.
                    </p>
                    <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span>9 Premium Destinations</span>
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

                {/* Enhanced Destinations Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                    {[
                        {
                            id: 1,
                            title: 'Arab Saudi',
                            subtitle: 'Spiritual Journey to the Holy Land',
                            image: '/arabsaudi.jpg',
                            duration: '9D8N',
                            price: 'Rp 28.5M',
                            location: 'Makkah & Madinah',
                            highlights: '5-star hotels, direct flights, professional guide, spiritual guidance',
                            description: 'Embark on a profound spiritual journey to the holiest sites in Islam. Experience the sacred atmosphere of Makkah and Madinah with our premium Umrah packages. Visit the Grand Mosque, perform Tawaf around the Kaaba, and pray at the Prophet\'s Mosque. Our packages include luxury accommodations, direct flights, and expert spiritual guidance.',
                            features: [
                                'Luxury 5-star hotel accommodations',
                                'Direct flights from Indonesia',
                                'Professional spiritual guide',
                                'VIP access to holy sites',
                                'Comprehensive travel insurance',
                                'Daily spiritual programs'
                            ],
                            badge: 'Premium',
                            badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
                            category: 'Spiritual',
                        },
                        {
                            id: 2,
                            title: 'Turkey Heritage',
                            subtitle: 'Istanbul to Cappadocia Adventure',
                            image: '/TURKEY.jpeg',
                            duration: '8D7N',
                            price: 'Rp 15.8M',
                            location: 'Istanbul, Cappadocia, Pamukkale',
                            highlights: 'Historical sites, hot air balloon, cultural experience, thermal springs',
                            description: 'Discover the perfect blend of East and West in Turkey. Explore the magnificent Hagia Sophia and Blue Mosque in Istanbul, soar above the fairy chimneys of Cappadocia in a hot air balloon, and relax in the thermal springs of Pamukkale. Experience rich history, vibrant culture, and breathtaking landscapes.',
                            features: [
                                'Hot air balloon ride in Cappadocia',
                                'Guided tours of historical sites',
                                'Luxury hotel accommodations',
                                'Traditional Turkish bath experience',
                                'Bosphorus cruise in Istanbul',
                                'Local cuisine tasting tours'
                            ],
                            badge: 'Adventure',
                            badgeColor: 'bg-gradient-to-r from-orange-500 to-red-500',
                            category: 'Cultural',
                        },
                        {
                            id: 3,
                            title: 'Egypt Wonders',
                            subtitle: 'Pyramids & Nile River Expedition',
                            image: '/egypt.jpeg',
                            duration: '8D7N',
                            price: 'Rp 16.5M',
                            location: 'Cairo, Luxor, Aswan, Abu Simbel',
                            highlights: 'Pyramids of Giza, Nile cruise, ancient temples, Valley of the Kings',
                            description: 'Journey through the cradle of civilization and explore the mysteries of ancient Egypt. Marvel at the Great Pyramids of Giza, cruise the majestic Nile River, discover the Valley of the Kings, and visit the magnificent temples of Luxor and Abu Simbel. Experience the magic of pharaonic history.',
                            features: [
                                'Nile River luxury cruise',
                                'Pyramids of Giza guided tour',
                                'Valley of the Kings exploration',
                                'Abu Simbel temple visit',
                                'Egyptian Museum tour',
                                'Traditional felucca sailing'
                            ],
                            badge: 'Heritage',
                            badgeColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
                            category: 'Historical',
                        },
                        {
                            id: 4,
                            title: 'Dubai Luxury',
                            subtitle: 'Modern Wonders & Desert Adventures',
                            image: '/dubai1.jpeg',
                            duration: '5D4N',
                            price: 'Rp 14.2M',
                            location: 'Dubai, Abu Dhabi, Desert Safari',
                            highlights: 'Burj Khalifa, desert safari, luxury shopping, Ferrari World',
                            description: 'Experience the epitome of luxury and innovation in Dubai. Ascend the iconic Burj Khalifa, shop in world-class malls, enjoy thrilling desert safaris, and visit the stunning Sheikh Zayed Mosque in Abu Dhabi. Discover the perfect blend of modern luxury and traditional Arabian hospitality.',
                            features: [
                                'Burj Khalifa observation deck access',
                                'Desert safari with dinner',
                                'Luxury shopping experience',
                                'Sheikh Zayed Mosque tour',
                                'Ferrari World theme park',
                                'Dhow cruise dinner'
                            ],
                            badge: 'Luxury',
                            badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
                            category: 'Modern',
                        },
                        {
                            id: 5,
                            title: 'Oman Adventure',
                            subtitle: 'Muscat + Nizwa + Wahiba Sands',
                            image: '/oman.jpg',
                            duration: '6D5N',
                            price: 'Rp 18.9M',
                            location: 'Muscat, Nizwa, Wahiba Sands, Salalah',
                            highlights: 'Desert camping, ancient forts, wadis, traditional souks',
                            description: 'Explore the hidden gem of the Arabian Peninsula. Discover the stunning fjords of Musandam, explore ancient forts in Nizwa, camp under the stars in Wahiba Sands, and experience the monsoon season in Salalah. Oman offers authentic Arabian experiences away from the crowds.',
                            features: [
                                'Desert camping in Wahiba Sands',
                                'Ancient fort exploration',
                                'Wadi hiking adventures',
                                'Traditional souk visits',
                                'Dolphin watching cruise',
                                'Mountain village tours'
                            ],
                            badge: 'Explorer',
                            badgeColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
                            category: 'Adventure',
                        },
                        {
                            id: 6,
                            title: 'Qatar Luxury',
                            subtitle: 'Doha + The Pearl + Desert Safari',
                            image: '/qatar.jpg',
                            duration: '5D4N',
                            price: 'Rp 16.2M',
                            location: 'Doha, The Pearl, Inland Sea, Al Wakrah',
                            highlights: 'Museum of Islamic Art, Souq Waqif, desert safari, luxury resorts',
                            description: 'Experience the perfect blend of tradition and modernity in Qatar. Visit the stunning Museum of Islamic Art, explore the vibrant Souq Waqif, enjoy luxury at The Pearl, and experience thrilling desert adventures. Discover why Qatar is becoming a premier travel destination.',
                            features: [
                                'Museum of Islamic Art tour',
                                'Souq Waqif cultural experience',
                                'Desert safari adventure',
                                'The Pearl luxury experience',
                                'Katara Cultural Village',
                                'Luxury resort accommodations'
                            ],
                            badge: 'Premium',
                            badgeColor: 'bg-gradient-to-r from-purple-500 to-indigo-500',
                            category: 'Luxury',
                        },
                        {
                            id: 7,
                            title: 'Kuwait Heritage',
                            subtitle: 'Kuwait City + Failaka Island',
                            image: '/kuwait.jpg',
                            duration: '4D3N',
                            price: 'Rp 12.8M',
                            location: 'Kuwait City, Failaka Island, Al Jahra',
                            highlights: 'Kuwait Towers, Grand Mosque, island visit, cultural heritage',
                            description: 'Discover the rich heritage and modern charm of Kuwait. Visit the iconic Kuwait Towers, explore the magnificent Grand Mosque, take a boat trip to historic Failaka Island, and experience the vibrant culture of this unique Gulf nation. Perfect for a short but enriching getaway.',
                            features: [
                                'Kuwait Towers visit',
                                'Grand Mosque tour',
                                'Failaka Island exploration',
                                'Traditional dhow boat ride',
                                'Cultural heritage tours',
                                'Modern city exploration'
                            ],
                            badge: 'Heritage',
                            badgeColor: 'bg-gradient-to-r from-red-500 to-pink-500',
                            category: 'Cultural',
                        },
                        {
                            id: 8,
                            title: 'Bahrain Pearl',
                            subtitle: "Manama + Qal'at al-Bahrain",
                            image: '/bahrain.jpg',
                            duration: '4D3N',
                            price: 'Rp 11.5M',
                            location: "Manama, Qal'at al-Bahrain, Al Muharraq",
                            highlights: 'Pearl diving, ancient forts, Formula 1 circuit, traditional culture',
                            description: 'Experience the pearl of the Gulf with its rich history and modern attractions. Explore ancient forts, learn about traditional pearl diving, visit the Formula 1 circuit, and discover the vibrant culture of Bahrain. A perfect blend of history, culture, and modern entertainment.',
                            features: [
                                'Ancient fort exploration',
                                'Pearl diving experience',
                                'Formula 1 circuit tour',
                                'Traditional souk visits',
                                'Cultural heritage tours',
                                'Modern entertainment'
                            ],
                            badge: 'Culture',
                            badgeColor: 'bg-gradient-to-r from-teal-500 to-blue-500',
                            category: 'Heritage',
                        },
                        {
                            id: 9,
                            title: 'Jordan Discovery',
                            subtitle: 'Wadi Rum & Petra Adventure',
                            image: '/jordan.jpeg',
                            duration: '7D6N',
                            price: 'Rp 17.2M',
                            location: 'Amman, Petra, Wadi Rum, Dead Sea',
                            highlights: 'Petra ancient city, desert camping, Dead Sea, biblical sites',
                            description: 'Journey through the ancient wonders of Jordan. Explore the magnificent rock-cut city of Petra, camp under the stars in Wadi Rum desert, float in the mineral-rich Dead Sea, and visit biblical sites. Experience the perfect blend of history, adventure, and natural wonders.',
                            features: [
                                'Petra ancient city exploration',
                                'Wadi Rum desert camping',
                                'Dead Sea floating experience',
                                'Biblical site visits',
                                'Traditional Bedouin experience',
                                'Luxury desert accommodations'
                            ],
                            badge: 'Adventure',
                            badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
                            category: 'Historical',
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
                                    {/* Enhanced Image/Thumbnail */}
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

                                        {/* Enhanced Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg ${destination.badgeColor}`}
                                            >
                                                {destination.badge}
                                            </span>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                                {destination.category}
                                            </span>
                                        </div>

                                        {/* Enhanced Hover Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </div>

                                    {/* Enhanced Card Content */}
                                    <div className="p-5 md:p-6">
                                        <h3 className="mb-2 text-lg font-bold text-card-foreground transition-colors duration-300 group-hover:text-primary md:text-xl">
                                            {destination.title}
                                        </h3>
                                        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{destination.subtitle}</p>

                                        {/* Price and Duration */}
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="text-lg font-bold text-primary">{destination.price}</div>
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
                                        </div>

                                        {/* Location */}
                                        <div className="mb-3 flex items-center space-x-1 text-xs text-muted-foreground">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            <span>{destination.location}</span>
                                        </div>

                                        {/* Highlights */}
                                        <p className="mb-4 text-xs text-muted-foreground line-clamp-2">{destination.highlights}</p>

                                        {/* CTA */}
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs font-medium text-primary transition-transform duration-300 group-hover:scale-105">
                                                View Details →
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {destination.features.length} features included
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Bottom Accent Line */}
                                    <div className="h-1 origin-left scale-x-0 transform bg-gradient-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-x-100" />
                                </motion.article>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl border-white/20 bg-card/90 backdrop-blur-xl sm:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">{destination.title}</DialogTitle>
                                    <DialogDescription className="leading-relaxed text-base">
                                        {destination.description}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-6 grid gap-4">
                                    {/* Package Details */}
                                    <div className="rounded-lg border border-white/20 bg-card/60 p-4 backdrop-blur-sm">
                                        <h4 className="mb-3 font-semibold text-primary">Package Details</h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div><strong>Location:</strong> {destination.location}</div>
                                            <div><strong>Duration:</strong> {destination.duration}</div>
                                            <div><strong>Price:</strong> {destination.price} per person</div>
                                            <div><strong>Category:</strong> {destination.category}</div>
                                        </div>
                                    </div>

                                    {/* Highlights */}
                                    <div className="rounded-lg border border-white/20 bg-card/60 p-4 backdrop-blur-sm">
                                        <h4 className="mb-3 font-semibold text-primary">Highlights</h4>
                                        <p className="text-sm leading-relaxed">{destination.highlights}</p>
                                    </div>

                                    {/* Included Features */}
                                    <div className="rounded-lg border border-white/20 bg-card/60 p-4 backdrop-blur-sm">
                                        <h4 className="mb-3 font-semibold text-primary">What's Included</h4>
                                        <ul className="grid grid-cols-1 gap-2 text-sm">
                                            {destination.features.map((feature, index) => (
                                                <li key={index} className="flex items-center space-x-2">
                                                    <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex gap-3">
                                        <motion.a
                                            href="https://wa.me/6281234567890"
                                            target="_blank"
                                            rel="noreferrer"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex-1 rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-lg"
                                        >
                                            Book Now
                                        </motion.a>
                                        <motion.a
                                            href="https://wa.me/6281234567890"
                                            target="_blank"
                                            rel="noreferrer"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex-1 rounded-lg border border-primary px-4 py-3 text-center text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                                        >
                                            Ask Questions
                                        </motion.a>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </motion.div>

                {/* Enhanced Call to Action Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-12 text-center sm:mt-16 md:mt-20"
                >
                    <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 sm:mb-6 sm:px-6 sm:py-3">
                        <span className="text-xs font-medium text-primary sm:text-sm">✨ Custom Packages Available</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground sm:mb-4 sm:text-2xl md:text-3xl">
                        Can't Find the Perfect Destination?
                    </h3>
                    <p className="mx-auto mb-6 max-w-2xl text-sm text-muted-foreground sm:mb-8 sm:text-base">
                        Our travel experts are here to create the perfect custom itinerary just for you. 
                        Whether you're looking for a spiritual journey, cultural adventure, or luxury escape, 
                        we'll design an experience that matches your dreams and preferences.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <motion.a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-lg sm:px-8 sm:py-4 sm:text-base"
                        >
                            Free Consultation
                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.a>
                        <motion.a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground sm:px-8 sm:py-4 sm:text-base"
                        >
                            Custom Package
                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </motion.a>
                    </div>
                </motion.div>
            </section>

            {/* Enhanced Footer */}
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
                        <div className="xs:mt-1 mt-0.5 font-medium">24/7 Customer Support</div>
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
                                style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
