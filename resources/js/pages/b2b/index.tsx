import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RippleButton } from '@/components/ui/ripple-button';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Live Counter Component
function LiveCounter({ end, label, delay = 0 }: { end: number; label: string; delay?: number }) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStarted(true);
        }, delay * 1000);

        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let startTime: number | null = null;
        const duration = 2000; // 2 seconds

        const animate = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(end * easeOutCubic));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [started, end]);

    return (
        <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-amber-400"></div>
            <span>
                <motion.span
                    className="font-semibold"
                    key={count}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                >
                    {count.toLocaleString()}
                </motion.span>
                {label.includes('%') ? '% ' : '+ '}
                {label.replace('% ', '').replace('+ ', '')}
            </span>
        </div>
    );
}

export default function B2BIndex() {
    const services = [
        {
            id: 1,
            title: 'Group Pilgrimages',
            description: 'Organized Umrah and Hajj packages for corporate groups with comprehensive logistics management.',
            icon: '🕌',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/30'
        },
        {
            id: 2,
            title: 'Business Travel Management',
            description: 'End-to-end corporate travel solutions including flights, hotels, and ground transportation.',
            icon: '✈️',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30'
        },
        {
            id: 3,
            title: 'Corporate Events & Incentives',
            description: 'Team building trips and incentive travel programs to boost employee morale.',
            icon: '🏢',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/30'
        },
        {
            id: 4,
            title: 'Travel Analytics & Reporting',
            description: 'Comprehensive reporting and analytics to optimize corporate travel spend.',
            icon: '📊',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30'
        }
    ];

    const stats = [
        { number: '500+', label: 'Companies Served' },
        { number: '5+', label: 'Years Experience' },
        { number: '10,000+', label: 'Happy Travelers' },
        { number: '24/7', label: 'Support Available' }
    ];

    return (
        <B2BLayout>
            <Head title="Cahaya Anbiya - Corporate Travel Solutions" />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <img 
                        src="/b2b.jpeg" 
                        alt="Corporate Travel" 
                        className="h-full w-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="space-y-8"
                    >
                        {/* Main Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl"
                        >
                            Your Trusted Partner in
                            <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                Corporate Travel
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="mx-auto max-w-3xl text-lg text-gray-300 sm:text-xl"
                        >
                            We specialize in providing comprehensive corporate travel solutions, 
                            group pilgrimages, and business travel services with unmatched professionalism.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.9 }}
                            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
                        >
                            <Link
                                href="https://wa.me/6281234567890"
                                target="_blank"
                                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl"
                            >
                                Start Consultation
                            </Link>
                            <Link
                                href="/packages"
                                className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50"
                            >
                                View Packages
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-br from-gray-900 to-black py-16">
                <div className="mx-auto max-w-6xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 gap-8 sm:grid-cols-4"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl font-bold text-amber-400 sm:text-4xl">
                                    {stat.number}
                                </div>
                                <div className="mt-2 text-sm text-gray-400 sm:text-base">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-6xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            Corporate Services
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Comprehensive solutions tailored for your business needs
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`rounded-xl border ${service.borderColor} ${service.bgColor} p-6 text-center transition-all duration-300 hover:shadow-lg`}
                            >
                                <div className="text-4xl mb-4">{service.icon}</div>
                                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {service.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section className="bg-gray-50 py-16">
                <div className="mx-auto max-w-4xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                            Corporate Travel Excellence
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            PT Cahaya Anbiya Travel is a leading corporate travel management company 
                            specializing in business travel, group pilgrimages, and corporate events. 
                            With over 5 years of experience serving hundreds of companies, we deliver 
                            exceptional service with attention to detail and professional excellence.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3"
                    >
                        <div className="text-center">
                            <div className="text-3xl mb-3">🎯</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Strategic Planning</h3>
                            <p className="text-gray-600 text-sm">
                                Customized travel solutions aligned with corporate goals and budget requirements.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-3">🤝</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Partnership Focus</h3>
                            <p className="text-gray-600 text-sm">
                                Long-term relationships built on trust, reliability, and mutual success.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-3">📊</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Data-Driven</h3>
                            <p className="text-gray-600 text-sm">
                                Comprehensive reporting and analytics to optimize travel spend.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-gray-900 to-black py-16">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Contact us today to discuss your corporate travel needs
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Link
                                href="https://wa.me/6281234567890"
                                target="_blank"
                                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:from-green-600 hover:to-green-700"
                            >
                                WhatsApp Consultation
                            </Link>
                            <Link
                                href="tel:+6281234567890"
                                className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                            >
                                Call Us Now
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </B2BLayout>
    );
}
