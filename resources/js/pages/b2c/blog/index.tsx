import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function BlogIndex() {
    const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

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

    // Comprehensive blog articles with travel-related content
    const blogArticles = [
        {
            id: 1,
            title: 'Complete Guide to Umrah: Spiritual Journey to the Holy Land',
            excerpt:
                'Discover everything you need to know about performing Umrah, from preparation to completion. Learn about the sacred rituals, best times to visit, and how to make your spiritual journey truly meaningful.',
            image: '/umrah.jpeg',
            category: 'Spiritual Journey',
            readTime: '8 min read',
            date: 'August 28, 2025',
            author: 'Cahaya Anbiya Team',
            tags: ['Umrah', 'Spiritual', 'Makkah', 'Madinah'],
            featured: true,
        },
        {
            id: 2,
            title: 'Exploring Turkey: From Istanbul to Cappadocia',
            excerpt:
                "Embark on a cultural adventure through Turkey's most iconic destinations. From the historic streets of Istanbul to the magical landscapes of Cappadocia, discover the perfect blend of East and West.",
            image: '/TURKEY.jpeg',
            category: 'Cultural Travel',
            readTime: '6 min read',
            date: 'August 25, 2025',
            author: 'Travel Expert',
            tags: ['Turkey', 'Istanbul', 'Cappadocia', 'Culture'],
            featured: true,
        },
        {
            id: 3,
            title: 'Ancient Egypt: Unveiling the Mysteries of the Pharaohs',
            excerpt:
                'Journey through the cradle of civilization and explore the magnificent wonders of ancient Egypt. From the Great Pyramids to the Valley of the Kings, experience the magic of pharaonic history.',
            image: '/egypt.jpeg',
            category: 'Historical Travel',
            readTime: '7 min read',
            date: 'August 22, 2025',
            author: 'Archaeology Enthusiast',
            tags: ['Egypt', 'Pyramids', 'History', 'Nile'],
            featured: false,
        },
        {
            id: 4,
            title: 'Dubai Luxury: Modern Wonders and Desert Adventures',
            excerpt:
                'Experience the epitome of luxury and innovation in Dubai. From the iconic Burj Khalifa to thrilling desert safaris, discover why Dubai is the ultimate destination for luxury travelers.',
            image: '/dubai1.jpeg',
            category: 'Luxury Travel',
            readTime: '5 min read',
            date: 'August 20, 2025',
            author: 'Luxury Travel Specialist',
            tags: ['Dubai', 'Luxury', 'Desert', 'Modern'],
            featured: false,
        },
        {
            id: 5,
            title: 'Oman Adventure: Hidden Gems of the Arabian Peninsula',
            excerpt:
                'Explore the hidden gem of the Arabian Peninsula. From the stunning fjords of Musandam to the ancient forts of Nizwa, discover authentic Arabian experiences away from the crowds.',
            image: '/oman.jpg',
            category: 'Adventure Travel',
            readTime: '6 min read',
            date: 'August 18, 2025',
            author: 'Adventure Guide',
            tags: ['Oman', 'Adventure', 'Desert', 'Forts'],
            featured: false,
        },
        {
            id: 6,
            title: 'Qatar Luxury: Tradition Meets Modernity',
            excerpt:
                'Discover the perfect blend of tradition and modernity in Qatar. From the stunning Museum of Islamic Art to luxury at The Pearl, experience why Qatar is becoming a premier travel destination.',
            image: '/qatar.jpg',
            category: 'Luxury Travel',
            readTime: '5 min read',
            date: 'August 15, 2025',
            author: 'Qatar Expert',
            tags: ['Qatar', 'Luxury', 'Culture', 'Modern'],
            featured: false,
        },
        {
            id: 7,
            title: 'Kuwait Heritage: Rich Culture and Modern Charm',
            excerpt:
                'Discover the rich heritage and modern charm of Kuwait. Visit the iconic Kuwait Towers, explore the magnificent Grand Mosque, and experience the vibrant culture of this unique Gulf nation.',
            image: '/kuwait.jpg',
            category: 'Cultural Travel',
            readTime: '4 min read',
            date: 'August 12, 2025',
            author: 'Cultural Specialist',
            tags: ['Kuwait', 'Culture', 'Heritage', 'Modern'],
            featured: false,
        },
        {
            id: 8,
            title: 'Bahrain Pearl: History, Culture, and Modern Entertainment',
            excerpt:
                'Experience the pearl of the Gulf with its rich history and modern attractions. Explore ancient forts, learn about traditional pearl diving, and discover the vibrant culture of Bahrain.',
            image: '/bahrain.jpg',
            category: 'Cultural Travel',
            readTime: '5 min read',
            date: 'August 10, 2025',
            author: 'Bahrain Guide',
            tags: ['Bahrain', 'Culture', 'History', 'Pearls'],
            featured: false,
        },
        {
            id: 9,
            title: 'Jordan Discovery: Ancient Wonders and Natural Beauty',
            excerpt:
                'Journey through the ancient wonders of Jordan. Explore the magnificent rock-cut city of Petra, camp under the stars in Wadi Rum, and float in the mineral-rich Dead Sea.',
            image: '/jordan.jpeg',
            category: 'Historical Travel',
            readTime: '7 min read',
            date: 'August 8, 2025',
            author: 'Jordan Expert',
            tags: ['Jordan', 'Petra', 'Wadi Rum', 'History'],
            featured: false,
        },
    ];

    return (
        <PublicLayout>
            <Head title="Blog - Cahaya Anbiya Wisata" />

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-10 md:py-16">
                {/* Enhanced Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-12 text-center md:mb-16"
                >
                    <h1 className="mb-4 text-4xl font-bold text-foreground md:text-6xl lg:text-7xl">
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Travel Insights & Stories
                        </span>
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                        Discover travel tips, destination guides, and inspiring stories from our expert team. From spiritual journeys to luxury
                        adventures, we share insights to help you plan your perfect trip.
                    </p>
                    <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span>Expert Travel Guides</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-secondary"></div>
                            <span>Destination Insights</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-secondary"></div>
                            <span>Travel Tips</span>
                        </div>
                    </div>
                </motion.div>

                {/* Featured Articles Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">Featured Articles</h2>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {blogArticles
                            .filter((article) => article.featured)
                            .map((article) => (
                                <motion.article
                                    key={article.id}
                                    variants={cardVariants}
                                    whileHover={{
                                        scale: 1.02,
                                        y: -4,
                                        transition: { duration: 0.3, ease: 'easeOut' },
                                    }}
                                    className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-500 ease-in-out hover:shadow-xl"
                                >
                                    {/* Featured Image */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                                {article.category}
                                            </span>
                                        </div>

                                        {/* Featured Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className="rounded-full bg-gradient-to-r from-secondary to-accent px-3 py-1 text-xs font-bold text-white shadow-lg">
                                                Featured
                                            </span>
                                        </div>
                                    </div>

                                    {/* Article Content */}
                                    <div className="p-6">
                                        <div className="mb-3 flex items-center space-x-4 text-xs text-muted-foreground">
                                            <span>{article.date}</span>
                                            <span>•</span>
                                            <span>{article.readTime}</span>
                                            <span>•</span>
                                            <span>By {article.author}</span>
                                        </div>

                                        <h3 className="mb-3 text-xl font-bold text-card-foreground transition-colors duration-300 group-hover:text-primary md:text-2xl">
                                            {article.title}
                                        </h3>

                                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground md:text-base">{article.excerpt}</p>

                                        {/* Tags */}
                                        <div className="mb-4 flex flex-wrap gap-2">
                                            {article.tags.map((tag) => (
                                                <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setSelectedArticle(article.id)}
                                            className="group inline-flex items-center rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg"
                                        >
                                            Read Full Article
                                            <svg
                                                className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                    </div>
                </motion.div>

                {/* All Articles Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                    {blogArticles
                        .filter((article) => !article.featured)
                        .map((article) => (
                            <motion.article
                                key={article.id}
                                variants={cardVariants}
                                whileHover={{
                                    scale: 1.03,
                                    y: -8,
                                    transition: { duration: 0.3, ease: 'easeOut' },
                                }}
                                className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-500 ease-in-out hover:shadow-xl"
                            >
                                {/* Article Image */}
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Article Content */}
                                <div className="p-5 md:p-6">
                                    <div className="mb-2 flex items-center space-x-3 text-xs text-muted-foreground">
                                        <span>{article.date}</span>
                                        <span>•</span>
                                        <span>{article.readTime}</span>
                                    </div>

                                    <h3 className="mb-3 text-lg font-bold text-card-foreground transition-colors duration-300 group-hover:text-primary md:text-xl">
                                        {article.title}
                                    </h3>

                                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>

                                    {/* Author */}
                                    <div className="mb-4 flex items-center space-x-2 text-xs text-muted-foreground">
                                        <span>By {article.author}</span>
                                    </div>

                                    {/* Tags */}
                                    <div className="mb-4 flex flex-wrap gap-1">
                                        {article.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setSelectedArticle(article.id)}
                                        className="group inline-flex items-center rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg"
                                    >
                                        Read More
                                        <svg
                                            className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Bottom Accent Line */}
                                <div className="h-1 origin-left scale-x-0 transform bg-gradient-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-x-100" />
                            </motion.article>
                        ))}
                </motion.div>

                {/* Newsletter Subscription Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-16 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 p-8 text-center backdrop-blur-sm sm:p-12"
                >
                    <div className="mx-auto max-w-2xl">
                        <h3 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">Stay Updated with Travel Insights</h3>
                        <p className="mb-6 text-muted-foreground">
                            Subscribe to our newsletter and receive the latest travel tips, destination guides, and exclusive offers directly to your
                            inbox.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none sm:max-w-xs sm:flex-1"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-lg"
                            >
                                Subscribe
                            </motion.button>
                        </div>
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

            {/* Blog Article Modal */}
            <Dialog open={selectedArticle !== null} onOpenChange={() => setSelectedArticle(null)}>
                <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto border border-amber-500/30 bg-gradient-to-br from-amber-950 via-orange-950 to-amber-900 shadow-2xl sm:max-w-[80vw] md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
                    <DialogHeader className="border-b border-amber-500/30 pb-2 sm:pb-3 md:pb-4">
                        <DialogTitle className="bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 bg-clip-text text-sm leading-tight font-bold text-transparent sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                            {selectedArticle && blogArticles.find((article) => article.id === selectedArticle)?.title}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedArticle &&
                        (() => {
                            const article = blogArticles.find((a) => a.id === selectedArticle);
                            if (!article) return null;

                            return (
                                <div className="space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-6">
                                    {/* Article Image */}
                                    <div className="relative overflow-hidden rounded-lg border border-amber-500/30">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="h-28 w-full object-cover sm:h-32 md:h-40 lg:h-48 xl:h-56"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/50 to-transparent" />
                                    </div>

                                    {/* Article Meta */}
                                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-300 sm:gap-2 md:gap-3 md:text-sm">
                                        <div className="flex items-center gap-1">
                                            <svg
                                                className="h-3 w-3 text-amber-400 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span>{article.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg
                                                className="h-3 w-3 text-blue-400 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>{article.readTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg
                                                className="h-3 w-3 text-secondary sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <span>By {article.author}</span>
                                        </div>
                                    </div>

                                    {/* Article Content */}
                                    <div className="space-y-2.5 text-xs leading-relaxed text-gray-200 sm:space-y-3 sm:text-sm md:space-y-4 md:text-base">
                                        <div className="rounded-lg bg-gray-800/50 p-2.5 sm:p-3 md:p-4">
                                            <p className="text-amber-200">{article.excerpt}</p>
                                        </div>

                                        <div className="rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-2.5 sm:p-3 md:p-4">
                                            <h3 className="mb-1.5 text-xs font-semibold text-amber-300 sm:mb-2 sm:text-sm md:mb-2.5 md:text-base lg:text-lg">
                                                Key Highlights
                                            </h3>
                                            <ul className="space-y-1 text-gray-300 sm:space-y-1.5 md:space-y-2">
                                                <li className="flex items-start gap-1.5 sm:gap-2">
                                                    <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-400 sm:mt-1 sm:h-1.5 sm:w-1.5 md:mt-1.5"></span>
                                                    <span className="text-xs sm:text-sm">Comprehensive guide to spiritual journey preparation</span>
                                                </li>
                                                <li className="flex items-start gap-1.5 sm:gap-2">
                                                    <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-400 sm:mt-1 sm:h-1.5 sm:w-1.5 md:mt-1.5"></span>
                                                    <span className="text-xs sm:text-sm">Essential rituals and their significance explained</span>
                                                </li>
                                                <li className="flex items-start gap-1.5 sm:gap-2">
                                                    <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-400 sm:mt-1 sm:h-1.5 sm:w-1.5 md:mt-1.5"></span>
                                                    <span className="text-xs sm:text-sm">Practical tips for a meaningful experience</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="rounded-lg bg-gradient-to-r from-secondary/10 to-accent/10 p-2.5 sm:p-3 md:p-4">
                                            <h3 className="mb-1.5 text-xs font-semibold text-blue-300 sm:mb-2 sm:text-sm md:mb-2.5 md:text-base lg:text-lg">
                                                What You'll Learn
                                            </h3>
                                            <div className="grid gap-1.5 sm:gap-2 md:gap-3">
                                                <div>
                                                    <h4 className="text-xs font-medium text-blue-200 sm:text-sm">Preparation</h4>
                                                    <p className="text-xs text-gray-300 sm:text-sm">
                                                        Physical and spiritual preparation for your journey
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-medium text-blue-200 sm:text-sm">Rituals</h4>
                                                    <p className="text-xs text-gray-300 sm:text-sm">
                                                        Step-by-step guide to Umrah rituals and their meanings
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                                            {article.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-xs font-medium text-amber-300 sm:px-2 sm:py-1 md:px-3"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA Section */}
                                    <div className="rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-2.5 sm:p-3 md:p-4">
                                        <h3 className="mb-2 text-xs font-semibold text-amber-300 sm:mb-2.5 sm:text-sm md:mb-3 md:text-base lg:text-lg">
                                            Ready to Start Your Journey?
                                        </h3>
                                        <button
                                            onClick={() => window.open('https://www.instagram.com/cahayaanbiya_id/', '_blank')}
                                            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-secondary via-accent to-secondary px-3 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm md:px-6 md:py-3 md:text-base"
                                        >
                                            <svg
                                                className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                            <span className="text-xs sm:text-sm md:text-base">Follow on Instagram</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}
