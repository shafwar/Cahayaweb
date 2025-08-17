import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Heart, Shield, Star } from 'lucide-react';

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

export default function About() {
    const coreValues = [
        {
            icon: <Shield className="h-6 w-6" />,
            title: 'Integrity',
            description: 'Transparency and honesty in every service we provide',
        },
        {
            icon: <Heart className="h-6 w-6" />,
            title: 'Hospitality',
            description: 'Genuine warmth and care in every journey',
        },
        {
            icon: <Star className="h-6 w-6" />,
            title: 'Excellence',
            description: 'Uncompromising quality in every travel detail',
        },
    ];

    const stats = [
        { number: '500+', label: 'Happy Travelers' },
        { number: '50+', label: 'Destinations' },
        { number: '5+', label: 'Years Experience' },
    ];

    return (
        <PublicLayout>
            <Head title="About" />

            {/* Dark theme background */}
            <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/50 to-black">
                <section className="mx-auto max-w-6xl px-6 pt-32 pb-16">
                    {/* Clean Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="mb-16 text-center"
                    >
                        <div className="mb-6 inline-block rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-purple-600/20 px-4 py-2">
                            <span className="text-sm font-medium text-purple-300">✨ Cahaya Anbiya Travel</span>
                        </div>
                        <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">About Us</h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-300">Creating memorable travel experiences with the best service</p>
                    </motion.div>

                    {/* Simple 2 Column Layout */}
                    <div className="grid items-start gap-12 lg:grid-cols-2">
                        {/* Left - Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            {/* Company Profile */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-white">Company Profile</h2>
                                <p className="leading-relaxed text-gray-300">
                                    PT Cahaya Anbiya Travel is a travel company committed to providing memorable and comfortable halal travel
                                    experiences. We prioritize service quality with a friendly and professional approach, ensuring every journey is
                                    both spiritually fulfilling and culturally enriching.
                                </p>
                            </div>

                            {/* Vision & Mission - Simple Cards */}
                            <div className="space-y-6">
                                <motion.div
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="rounded-2xl border border-purple-500/30 bg-black/40 p-6 shadow-lg backdrop-blur-sm"
                                >
                                    <h3 className="mb-3 text-lg font-semibold text-purple-400">Vision</h3>
                                    <p className="text-gray-300">
                                        To become a leading travel company in inspiring halal travel packages that connect people with their faith and
                                        culture.
                                    </p>
                                </motion.div>

                                <motion.div
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="rounded-2xl border border-purple-500/30 bg-black/40 p-6 shadow-lg backdrop-blur-sm"
                                >
                                    <h3 className="mb-3 text-lg font-semibold text-purple-400">Mission</h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 text-purple-400">•</span>
                                            Provide inspiring halal travel experiences that enrich spiritual journeys
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 text-purple-400">•</span>
                                            Prioritize safety, comfort, and authenticity in every service
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 text-purple-400">•</span>
                                            Deliver exceptional customer service with cultural sensitivity
                                        </li>
                                    </ul>
                                </motion.div>
                            </div>

                            {/* Simple Stats */}
                            <div className="grid grid-cols-3 gap-6 py-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="mb-1 text-2xl font-bold text-purple-400">{stat.number}</div>
                                        <div className="text-sm text-gray-400">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right - Core Values */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-4"
                        >
                            <h2 className="mb-6 text-2xl font-semibold text-white">Our Core Values</h2>

                            <div className="space-y-4">
                                {coreValues.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        whileHover={{
                                            scale: 1.02,
                                            transition: { duration: 0.2 },
                                        }}
                                        className="group rounded-2xl border border-white/20 bg-black/40 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-3 transition-transform duration-300 group-hover:scale-110">
                                                <div className="text-purple-400 transition-colors group-hover:text-purple-300">{value.icon}</div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-purple-300">
                                                    {value.title}
                                                </h3>
                                                <p className="text-sm leading-relaxed text-gray-300 transition-colors group-hover:text-gray-200">
                                                    {value.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Simple CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="mt-8 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-center"
                            >
                                <h3 className="mb-2 text-xl font-semibold text-white">Ready to Start Your Journey?</h3>
                                <p className="mb-4 text-sm text-purple-100">Contact us for a free consultation</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="rounded-full bg-white px-6 py-3 font-medium text-purple-700 shadow-lg transition-colors duration-300 hover:bg-purple-50"
                                >
                                    Free Consultation
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
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
            </div>
        </PublicLayout>
    );
}
