import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RippleButton } from '@/components/ui/ripple-button';
import B2BLayout from '@/layouts/b2b-layout';
import { Head } from '@inertiajs/react';
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

export default function CahayaAnbiyaHero() {
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [consultationStep, setConsultationStep] = useState<'start' | 'whatsapp' | 'phone' | 'office'>('start');
    const [showPackagesDialog, setShowPackagesDialog] = useState(false);

    const packages = [
        {
            id: 1,
            name: 'Premium Umrah Package',
            duration: '9 Days 8 Nights',
            price: 'Starting from Rp 28,500,000',
            features: [
                '5-star hotel accommodation (Makkah & Madinah)',
                'Direct flights with premium airlines',
                'Private transportation throughout',
                'Professional multilingual guide',
                'All meals included (Halal certified)',
                'Zam-zam water supply',
                '24/7 customer support',
                'Comprehensive travel insurance',
            ],
            highlights: 'Best for first-time pilgrims seeking comfort and guidance',
        },
        {
            id: 2,
            name: 'Luxury Hajj Package',
            duration: '14 Days 13 Nights',
            price: 'Starting from Rp 87,500,000',
            features: [
                'Luxury 5-star hotels (closest to Haram)',
                'VIP airport transfers',
                'Premium tent accommodation in Mina',
                'Dedicated scholar for spiritual guidance',
                'All rituals assistance included',
                'Premium meal arrangements',
                'Health monitoring service',
                'Exclusive group sizes (max 20 people)',
            ],
            highlights: 'Ultimate spiritual journey with maximum comfort and personalized service',
        },
        {
            id: 3,
            name: 'Economy Umrah Package',
            duration: '7 Days 6 Nights',
            price: 'Starting from Rp 18,500,000',
            features: [
                '4-star hotel accommodation',
                'Shared transportation',
                'Experienced group leader',
                'Daily breakfast included',
                'Basic travel insurance',
                'Group guidance sessions',
                'Essential amenities provided',
            ],
            highlights: 'Perfect for budget-conscious pilgrims without compromising essentials',
        },
    ];

    const consultationSteps = {
        start: {
            title: 'Free Consultation - Get Started',
            content: (
                <div className="space-y-6">
                    <div className="rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
                        <h3 className="mb-3 font-semibold text-amber-800">🌟 What You'll Get:</h3>
                        <ul className="space-y-2 text-sm text-amber-700">
                            <li className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                Personalized pilgrimage planning
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                Budget optimization guidance
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                Travel document assistance
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                Spiritual preparation resources
                            </li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <RippleButton
                            onClick={() => setConsultationStep('whatsapp')}
                            className="flex items-center gap-3 rounded-lg bg-green-500 p-4 text-white hover:bg-green-600"
                        >
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487" />
                            </svg>
                            WhatsApp Consultation
                        </RippleButton>

                        <RippleButton
                            onClick={() => setConsultationStep('phone')}
                            className="flex items-center gap-3 rounded-lg bg-blue-500 p-4 text-white hover:bg-blue-600"
                        >
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                            Phone Consultation
                        </RippleButton>
                    </div>

                    <RippleButton
                        onClick={() => setConsultationStep('office')}
                        className="flex w-full items-center gap-3 rounded-lg bg-gray-100 p-4 text-gray-800 hover:bg-gray-200"
                    >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        Visit Our Office
                    </RippleButton>
                </div>
            ),
        },
        whatsapp: {
            title: 'WhatsApp Consultation',
            content: (
                <div className="space-y-4">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <h3 className="mb-2 font-semibold text-green-800">📱 Instant WhatsApp Support</h3>
                        <p className="mb-4 text-sm text-green-700">Get immediate responses from our certified travel consultants</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Main Consultant:</span>
                                <span className="text-sm">+62 812-3456-7890</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Hajj Specialist:</span>
                                <span className="text-sm">+62 812-3456-7891</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Available:</span>
                                <span className="text-sm text-green-600">24/7 Support</span>
                            </div>
                        </div>
                    </div>
                    <RippleButton className="w-full bg-green-500 text-white hover:bg-green-600">Open WhatsApp Chat</RippleButton>
                    <button onClick={() => setConsultationStep('start')} className="w-full text-sm text-gray-600 hover:text-gray-800">
                        ← Back to consultation options
                    </button>
                </div>
            ),
        },
        phone: {
            title: 'Phone Consultation',
            content: (
                <div className="space-y-4">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <h3 className="mb-2 font-semibold text-blue-800">📞 Professional Phone Support</h3>
                        <p className="mb-4 text-sm text-blue-700">Speak directly with our experienced travel advisors</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Main Office:</span>
                                <span className="font-mono text-sm">021-1234-5678</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Toll-Free:</span>
                                <span className="font-mono text-sm">0800-1234-5678</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Business Hours:</span>
                                <span className="text-sm">Mon-Fri: 08:00-17:00 WIB</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Weekend:</span>
                                <span className="text-sm">Sat: 09:00-15:00 WIB</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-3">
                        <p className="text-xs text-amber-700">💡 Best time to call: 10:00-12:00 WIB for immediate assistance</p>
                    </div>
                    <button onClick={() => setConsultationStep('start')} className="w-full text-sm text-gray-600 hover:text-gray-800">
                        ← Back to consultation options
                    </button>
                </div>
            ),
        },
        office: {
            title: 'Visit Our Office',
            content: (
                <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h3 className="mb-2 font-semibold text-gray-800">🏢 In-Person Consultation</h3>
                        <p className="mb-4 text-sm text-gray-700">Visit our office for comprehensive face-to-face planning</p>
                        <div className="space-y-3">
                            <div>
                                <span className="block text-sm font-medium">Address:</span>
                                <span className="text-sm text-gray-600">
                                    Jl. Sudirman No. 123, Jakarta Pusat
                                    <br />
                                    DKI Jakarta 10220, Indonesia
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Office Hours:</span>
                                <span className="text-sm">Mon-Fri: 08:00-17:00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Saturday:</span>
                                <span className="text-sm">09:00-15:00</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-3">
                        <p className="text-xs text-amber-700">📋 Please bring: ID, passport copy, and any specific requirements</p>
                    </div>
                    <RippleButton className="w-full bg-amber-500 text-white hover:bg-amber-600">Schedule Appointment</RippleButton>
                    <button onClick={() => setConsultationStep('start')} className="w-full text-sm text-gray-600 hover:text-gray-800">
                        ← Back to consultation options
                    </button>
                </div>
            ),
        },
    };

    return (
        <B2BLayout>
            <Head title="Cahaya Anbiya - Premium Hajj & Umrah Services" />

            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
                {/* Floating Elements Animation */}
                <div className="pointer-events-none absolute inset-0">
                    <motion.div
                        animate={{
                            x: [0, 30, 0],
                            y: [0, -20, 0],
                            rotate: [0, 5, 0],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-20 left-10 h-16 w-16 rounded-full bg-amber-400/10 blur-xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, -25, 0],
                            y: [0, 15, 0],
                            rotate: [0, -3, 0],
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-40 right-20 h-24 w-24 rounded-full bg-amber-300/8 blur-xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, 20, 0],
                            y: [0, -10, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute bottom-32 left-1/4 h-20 w-20 rounded-full bg-white/5 blur-xl"
                    />
                </div>

                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Beautiful view of Kaaba and Masjid al-Haram"
                        className="h-full w-full object-cover"
                    />
                    {/* Enhanced dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
                    {/* Warm golden overlay for premium feel */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-amber-800/30"></div>
                    {/* Additional text enhancement overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                    {/* Animated Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute h-1 w-1 rounded-full bg-amber-300/30"
                                initial={{
                                    x: Math.random() * 1200,
                                    y: Math.random() * 800,
                                    opacity: 0,
                                }}
                                animate={{
                                    y: [null, -100],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: Math.random() * 8 + 4,
                                    repeat: Infinity,
                                    delay: Math.random() * 3,
                                    ease: 'linear',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
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
                            className="text-5xl leading-tight font-bold tracking-wide text-white sm:text-6xl md:text-7xl lg:text-8xl"
                            style={{
                                fontFamily: 'Playfair Display, serif',
                                textShadow: '3px 6px 12px rgba(0,0,0,0.8), 0 0 20px rgba(212, 175, 55, 0.3)',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                            }}
                        >
                            Cahaya Anbiya
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="mx-auto max-w-4xl px-4 text-lg leading-relaxed font-light text-white sm:text-xl md:text-2xl"
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                textShadow: '2px 4px 8px rgba(0,0,0,0.8), 0 0 15px rgba(255,255,255,0.2)',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
                            }}
                        >
                            Embark on an unforgettable spiritual journey to the Holy Land with premium services and over 15 years of experience
                        </motion.p>

                        {/* Decorative Line */}
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                        />

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1.2 }}
                            className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
                        >
                            <Dialog>
                                <DialogTrigger asChild>
                                    <RippleButton
                                        className="transform rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-amber-600 hover:to-amber-700 hover:shadow-xl"
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                    >
                                        Free Consultation
                                    </RippleButton>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>{consultationSteps[consultationStep].title}</DialogTitle>
                                        <DialogDescription>
                                            Connect with our expert consultants for personalized pilgrimage planning
                                        </DialogDescription>
                                    </DialogHeader>
                                    {consultationSteps[consultationStep].content}
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                    >
                                        View Packages
                                    </motion.button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto border border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                                    <DialogHeader className="pb-6">
                                        <DialogTitle className="mb-3 text-3xl font-bold text-white">✨ Premium Hajj & Umrah Packages</DialogTitle>
                                        <DialogDescription className="text-lg leading-relaxed text-gray-300">
                                            Choose from our carefully curated packages designed to meet your spiritual journey needs
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-6">
                                        {packages.map((pkg) => (
                                            <motion.div
                                                key={pkg.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: pkg.id * 0.1 }}
                                                className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                                                    selectedPackage === pkg.id
                                                        ? 'border-amber-500 bg-gradient-to-r from-amber-900/20 to-orange-900/20'
                                                        : 'border-gray-600 bg-gray-800/50 hover:border-amber-400 hover:bg-gray-800/70'
                                                }`}
                                                onClick={() => setSelectedPackage(selectedPackage === pkg.id ? null : pkg.id)}
                                            >
                                                {/* Package Header */}
                                                <div className="p-6">
                                                    <div className="mb-4 flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="mb-2 flex items-center gap-3">
                                                                <div
                                                                    className={`h-2 w-2 rounded-full ${
                                                                        pkg.id === 1 ? 'bg-amber-400' : pkg.id === 2 ? 'bg-purple-400' : 'bg-blue-400'
                                                                    }`}
                                                                ></div>
                                                                <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                                                            </div>
                                                            <p className="text-gray-300">📅 {pkg.duration}</p>
                                                        </div>
                                                        <div className="ml-4 text-right">
                                                            <div className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white">
                                                                <p className="text-lg font-bold">{pkg.price}</p>
                                                                <p className="text-xs opacity-90">per person</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Package Highlights */}
                                                    <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                                                        <div className="flex items-start gap-2">
                                                            <div className="text-lg">💡</div>
                                                            <p className="text-sm text-amber-200">{pkg.highlights}</p>
                                                        </div>
                                                    </div>

                                                    {/* Expandable Features */}
                                                    {selectedPackage === pkg.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                                            className="border-t border-gray-600 pt-4"
                                                        >
                                                            <div className="mb-4">
                                                                <h4 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                                                                    <span className="text-xl">✅</span>
                                                                    Package Includes:
                                                                </h4>
                                                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                                    {pkg.features.map((feature, index) => (
                                                                        <motion.div
                                                                            key={index}
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ delay: index * 0.05 }}
                                                                            className="flex items-start gap-2 rounded border border-gray-600 bg-gray-700/50 p-2 text-sm"
                                                                        >
                                                                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"></div>
                                                                            <span className="text-gray-300">{feature}</span>
                                                                        </motion.div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {/* Expand/Collapse Indicator */}
                                                    <div className="mt-3 flex justify-center">
                                                        <motion.div
                                                            animate={{ rotate: selectedPackage === pkg.id ? 180 : 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="text-amber-400"
                                                        >
                                                            {selectedPackage === pkg.id ? '▲' : '▼'}
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Custom Package Section */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6"
                                        >
                                            <div className="mb-4 flex items-start gap-3">
                                                <div className="text-2xl">🎯</div>
                                                <div>
                                                    <h3 className="mb-2 text-xl font-bold text-white">Need a Custom Package?</h3>
                                                    <p className="text-sm text-gray-300">
                                                        We can create personalized pilgrimage experiences tailored to your specific needs, budget, and
                                                        travel schedule.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                                                <div className="rounded border border-blue-500/30 bg-blue-500/10 p-3">
                                                    <div className="mb-1 text-lg">📋</div>
                                                    <h4 className="mb-1 text-sm font-semibold text-blue-300">Free Consultation</h4>
                                                    <p className="text-xs text-blue-200">In-depth discussion about your needs</p>
                                                </div>
                                                <div className="rounded border border-blue-500/30 bg-blue-500/10 p-3">
                                                    <div className="mb-1 text-lg">💰</div>
                                                    <h4 className="mb-1 text-sm font-semibold text-blue-300">Custom Pricing</h4>
                                                    <p className="text-xs text-blue-200">Prices adjusted to your budget</p>
                                                </div>
                                                <div className="rounded border border-blue-500/30 bg-blue-500/10 p-3">
                                                    <div className="mb-1 text-lg">⚡</div>
                                                    <h4 className="mb-1 text-sm font-semibold text-blue-300">Fast Process</h4>
                                                    <p className="text-xs text-blue-200">Document preparation and permits</p>
                                                </div>
                                            </div>

                                            <RippleButton className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-bold text-white transition-all duration-300 hover:from-blue-600 hover:to-purple-700">
                                                💬 Request Custom Quote
                                            </RippleButton>
                                        </motion.div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </motion.div>

                        {/* Trust Indicators with Live Counter */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.5 }}
                            className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/80"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            <LiveCounter end={1247} label="Pilgrims Served" delay={1.8} />
                            <div className="flex items-center gap-2 text-sm">
                                <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                                <span>Licensed Tour & Travel</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                                <span>15+ Years Experience</span>
                            </div>
                            <LiveCounter end={98} label="% Customer Satisfaction" delay={2.2} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Live Chat Floating Button */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2.5 }}
                    className="fixed right-6 bottom-6 z-50"
                >
                    <Dialog>
                        <DialogTrigger asChild>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="relative rounded-full bg-gradient-to-r from-green-500 to-green-600 p-4 text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl"
                            >
                                {/* Pulse animation */}
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 rounded-full bg-green-400 opacity-30"
                                />
                                <svg className="relative z-10 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .5-.1.7-.3L16.4 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H16l-4 3v-3H4V4h16v12z" />
                                </svg>
                                {/* Online indicator */}
                                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
                            </motion.button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                                    Live Support Center
                                </DialogTitle>
                                <DialogDescription>
                                    Connect with our expert consultants for immediate assistance with your pilgrimage planning
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487" />
                                        </svg>
                                        <span className="font-semibold text-green-800">WhatsApp Live Chat</span>
                                    </div>
                                    <p className="mb-3 text-sm text-green-700">Get instant responses from our certified pilgrimage consultants</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Response Time:</span>
                                            <span className="font-medium text-green-600">&lt; 2 minutes</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Available:</span>
                                            <span className="font-medium text-green-600">24/7</span>
                                        </div>
                                    </div>
                                    <RippleButton className="mt-3 w-full bg-green-500 text-white hover:bg-green-600">
                                        Start WhatsApp Chat
                                    </RippleButton>
                                </div>

                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                        </svg>
                                        <span className="font-semibold text-blue-800">Direct Phone Line</span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Main Office:</span>
                                            <span className="font-mono">021-1234-5678</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Toll-Free:</span>
                                            <span className="font-mono">0800-1234-5678</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Business Hours:</span>
                                            <span>Mon-Fri: 08:00-17:00</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        <span className="font-semibold text-amber-800">Visit Our Office</span>
                                    </div>
                                    <p className="mb-2 text-sm text-amber-700">Comprehensive face-to-face consultation</p>
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            <strong>Address:</strong> Jl. Sudirman No. 123
                                        </p>
                                        <p>Jakarta Pusat, DKI Jakarta 10220</p>
                                        <p>
                                            <strong>Office Hours:</strong> Mon-Sat: 08:00-17:00
                                        </p>
                                    </div>
                                    <RippleButton className="mt-3 w-full bg-amber-500 text-white hover:bg-amber-600">Schedule Visit</RippleButton>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-3 text-center">
                                    <p className="text-xs text-gray-600">🔒 All consultations are confidential and free of charge</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex h-10 w-6 justify-center rounded-full border-2 border-white/40"
                    >
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mt-2 h-3 w-1 rounded-full bg-white/60"
                        />
                    </motion.div>
                </motion.div>
            </section>

            {/* Packages Dialog from Header */}
            <Dialog open={showPackagesDialog} onOpenChange={setShowPackagesDialog}>
                <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto border border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                    <DialogHeader className="pb-6">
                        <DialogTitle className="mb-3 text-3xl font-bold text-white">✨ Premium Hajj & Umrah Packages</DialogTitle>
                        <DialogDescription className="text-lg leading-relaxed text-gray-300">
                            Choose from our carefully curated packages designed to meet your spiritual journey needs
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {packages.map((pkg) => (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: pkg.id * 0.1 }}
                                className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                                    selectedPackage === pkg.id
                                        ? 'border-amber-500 bg-gradient-to-r from-amber-900/20 to-orange-900/20'
                                        : 'border-gray-600 bg-gray-800/50 hover:border-amber-400 hover:bg-gray-800/70'
                                }`}
                                onClick={() => setSelectedPackage(selectedPackage === pkg.id ? null : pkg.id)}
                            >
                                {/* Package Header */}
                                <div className="p-6">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center gap-3">
                                                <div
                                                    className={`h-2 w-2 rounded-full ${
                                                        pkg.id === 1 ? 'bg-amber-400' : pkg.id === 2 ? 'bg-purple-400' : 'bg-blue-400'
                                                    }`}
                                                ></div>
                                                <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                                            </div>
                                            <p className="text-gray-300">📅 {pkg.duration}</p>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <div className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-white">
                                                <p className="text-lg font-bold">{pkg.price}</p>
                                                <p className="text-xs opacity-90">per person</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Package Highlights */}
                                    <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                                        <div className="flex items-start gap-2">
                                            <div className="text-lg">💡</div>
                                            <p className="text-sm text-amber-200">{pkg.highlights}</p>
                                        </div>
                                    </div>

                                    {/* Expandable Features */}
                                    {selectedPackage === pkg.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                            className="border-t border-gray-600 pt-4"
                                        >
                                            <div className="mb-4">
                                                <h4 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                                                    <span className="text-xl">✅</span>
                                                    Package Includes:
                                                </h4>
                                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                    {pkg.features.map((feature, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="flex items-start gap-2 rounded border border-gray-600 bg-gray-700/50 p-2 text-sm"
                                                        >
                                                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"></div>
                                                            <span className="text-gray-300">{feature}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Expand/Collapse Indicator */}
                                    <div className="mt-3 flex justify-center">
                                        <motion.div
                                            animate={{ rotate: selectedPackage === pkg.id ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-amber-400"
                                        >
                                            {selectedPackage === pkg.id ? '▲' : '▼'}
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Custom Package Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6"
                        >
                            <div className="mb-4 flex items-start gap-3">
                                <div className="text-2xl">🎯</div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-white">Need a Custom Package?</h3>
                                    <p className="text-sm text-gray-300">
                                        We can create personalized pilgrimage experiences tailored to your specific needs, budget, and travel
                                        schedule.
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                                <div className="rounded border border-blue-500/30 bg-blue-500/10 p-3">
                                    <div className="mb-1 text-lg">📋</div>
                                    <h4 className="mb-1 text-sm font-semibold text-blue-300">Free Consultation</h4>
                                    <p className="text-xs text-blue-200">In-depth discussion about your needs</p>
                                </div>
                                <div className="rounded border border-blue-500/30 bg-blue-500/10 p-3">
                                    <div className="mb-1 text-lg">💰</div>
                                    <h4 className="mb-1 text-sm font-semibold text-blue-300">Custom Pricing</h4>
                                    <p className="text-xs text-blue-200">Prices adjusted to your budget</p>
                                </div>
                                <div className="rounded border border-blue-500/30 bg-blue-500/10 p-3">
                                    <div className="mb-1 text-lg">⚡</div>
                                    <h4 className="mb-1 text-sm font-semibold text-blue-300">Fast Process</h4>
                                    <p className="text-xs text-blue-200">Document preparation and permits</p>
                                </div>
                            </div>

                            <RippleButton className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-bold text-white transition-all duration-300 hover:from-blue-600 hover:to-purple-700">
                                💬 Request Custom Quote
                            </RippleButton>
                        </motion.div>
                    </div>
                </DialogContent>
            </Dialog>
        </B2BLayout>
    );
}
