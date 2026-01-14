import { EditableText } from '@/components/cms';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RippleButton } from '@/components/ui/ripple-button';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
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
        const duration = 2000;

        const animate = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(end * easeOutCubic));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [started, end]);

    return (
        <div className="flex items-center gap-2 text-center sm:text-left">
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"></div>
            <span className="text-sm text-white/90 sm:text-base">
                <motion.span
                    className="font-bold text-amber-400"
                    key={count}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
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
    const { props } = usePage<{ sections?: Record<string, { content?: string; image?: string }> }>();

    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [consultationStep, setConsultationStep] = useState<'start' | 'whatsapp' | 'phone' | 'office'>('start');

    const [editMode, setEditMode] = useState<boolean>(false);
    const [heroImage, setHeroImage] = useState('/b2b.jpeg');
    const [imageTargetKey, setImageTargetKey] = useState<string | null>(null);
    const hiddenImageInputId = 'b2b-image-replacer';

    useEffect(() => {
        const dbImage = props.sections?.['b2b.hero.image']?.image;
        if (dbImage && typeof dbImage === 'string' && dbImage.trim()) {
            setHeroImage(dbImage);
        } else {
            setHeroImage('/b2b.jpeg');
        }
    }, [props.sections]);

    useEffect(() => {
        const check = () => setEditMode(document.documentElement.classList.contains('cms-edit'));
        check();
        const handler = () => check();
        window.addEventListener('cms:mode', handler as EventListener);
        return () => window.removeEventListener('cms:mode', handler as EventListener);
    }, []);

    const markDirty = () => {
        window.dispatchEvent(new CustomEvent('cms:mark-dirty'));
    };

    const clearDirty = () => {
        window.dispatchEvent(new CustomEvent('cms:clear-dirty'));
    };

    const packages = [
        {
            id: 1,
            name: 'Premium Umrah Package',
            duration: '9 Days 8 Nights',
            price: 'Starting from Rp 28,500,000',
            badge: 'Most Popular',
            badgeColor: 'from-amber-500 to-orange-500',
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
            badge: 'Premium',
            badgeColor: 'from-purple-500 to-pink-500',
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
            badge: 'Best Value',
            badgeColor: 'from-blue-500 to-cyan-500',
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
            title: 'Start Your Journey',
            content: (
                <div className="space-y-6">
                    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 via-amber-900/30 to-orange-950/40 p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-2xl shadow-lg">
                                ✨
                            </div>
                            <h3 className="text-xl font-bold text-white">What You'll Get</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                                'Personalized pilgrimage planning',
                                'Budget optimization guidance',
                                'Travel document assistance',
                                'Spiritual preparation resources',
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 transition-all hover:border-amber-400/40 hover:bg-amber-500/20"
                                >
                                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"></div>
                                    <span className="text-sm font-medium text-amber-100">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <RippleButton
                            onClick={() => setConsultationStep('whatsapp')}
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-5 text-white shadow-xl shadow-green-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                            <div className="relative flex items-center gap-3">
                                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487" />
                                </svg>
                                <span className="font-semibold">WhatsApp Chat</span>
                            </div>
                        </RippleButton>

                        <RippleButton
                            onClick={() => setConsultationStep('phone')}
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                            <div className="relative flex items-center gap-3">
                                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                </svg>
                                <span className="font-semibold">Phone Call</span>
                            </div>
                        </RippleButton>
                    </div>

                    <RippleButton
                        onClick={() => setConsultationStep('office')}
                        className="group relative w-full overflow-hidden rounded-xl border border-gray-600 bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-gray-500 hover:shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                        <div className="relative flex items-center gap-3">
                            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <span className="font-semibold">Visit Our Office</span>
                        </div>
                    </RippleButton>
                </div>
            ),
        },
        whatsapp: {
            title: 'WhatsApp Consultation',
            content: (
                <div className="space-y-4">
                    <div className="rounded-lg border border-green-500/20 bg-gradient-to-br from-green-950/40 via-emerald-900/30 to-green-950/40 p-4 sm:p-5">
                        <div className="mb-3 flex items-center gap-2.5 sm:mb-4 sm:gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 text-lg shadow-md sm:h-12 sm:w-12 sm:text-xl">
                                📱
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-white sm:text-base lg:text-lg">Instant Support</h3>
                                <p className="text-xs text-green-200/80 sm:text-sm">Available 24/7</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {[
                                { label: 'Main Consultant', value: '+62 812-3456-7890' },
                                { label: 'Hajj Specialist', value: '+62 812-3456-7891' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-md border border-green-500/20 bg-green-500/10 p-2.5 sm:p-3"
                                >
                                    <span className="text-xs font-medium text-green-300 sm:text-sm">{item.label}</span>
                                    <span className="font-mono text-xs font-semibold text-green-100 sm:text-sm">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <RippleButton
                        onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                        className="w-full rounded-md bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md sm:py-3 sm:text-sm"
                    >
                        Open WhatsApp Chat
                    </RippleButton>
                    <button
                        onClick={() => setConsultationStep('start')}
                        className="w-full text-xs text-gray-400 transition-colors hover:text-gray-200 sm:text-sm"
                    >
                        ← Back
                    </button>
                </div>
            ),
        },
        phone: {
            title: 'Phone Consultation',
            content: (
                <div className="space-y-4">
                    <div className="rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-950/40 via-indigo-900/30 to-blue-950/40 p-4 sm:p-5">
                        <div className="mb-3 flex items-center gap-2.5 sm:mb-4 sm:gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 text-lg shadow-md sm:h-12 sm:w-12 sm:text-xl">
                                📞
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-white sm:text-base lg:text-lg">Direct Line</h3>
                                <p className="text-xs text-blue-200/80 sm:text-sm">Professional advisors ready</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {[
                                { label: 'Main Office', value: '021-1234-5678' },
                                { label: 'Toll-Free', value: '0800-1234-5678' },
                                { label: 'Business Hours', value: 'Mon-Fri: 08:00-17:00' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-md border border-blue-500/20 bg-blue-500/10 p-2.5 sm:p-3"
                                >
                                    <span className="text-xs font-medium text-blue-300 sm:text-sm">{item.label}</span>
                                    <span className="font-mono text-xs font-semibold text-blue-100 sm:text-sm">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => setConsultationStep('start')}
                        className="w-full text-xs text-gray-400 transition-colors hover:text-gray-200 sm:text-sm"
                    >
                        ← Back
                    </button>
                </div>
            ),
        },
        office: {
            title: 'Visit Our Office',
            content: (
                <div className="space-y-4">
                    <div className="rounded-lg border border-gray-500/20 bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-900/40 p-4 sm:p-5">
                        <div className="mb-3 flex items-center gap-2.5 sm:mb-4 sm:gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 text-lg shadow-md sm:h-12 sm:w-12 sm:text-xl">
                                🏢
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-white sm:text-base lg:text-lg">In-Person</h3>
                                <p className="text-xs text-gray-300/80 sm:text-sm">Face-to-face consultation</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="rounded-md border border-gray-500/20 bg-gray-700/30 p-2.5 sm:p-3">
                                <span className="mb-1.5 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">Address</span>
                                <span className="text-xs leading-relaxed text-gray-100 sm:text-sm">
                                    Jl. Sudirman No. 123, Jakarta Pusat
                                    <br />
                                    DKI Jakarta 10220, Indonesia
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-gray-500/20 bg-gray-700/30 p-2.5 sm:p-3">
                                <span className="text-xs font-medium text-gray-300 sm:text-sm">Office Hours</span>
                                <span className="text-xs font-semibold text-gray-100 sm:text-sm">Mon-Sat: 08:00-17:00</span>
                            </div>
                        </div>
                    </div>
                    <RippleButton className="w-full rounded-md bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md sm:py-3 sm:text-sm">
                        Schedule Appointment
                    </RippleButton>
                    <button
                        onClick={() => setConsultationStep('start')}
                        className="w-full text-xs text-gray-400 transition-colors hover:text-gray-200 sm:text-sm"
                    >
                        ← Back
                    </button>
                </div>
            ),
        },
    };

    return (
        <B2BLayout>
            <Head title="Cahaya Anbiya - Premium Hajj & Umrah Services" />

            {/* Hero Section - Premium Design */}
            <section className="relative z-[1] flex min-h-screen items-center justify-center overflow-hidden bg-black">
                {/* Ambient Floating Elements */}
                <div className="pointer-events-none absolute inset-0">
                    {[
                        { size: 'h-32 w-32', pos: 'top-20 left-12', color: 'bg-amber-400/8', duration: 10 },
                        { size: 'h-40 w-40', pos: 'top-40 right-24', color: 'bg-amber-300/6', duration: 12 },
                        { size: 'h-24 w-24', pos: 'bottom-32 left-1/4', color: 'bg-white/4', duration: 8 },
                        { size: 'h-28 w-28', pos: 'bottom-48 right-16', color: 'bg-amber-200/5', duration: 14 },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                x: [0, 40, -20, 0],
                                y: [0, -30, 20, 0],
                                scale: [1, 1.1, 0.9, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: item.duration,
                                repeat: Infinity,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className={`absolute ${item.pos} ${item.size} ${item.color} rounded-full blur-2xl`}
                            style={{ willChange: 'auto' }}
                        />
                    ))}
                </div>

                {/* Background Image */}
                <div className="absolute inset-0">
                    <img src={heroImage} alt="Kaaba and Masjid al-Haram" loading="eager" decoding="async" className="h-full w-full object-cover" style={{ imageRendering: 'auto', willChange: 'auto' }} />

                    {/* Replace Image Button */}
                    {editMode && (
                        <button
                            onClick={() => {
                                setImageTargetKey('b2b.hero.image');
                                document.getElementById(hiddenImageInputId)?.click();
                            }}
                            className="absolute top-6 right-6 z-[30] flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 text-gray-800 shadow-2xl ring-4 ring-white/20 transition-all hover:scale-110 hover:bg-white hover:shadow-amber-500/20"
                            style={{ willChange: 'transform' }}
                            title="Replace hero image"
                        >
                            <Camera className="h-6 w-6" />
                        </button>
                    )}

                    {/* Premium Overlay System */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-950/30 via-transparent to-orange-950/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Elegant Particles - Optimized */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute h-1 w-1 rounded-full bg-amber-300/30"
                                initial={{
                                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                                    opacity: 0,
                                }}
                                animate={{
                                    y: [null, -120],
                                    opacity: [0, 0.6, 0],
                                }}
                                transition={{
                                    duration: Math.random() * 10 + 6,
                                    repeat: Infinity,
                                    delay: Math.random() * 4,
                                    ease: 'linear',
                                }}
                                style={{ willChange: 'auto' }}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Container - Optimized Spacing */}
                <div className="relative z-[2] mx-auto w-full max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-8 sm:space-y-10"
                        style={{ willChange: 'auto' }}
                    >
                        {/* Main Title - Better Typography */}
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="text-5xl leading-[1.1] font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
                            style={{
                                fontFamily: 'Playfair Display, serif',
                                textShadow: '4px 8px 16px rgba(0,0,0,0.9), 0 0 30px rgba(251, 191, 36, 0.3)',
                                letterSpacing: '-0.02em',
                                willChange: 'auto',
                            }}
                        >
                            <EditableText sectionKey="b2b.hero.title" value="Cahaya Anbiya" tag="span" />
                        </motion.h1>

                        {/* Decorative Line - Enhanced */}
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="mx-auto flex h-1.5 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-lg shadow-amber-400/50 sm:w-40"
                        >
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent"
                            />
                        </motion.div>

                        {/* Subtitle - Better Readability */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="mx-auto max-w-3xl px-4 text-lg leading-relaxed font-light text-white/95 sm:text-xl md:text-2xl lg:max-w-4xl"
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                textShadow: '3px 6px 12px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.15)',
                                letterSpacing: '0.01em',
                                willChange: 'auto',
                            }}
                        >
                            <EditableText
                                sectionKey="b2b.hero.subtitle"
                                value="Embark on an unforgettable spiritual journey to the Holy Land with premium services and over 15 years of experience"
                                tag="span"
                            />
                        </motion.p>

                        {/* CTA Buttons - Enhanced Design */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row sm:gap-5 sm:pt-6"
                        >
                            <Dialog>
                                <DialogTrigger asChild>
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -3 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                                        data-consultation-trigger
                                    >
                                        <RippleButton className="group hover:shadow-3xl relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 px-8 py-5 text-lg font-bold text-white shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:shadow-amber-500/40 sm:w-auto sm:px-10 sm:py-6 sm:text-xl">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                            <span className="relative" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                Free Consultation
                                            </span>
                                        </RippleButton>
                                    </motion.div>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] w-[calc(100vw-0.5rem)] max-w-2xl overflow-y-auto border border-gray-800/50 bg-gray-950/95 sm:w-[calc(100vw-2rem)]">
                                    <DialogHeader className="border-b border-gray-800/50 pb-4 sm:pb-5">
                                        <DialogTitle className="text-lg font-semibold text-white sm:text-xl">
                                            {consultationSteps[consultationStep].title}
                                        </DialogTitle>
                                        <DialogDescription className="mt-1 text-xs text-gray-400 sm:text-sm">
                                            Connect with our expert consultants for personalized pilgrimage planning
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="p-5 sm:p-6 lg:p-8">{consultationSteps[consultationStep].content}</div>
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -3 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                                    >
                                        <RippleButton className="group relative w-full overflow-hidden rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-5 text-lg font-bold text-white shadow-2xl shadow-white/5 transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 sm:w-auto sm:px-10 sm:py-6 sm:text-xl">
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                            <span className="relative" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                View Packages
                                            </span>
                                        </RippleButton>
                                    </motion.div>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] w-[calc(100vw-0.5rem)] max-w-6xl overflow-y-auto border border-gray-800/50 bg-gray-950/95 sm:w-[calc(100vw-2rem)]">
                                    <DialogHeader className="border-b border-gray-800/50 pb-4 sm:pb-5">
                                        <DialogTitle className="text-lg font-semibold text-white sm:text-xl">Premium Packages</DialogTitle>
                                        <DialogDescription className="mt-1 text-xs text-gray-400 sm:text-sm">
                                            Choose from our carefully curated packages for your spiritual journey
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 p-5 sm:space-y-5 sm:p-6 lg:p-8">
                                        {packages.map((pkg, index) => (
                                            <motion.div
                                                key={pkg.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                                className={`rounded-lg border transition-all duration-200 ${
                                                    selectedPackage === pkg.id
                                                        ? 'border-amber-500/30 bg-gray-900/50'
                                                        : 'border-gray-800/50 bg-gray-900/30 hover:border-gray-700/50 hover:bg-gray-900/40'
                                                }`}
                                            >
                                                <div className="p-5 sm:p-6">
                                                    {/* Header Row - Improved Layout */}
                                                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                                <h3 className="text-sm font-semibold text-white sm:text-base lg:text-lg">
                                                                    {pkg.name}
                                                                </h3>
                                                                <div
                                                                    className={`rounded-full bg-gradient-to-r ${pkg.badgeColor} px-2 py-0.5 text-[9px] font-medium text-white sm:text-[10px]`}
                                                    >
                                                        {pkg.badge}
                                                    </div>
                                                </div>
                                                            <p className="text-xs text-gray-400 sm:text-sm">📅 {pkg.duration}</p>
                                                        </div>
                                                        <div className="flex-shrink-0 rounded-md bg-gradient-to-br from-amber-500/90 to-orange-600/90 px-4 py-2.5 text-center shadow-sm sm:px-5 sm:py-3">
                                                            <p className="text-xs font-semibold text-white sm:text-sm lg:text-base">{pkg.price}</p>
                                                            <p className="text-[9px] text-white/80 sm:text-[10px]">per person</p>
                                                        </div>
                                                    </div>

                                                    {/* Highlights - More Compact */}
                                                    <div className="mb-4 rounded-md border border-amber-500/15 bg-amber-500/5 p-2.5 sm:p-3">
                                                        <p className="text-xs leading-relaxed text-amber-200/80 sm:text-sm">{pkg.highlights}</p>
                                                        </div>

                                                    {/* Features Toggle - Better Spacing */}
                                                    <button
                                                        onClick={() => setSelectedPackage(selectedPackage === pkg.id ? null : pkg.id)}
                                                        className="mb-3 flex w-full items-center justify-between rounded-md border border-gray-800/50 bg-gray-800/30 px-3 py-2.5 text-left transition-colors hover:border-gray-700/50 hover:bg-gray-800/40 sm:px-4"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-medium text-gray-300 sm:text-sm">What's Included</span>
                                                            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-medium text-amber-300 sm:text-[10px]">
                                                                {pkg.features.length}
                                                            </span>
                                                    </div>
                                                        <motion.svg
                                                            animate={{ rotate: selectedPackage === pkg.id ? 180 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="h-4 w-4 flex-shrink-0 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </motion.svg>
                                                    </button>

                                                    {/* Features List - Better Grid */}
                                                    {selectedPackage === pkg.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.25 }}
                                                            className="mb-4 overflow-hidden"
                                                        >
                                                            <div className="grid grid-cols-1 gap-2.5 rounded-md border border-gray-800/50 bg-gray-800/20 p-3 sm:grid-cols-2 lg:grid-cols-3">
                                                                {pkg.features.map((feature, idx) => (
                                                                    <div key={idx} className="flex items-start gap-2 rounded-sm bg-gray-900/40 p-2.5">
                                                                        <div className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-green-400"></div>
                                                                        <span className="text-xs leading-relaxed text-gray-300">{feature}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {/* CTA Button */}
                                                    <RippleButton
                                                        onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                                                        className="w-full rounded-md bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md sm:py-3 sm:text-sm"
                                                    >
                                                        Get Quote via WhatsApp
                                                    </RippleButton>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Custom Package - Improved */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-950/20 to-indigo-950/20 p-5 sm:p-6"
                                        >
                                            <div className="mb-4 flex items-start gap-3">
                                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-lg shadow-sm sm:h-10 sm:w-10 sm:text-xl">
                                                    🎯
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="mb-1 text-sm font-semibold text-white sm:text-base lg:text-lg">
                                                        Need a Custom Package?
                                                    </h3>
                                                    <p className="text-xs leading-relaxed text-gray-400 sm:text-sm">
                                                        Tailored experiences for your unique spiritual journey
                                                    </p>
                                                </div>
                                            </div>

                                            <RippleButton
                                                onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                                                className="w-full rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md sm:py-3 sm:text-sm"
                                            >
                                                Request Custom Quote
                                            </RippleButton>
                                        </motion.div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </motion.div>

                        {/* Trust Indicators - Refined */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-wrap items-center justify-center gap-5 pt-8 sm:gap-8 sm:pt-10"
                            style={{ fontFamily: 'Poppins, sans-serif', willChange: 'auto' }}
                        >
                            <LiveCounter end={1247} label="Pilgrims Served" delay={1.3} />
                            <div className="flex items-center gap-2.5">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"></div>
                                <span className="text-sm text-white/90 sm:text-base">
                                    <EditableText sectionKey="b2b.hero.badge1" value="Licensed Tour & Travel" tag="span" />
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"></div>
                                <span className="text-sm text-white/90 sm:text-base">
                                    <EditableText sectionKey="b2b.hero.badge2" value="15+ Years Experience" tag="span" />
                                </span>
                            </div>
                            <LiveCounter end={98} label="% Customer Satisfaction" delay={1.6} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Live Chat Button - Optimized for Mobile */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 2, ease: [0.34, 1.56, 0.64, 1] }}
                    className="fixed right-4 bottom-20 z-50 sm:right-6 sm:bottom-6"
                >
                    <Dialog>
                        <DialogTrigger asChild>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3.5 text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/40 sm:rounded-2xl sm:p-4"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                    className="absolute inset-0 rounded-xl bg-green-400 opacity-20 sm:rounded-2xl"
                                />
                                <svg className="relative z-10 h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .5-.1.7-.3L16.4 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H16l-4 3v-3H4V4h16v12z" />
                                </svg>
                                <div className="absolute -top-1 -right-1 h-2.5 w-2.5 animate-pulse rounded-full border border-white bg-green-400 shadow-md sm:h-3 sm:w-3"></div>
                            </motion.button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] w-[calc(100vw-0.5rem)] max-w-3xl overflow-y-auto border border-gray-800/50 bg-gray-950/95 sm:w-[calc(100vw-2rem)]">
                            <DialogHeader className="border-b border-gray-800/50 pb-4 sm:pb-5">
                                <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-white sm:gap-3 sm:text-xl">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-md shadow-green-400/50 sm:h-3 sm:w-3"
                                    />
                                    Live Support Center
                                </DialogTitle>
                                <DialogDescription className="mt-1 text-xs text-gray-400 sm:text-sm">
                                    Connect instantly with our expert consultants
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 p-5 sm:space-y-5 sm:p-6 lg:p-8">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                                {/* WhatsApp */}
                                <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                                        className="rounded-lg border border-green-500/20 bg-gradient-to-br from-green-950/40 to-emerald-950/40 p-4 sm:p-5"
                                >
                                        <div className="mb-3 flex items-center gap-2.5 sm:mb-4 sm:gap-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 text-lg shadow-md sm:h-12 sm:w-12 sm:text-xl">
                                            📱
                                        </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-semibold text-white sm:text-base lg:text-lg">WhatsApp</h3>
                                                <p className="text-xs text-green-200/80 sm:text-sm">Instant response</p>
                                        </div>
                                    </div>
                                        <div className="mb-3 space-y-2 sm:mb-4">
                                            <div className="flex items-center justify-between rounded-md border border-green-500/20 bg-green-500/10 p-2.5 sm:p-3">
                                                <span className="text-xs font-medium text-green-300 sm:text-sm">Response Time</span>
                                                <span className="text-xs font-semibold text-green-400 sm:text-sm">&lt; 2 min</span>
                                        </div>
                                    </div>
                                    <RippleButton
                                        onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                                            className="w-full rounded-md bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md sm:py-3 sm:text-sm"
                                    >
                                        Start Chat
                                    </RippleButton>
                                </motion.div>

                                {/* Phone */}
                                <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                        className="rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-indigo-950/40 p-4 sm:p-5"
                                >
                                        <div className="mb-3 flex items-center gap-2.5 sm:mb-4 sm:gap-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 text-lg shadow-md sm:h-12 sm:w-12 sm:text-xl">
                                            📞
                                        </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-semibold text-white sm:text-base lg:text-lg">Phone</h3>
                                                <p className="text-xs text-blue-200/80 sm:text-sm">Direct line</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                            <div className="rounded-md border border-blue-500/20 bg-blue-500/10 p-2.5 sm:p-3">
                                            <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-blue-300 sm:text-sm">Main Office</span>
                                                    <span className="font-mono text-xs text-blue-100 sm:text-sm">021-1234-5678</span>
                                            </div>
                                        </div>
                                            <div className="rounded-md border border-blue-500/20 bg-blue-500/10 p-2.5 sm:p-3">
                                            <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-blue-300 sm:text-sm">Hours</span>
                                                    <span className="text-xs text-blue-100 sm:text-sm">Mon-Fri: 08:00-17:00</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Status */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="rounded-lg border border-gray-800/50 bg-gray-800/30 p-3 text-center sm:p-4"
                            >
                                    <div className="mb-1.5 flex items-center justify-center gap-2 sm:mb-2">
                                    <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                            className="h-2 w-2 rounded-full bg-green-400 shadow-md shadow-green-400/50 sm:h-2.5 sm:w-2.5"
                                    />
                                        <span className="text-xs font-semibold text-green-400 sm:text-sm">Live Support Active</span>
                                </div>
                                    <p className="text-xs text-gray-400 sm:text-sm">🔒 All consultations are confidential and free</p>
                            </motion.div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </motion.div>
            </section>

            {/* Hidden Image Input */}
            {editMode && (
                <input
                    id={hiddenImageInputId}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !imageTargetKey) return;

                        const previewUrl = URL.createObjectURL(file);
                        setHeroImage(previewUrl);
                        markDirty();

                        try {
                            const form = new FormData();
                            form.append('key', imageTargetKey);
                            form.append('image', file);
                            const response = await axios.post('/admin/upload-image', form, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            });

                            if (response.data?.success && response.data?.imageUrl) {
                                URL.revokeObjectURL(previewUrl);
                                setHeroImage(response.data.imageUrl);

                                const notification = document.createElement('div');
                                notification.className =
                                    'fixed top-20 left-1/2 -translate-x-1/2 z-[99999] rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white shadow-2xl max-w-[90vw] sm:max-w-md border border-white/20';
                                notification.innerHTML = `
                                    <div class="flex items-center gap-3">
                                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <div class="font-bold">Image Updated!</div>
                                            <div class="text-sm opacity-90">Hero image saved successfully</div>
                                        </div>
                                    </div>
                                `;
                                document.body.appendChild(notification);
                                setTimeout(() => notification.remove(), 3000);

                                clearDirty();
                                router.reload({ only: ['sections'] });
                            }
                        } catch (error) {
                            console.error('Image upload failed:', error);
                            URL.revokeObjectURL(previewUrl);
                            const originalImage = props.sections?.['b2b.hero.image']?.image || '/b2b.jpeg';
                            setHeroImage(originalImage);
                            alert('Failed to upload image. Please try again.');
                        } finally {
                            setImageTargetKey(null);
                            (e.target as HTMLInputElement).value = '';
                        }
                    }}
                />
            )}
        </B2BLayout>
    );
}
