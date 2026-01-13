import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Award, Globe, Heart, Shield, Star, TrendingUp, Users } from 'lucide-react';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const ease = [0.22, 1, 0.36, 1];

export default function About() {
    const coreValues = [
        {
            icon: Shield,
            title: 'Integrity',
            description: 'Transparency and honesty in every service we provide',
            color: 'from-blue-500/20 to-indigo-500/20',
            borderColor: 'border-blue-500/30',
            iconColor: 'text-blue-400',
            accentGradient: 'from-blue-400 to-indigo-400',
        },
        {
            icon: Heart,
            title: 'Hospitality',
            description: 'Genuine warmth and care in every journey',
            color: 'from-rose-500/20 to-pink-500/20',
            borderColor: 'border-rose-500/30',
            iconColor: 'text-rose-400',
            accentGradient: 'from-rose-400 to-pink-400',
        },
        {
            icon: Star,
            title: 'Excellence',
            description: 'Uncompromising quality in every travel detail',
            color: 'from-amber-500/20 to-orange-500/20',
            borderColor: 'border-amber-500/30',
            iconColor: 'text-amber-400',
            accentGradient: 'from-amber-400 to-orange-400',
        },
    ];

    const stats = [
        {
            number: '100+',
            label: 'Happy Travelers',
            icon: Users,
        },
        {
            number: '15+',
            label: 'Destinations',
            icon: Globe,
        },
        {
            number: '2025',
            label: 'Established',
            icon: Award,
        },
        {
            number: '95%',
            label: 'Satisfaction Rate',
            icon: TrendingUp,
        },
    ];

    return (
        <PublicLayout>
            <Head title="About Us - Cahaya Anbiya Travel" />

            <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-10">
                    {/* Ambient Background Effects */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.1),transparent_70%)] blur-2xl" style={{ willChange: 'auto' }} />
                        <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.1),transparent_70%)] blur-2xl" style={{ willChange: 'auto' }} />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                        {/* Header */}
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={fadeInUp}
                            transition={{ duration: 0.8, ease }}
                            className="mb-8 text-center md:mb-10"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="mb-4 inline-block"
                            >
                                <div className="rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-4 py-1.5 shadow-xl">
                                    <span className="text-xs font-semibold tracking-wider text-amber-200 uppercase sm:text-sm">
                                        ✨ Cahaya Anbiya Travel
                                    </span>
                                </div>
                            </motion.div>

                            {/* Title - Compact Size */}
                            <h1 className="mb-4 bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-3xl leading-tight font-bold text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                                About Us
                            </h1>

                            {/* Subtitle */}
                            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg lg:text-xl">
                                Creating unforgettable travel experiences with exceptional service, cultural authenticity, and unwavering commitment
                                to excellence
                            </p>
                        </motion.div>

                        {/* Stats Grid - Compact */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-100px' }}
                            className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
                        >
                            {stats.map((stat, index) => {
                                const IconComponent = stat.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        variants={scaleIn}
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-4 text-center shadow-lg sm:p-5 md:p-6"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 transition-all duration-500 group-hover:from-amber-500/15 group-hover:to-orange-500/15" />

                                        <div className="relative">
                                            {/* Icon */}
                                            <div className="mb-3 flex justify-center">
                                                <div className="rounded-lg bg-gradient-to-br from-amber-500/25 to-orange-500/25 p-2 shadow-md ring-1 ring-amber-500/50 sm:p-2.5">
                                                    <IconComponent className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6" />
                                                </div>
                                            </div>

                                            {/* Number - Compact */}
                                            <div className="mb-1.5 bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl lg:text-5xl">
                                                {stat.number}
                                            </div>

                                            {/* Label */}
                                            <div className="text-xs font-semibold text-white/90 sm:text-sm">{stat.label}</div>
                                        </div>

                                        {/* Bottom Accent Line */}
                                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 shadow-md transition-all duration-500 group-hover:w-full" />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="relative py-12 md:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                            {/* Left Column - Company Info */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.8, ease }}
                                className="space-y-6"
                            >
                                {/* Company Profile */}
                                <div className="space-y-3">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <h2 className="mb-3 bg-gradient-to-r from-amber-200 to-white bg-clip-text text-xl font-bold text-transparent sm:text-2xl lg:text-3xl">
                                            Company Profile
                                        </h2>
                                        <p className="text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
                                            PT Cahaya Anbiya Travel is a premier travel company committed to providing memorable and comfortable halal
                                            travel experiences. We prioritize service quality with a friendly and professional approach, ensuring
                                            every journey is both spiritually fulfilling and culturally enriching.
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Vision Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    whileHover={{ y: -4 }}
                                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-5 shadow-lg backdrop-blur-sm sm:p-6"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 transition-all duration-500 group-hover:from-blue-500/10 group-hover:to-indigo-500/10" />

                                    <div className="relative">
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 px-3 py-1.5">
                                            <div className="h-2 w-2 rounded-full bg-blue-400 shadow-md shadow-blue-400/50" />
                                            <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">Vision</span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                                            To become a leading travel company in inspiring halal travel packages that connect people with their faith
                                            and culture, creating transformative experiences that last a lifetime.
                                        </p>
                                    </div>

                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-indigo-400 shadow-md transition-all duration-500 group-hover:w-full" />
                                </motion.div>

                                {/* Mission Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    whileHover={{ y: -4 }}
                                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-5 shadow-lg backdrop-blur-sm sm:p-6"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 transition-all duration-500 group-hover:from-purple-500/10 group-hover:to-pink-500/10" />

                                    <div className="relative">
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1.5">
                                            <div className="h-2 w-2 rounded-full bg-purple-400 shadow-md shadow-purple-400/50" />
                                            <span className="text-xs font-bold tracking-wider text-purple-300 uppercase">Mission</span>
                                        </div>
                                        <ul className="space-y-2.5 text-sm text-white/85 sm:text-base">
                                            <li className="flex items-start gap-2.5">
                                                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-md" />
                                                <span>Provide inspiring halal travel experiences that enrich spiritual journeys</span>
                                            </li>
                                            <li className="flex items-start gap-2.5">
                                                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-md" />
                                                <span>Prioritize safety, comfort, and authenticity in every service</span>
                                            </li>
                                            <li className="flex items-start gap-2.5">
                                                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-md" />
                                                <span>Deliver exceptional customer service with cultural sensitivity</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-400 to-pink-400 shadow-md transition-all duration-500 group-hover:w-full" />
                                </motion.div>
                            </motion.div>

                            {/* Right Column - Core Values */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.8, ease, delay: 0.2 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="mb-5 bg-gradient-to-r from-amber-200 to-white bg-clip-text text-xl font-bold text-transparent sm:text-2xl lg:text-3xl">
                                        Our Core Values
                                    </h2>

                                    <div className="space-y-4">
                                        {coreValues.map((value, index) => {
                                            const IconComponent = value.icon;
                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true, margin: '-50px' }}
                                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                                    whileHover={{ y: -4, x: 1 }}
                                                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-5 shadow-lg backdrop-blur-sm sm:p-6"
                                                >
                                                    <div
                                                        className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 transition-all duration-500 group-hover:opacity-100`}
                                                    />

                                                    <div className="relative flex items-start gap-3.5">
                                                        <div
                                                            className={`flex-shrink-0 rounded-lg border ${value.borderColor} bg-gradient-to-br ${value.color} p-2.5 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 sm:p-3`}
                                                        >
                                                            <IconComponent className={`h-5 w-5 ${value.iconColor} sm:h-6 sm:w-6`} />
                                                        </div>

                                                        <div className="flex-1">
                                                            <h3 className="mb-1.5 text-base font-bold text-white transition-colors sm:text-lg lg:text-xl">
                                                                {value.title}
                                                            </h3>
                                                            <p className="text-xs leading-relaxed text-white/75 transition-colors group-hover:text-white/90 sm:text-sm">
                                                                {value.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${value.accentGradient} shadow-md transition-all duration-500 group-hover:w-full`}
                                                    />
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* CTA Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 shadow-xl sm:p-8"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10" />

                                    <div className="relative text-center">
                                        <h3 className="mb-2.5 text-xl font-bold text-white sm:text-2xl">Ready to Start Your Journey?</h3>
                                        <p className="mb-5 text-sm text-white/95 sm:text-base">
                                            Contact us today for a free consultation and let us help you plan your perfect travel experience
                                        </p>
                                        <motion.a
                                            href="https://wa.me/6281234567890"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-xl transition-all hover:bg-white/95 hover:shadow-2xl sm:px-8 sm:py-4 sm:text-base"
                                        >
                                            <span>Free Consultation</span>
                                            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </motion.a>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative border-t border-white/10 bg-black/70">
                    <motion.div
                        className="mx-auto max-w-7xl px-4 py-12 sm:px-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                            {/* Contact Info */}
                            <div className="text-center text-base text-white/70 md:text-left">
                                <div className="font-semibold">Email: hello@cahaya-anbiya.com</div>
                                <div className="mt-2 font-semibold">WhatsApp: +62 812-3456-7890</div>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-8">
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
                                        className="text-base font-semibold text-white/70 transition-colors hover:text-amber-400"
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {social.name}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 border-t border-white/10 pt-8 text-center">
                            <p className="text-sm text-white/50">© 2024 Cahaya Anbiya Travel. All rights reserved.</p>
                        </div>
                    </motion.div>
                </footer>
            </div>
        </PublicLayout>
    );
}
