import { EditableText } from '@/components/cms';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RippleButton } from '@/components/ui/ripple-button';
import B2BLayout from '@/layouts/b2b-layout';
import { compressImageForUpload } from '@/utils/cmsImageUpload';
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

const IMAGE_GUIDE = '1920×1080px recommended · Max 5MB · Auto-compressed · JPEG, PNG, WebP';

export default function CahayaAnbiyaHero() {
    const { props } = usePage<{
        sections?: Record<string, { content?: string; image?: string }>;
        cmsMediaGuide?: { images?: { short?: string } };
    }>();
    const imageGuide = props.cmsMediaGuide?.images?.short ?? IMAGE_GUIDE;

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

    // Get packages data from database or use defaults
    const getPackageData = (id: number) => {
        const baseKey = `b2b.packages.${id}`;

        // Read features from individual sections (b2b.packages.{id}.features.{index})
        // Try to find all features by checking sections with pattern b2b.packages.{id}.features.{index}
        let features: string[] = [];
        const defaultFeatures: Record<number, string[]> = {
            1: [
                '5-star hotel accommodation (Makkah & Madinah)',
                'Direct flights with premium airlines',
                'Private transportation throughout',
                'Professional multilingual guide',
                'All meals included (Halal certified)',
                'Zam-zam water supply',
                '24/7 customer support',
                'Comprehensive travel insurance',
            ],
            2: [
                'Luxury 5-star hotels (closest to Haram)',
                'VIP airport transfers',
                'Premium tent accommodation in Mina',
                'Dedicated scholar for spiritual guidance',
                'All rituals assistance included',
                'Premium meal arrangements',
                'Health monitoring service',
                'Exclusive group sizes (max 20 people)',
            ],
            3: [
                '4-star hotel accommodation',
                'Shared transportation',
                'Experienced group leader',
                'Daily breakfast included',
                'Basic travel insurance',
                'Group guidance sessions',
                'Essential amenities provided',
            ],
        };

        // Get features from sections - check up to 20 features per package
        for (let i = 0; i < 20; i++) {
            const featureKey = `${baseKey}.features.${i}`;
            const featureContent = props.sections?.[featureKey]?.content;
            if (featureContent && featureContent.trim()) {
                features.push(featureContent.trim());
            }
        }

        // If no features found in database, use defaults
        if (features.length === 0) {
            features = defaultFeatures[id] || [];
        }

        // Default packages data
        const defaults: Record<
            number,
            {
                name: string;
                duration: string;
                price: string;
                badge: string;
                badgeColor: string;
                features: string[];
                highlights: string;
            }
        > = {
            1: {
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
            2: {
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
            3: {
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
        };

        return {
            id,
            name: props.sections?.[`${baseKey}.name`]?.content || defaults[id]?.name || '',
            duration: props.sections?.[`${baseKey}.duration`]?.content || defaults[id]?.duration || '',
            price: props.sections?.[`${baseKey}.price`]?.content || defaults[id]?.price || '',
            badge: props.sections?.[`${baseKey}.badge`]?.content || defaults[id]?.badge || '',
            badgeColor: defaults[id]?.badgeColor || 'from-amber-500 to-orange-500',
            features: features.length > 0 ? features : defaults[id]?.features || [],
            highlights: props.sections?.[`${baseKey}.highlights`]?.content || defaults[id]?.highlights || '',
        };
    };

    const packages = [1, 2, 3].map((id) => getPackageData(id));

    const consultationSteps = {
        start: {
            title: 'Start Your Journey',
            content: (
                <div className="space-y-3">
                    <div className="rounded-lg border border-[#d4af37]/20 bg-[#d4af37]/5 p-3">
                        <div className="mb-2.5 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-base">
                                ✨
                            </div>
                            <h3 className="text-sm font-bold text-[#1e3a5f]">What You'll Get</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                            {[
                                'Personalized pilgrimage planning',
                                'Budget optimization guidance',
                                'Travel document assistance',
                                'Spiritual preparation resources',
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="flex items-center gap-2 rounded-md border border-[#d4af37]/15 bg-[#d4af37]/8 px-3 py-2 transition-all hover:border-[#d4af37]/30"
                                >
                                    <div className="h-1 w-1 flex-shrink-0 rounded-full bg-[#b8860b]" />
                                    <span className="text-xs font-medium text-[#475569]">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <RippleButton
                            onClick={() => setConsultationStep('whatsapp')}
                            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg border border-green-500/30 bg-gradient-to-br from-green-500 to-emerald-600 p-3 text-white shadow-md transition-all hover:shadow-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <svg className="relative z-10 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487" />
                            </svg>
                            <span className="relative z-10 text-sm font-semibold">WhatsApp Chat</span>
                        </RippleButton>

                        <RippleButton
                            onClick={() => setConsultationStep('phone')}
                            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-500 to-indigo-600 p-3 text-white shadow-md transition-all hover:shadow-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <svg className="relative z-10 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                            <span className="relative z-10 text-sm font-semibold">Phone Call</span>
                        </RippleButton>
                    </div>

                    <RippleButton
                        onClick={() => setConsultationStep('office')}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#c7ddff] bg-[#f8fafc] p-3 text-[#1e3a5f] transition-all hover:border-[#2d4a6f]/30 hover:bg-[#eef6ff]"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span className="text-sm font-semibold">Visit Our Office</span>
                    </RippleButton>
                </div>
            ),
        },
        whatsapp: {
            title: 'WhatsApp Consultation',
            content: (
                <div className="space-y-3">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                        <div className="mb-2.5 flex items-center gap-2">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-green-400 to-emerald-600 text-base">
                                📱
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#1e3a5f]">Instant Support</h3>
                                <p className="text-xs text-emerald-600">Available 24/7</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            {[
                                { label: 'Main Consultant', value: '+62 812-3456-7890' },
                                { label: 'Hajj Specialist', value: '+62 812-3456-7891' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/50 px-3 py-2"
                                >
                                    <span className="text-xs font-medium text-emerald-700">{item.label}</span>
                                    <span className="font-mono text-xs font-semibold text-[#1e3a5f]">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <RippleButton
                        onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                        className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 py-2.5 text-xs font-semibold text-white shadow-md"
                    >
                        Open WhatsApp Chat
                    </RippleButton>
                    <button
                        onClick={() => setConsultationStep('start')}
                        className="w-full py-1.5 text-xs text-[#64748b] transition-colors hover:text-[#1e3a5f]"
                    >
                        ← Back
                    </button>
                </div>
            ),
        },
        phone: {
            title: 'Phone Consultation',
            content: (
                <div className="space-y-3">
                    <div className="rounded-lg border border-[#c7ddff] bg-[#eef6ff] p-3">
                        <div className="mb-2.5 flex items-center gap-2">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#2d4a6f] to-[#3d5a80] text-base text-white">
                                📞
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#1e3a5f]">Direct Line</h3>
                                <p className="text-xs text-[#2d4a6f]">Professional advisors ready</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            {[
                                { label: 'Main Office', value: '021-1234-5678' },
                                { label: 'Toll-Free', value: '0800-1234-5678' },
                                { label: 'Business Hours', value: 'Mon-Fri: 08:00-17:00' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-md border border-[#c7ddff] bg-white px-3 py-2"
                                >
                                    <span className="text-xs font-medium text-[#2d4a6f]">{item.label}</span>
                                    <span className="font-mono text-xs font-semibold text-[#1e3a5f]">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => setConsultationStep('start')}
                        className="w-full py-1.5 text-xs text-[#64748b] transition-colors hover:text-[#1e3a5f]"
                    >
                        ← Back
                    </button>
                </div>
            ),
        },
        office: {
            title: 'Visit Our Office',
            content: (
                <div className="space-y-3">
                    <div className="rounded-lg border border-[#c7ddff] bg-[#f8fafc] p-3">
                        <div className="mb-2.5 flex items-center gap-2">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#475569] to-[#334155] text-base text-white">
                                🏢
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#1e3a5f]">In-Person</h3>
                                <p className="text-xs text-[#64748b]">Face-to-face consultation</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="rounded-md border border-[#c7ddff] bg-white px-3 py-2">
                                <span className="mb-1 block text-[10px] font-medium text-[#64748b]">Address</span>
                                <span className="text-xs leading-relaxed text-[#334155]">
                                    Jl. Sudirman No. 123, Jakarta Pusat
                                    <br />
                                    DKI Jakarta 10220, Indonesia
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-[#c7ddff] bg-white px-3 py-2">
                                <span className="text-xs font-medium text-[#64748b]">Office Hours</span>
                                <span className="text-xs font-semibold text-[#1e3a5f]">Mon-Sat: 08:00-17:00</span>
                            </div>
                        </div>
                    </div>
                    <RippleButton className="w-full rounded-lg bg-gradient-to-r from-[#ff5200] to-[#ff6b35] py-2.5 text-xs font-semibold text-white shadow-md">
                        Schedule Appointment
                    </RippleButton>
                    <button
                        onClick={() => setConsultationStep('start')}
                        className="w-full py-1.5 text-xs text-[#64748b] transition-colors hover:text-[#1e3a5f]"
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

            {/* Hero Section – kombinasi splash/select (putih halus, biru, oranye) */}
            <section className="bg-section-photos-home relative z-[1] flex min-h-screen items-center justify-center overflow-hidden">
                {/* Sentuhan biru & oranye halus */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 left-1/4 h-[480px] w-[560px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(45,74,111,0.1),transparent_60%)] blur-3xl" />
                    <div className="absolute right-1/4 -bottom-20 h-[420px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.08),transparent_60%)] blur-3xl" />
                </div>
                {/* Ambient Floating Elements */}
                <div className="pointer-events-none absolute inset-0">
                    {[
                        { size: 'h-32 w-32', pos: 'top-20 left-12', color: 'bg-[#2d4a6f]/10', duration: 10 },
                        { size: 'h-40 w-40', pos: 'top-40 right-24', color: 'bg-[#ff5200]/8', duration: 12 },
                        { size: 'h-24 w-24', pos: 'bottom-32 left-1/4', color: 'bg-[#d4af37]/6', duration: 8 },
                        { size: 'h-28 w-28', pos: 'bottom-48 right-16', color: 'bg-[#2d4a6f]/8', duration: 14 },
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

                {/* Background Image - overlay ringan agar gradien tetap terlihat */}
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Kaaba and Masjid al-Haram"
                        loading="eager"
                        decoding="async"
                        className="h-full w-full object-cover opacity-40"
                        style={{ imageRendering: 'auto', willChange: 'auto' }}
                    />

                    {/* Replace Image Button + Guide (Edit Mode) */}
                    {editMode && (
                        <div className="absolute top-6 right-6 z-[30] flex flex-col items-end gap-2">
                            <div className="rounded-lg border border-[#2d4a6f]/40 bg-white/90 px-3 py-2 text-xs text-[#1e3a5f] shadow-lg">
                                {imageGuide}
                            </div>
                            <button
                                onClick={() => {
                                    setImageTargetKey('b2b.hero.image');
                                    document.getElementById(hiddenImageInputId)?.click();
                                }}
                                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1e3a5f] shadow-xl ring-2 ring-[#d4af37]/40 transition-all hover:scale-110 hover:shadow-2xl"
                                style={{ willChange: 'transform' }}
                                title="Replace hero image"
                            >
                                <Camera className="h-6 w-6" />
                            </button>
                        </div>
                    )}

                    {/* Overlay halus – biru & oranye selaras tema */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a5f]/20 via-transparent to-[#2d4a6f]/25"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#ff5200]/10"></div>

                    {/* Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute h-1 w-1 rounded-full bg-[#ff5200]/30"
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
                            className="text-5xl leading-[1.1] font-bold tracking-tight text-[#1e3a5f] sm:text-6xl md:text-7xl lg:text-8xl"
                            style={{
                                fontFamily: 'Playfair Display, serif',
                                textShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                letterSpacing: '-0.02em',
                                willChange: 'auto',
                            }}
                        >
                            <EditableText sectionKey="b2b.hero.title" value="Cahaya Anbiya" tag="span" />
                        </motion.h1>

                        {/* Decorative Line */}
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="mx-auto flex h-1.5 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-transparent via-[#ff5200] to-transparent shadow-lg shadow-[#ff5200]/30 sm:w-40"
                        >
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent"
                            />
                        </motion.div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="mx-auto max-w-3xl px-4 text-lg leading-relaxed font-light text-[#475569] sm:text-xl md:text-2xl lg:max-w-4xl"
                            style={{
                                fontFamily: 'Poppins, sans-serif',
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
                                        <RippleButton className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff5200] to-[#ff6b35] px-8 py-5 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl sm:w-auto sm:px-10 sm:py-6 sm:text-xl">
                                            <span className="relative" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                Free Consultation
                                            </span>
                                        </RippleButton>
                                    </motion.div>
                                </DialogTrigger>
                                <DialogContent className="max-h-[85vh] w-[min(480px,calc(100vw-1.5rem))] overflow-y-auto border-2 border-[#d4af37]/30 bg-white shadow-2xl">
                                    <DialogHeader className="border-b border-[#d4af37]/20 pb-4">
                                        <DialogTitle className="text-lg font-bold text-[#1e3a5f]">
                                            {consultationSteps[consultationStep].title}
                                        </DialogTitle>
                                        <DialogDescription className="mt-1 text-sm text-[#64748b]">
                                            Connect with our expert consultants for personalized pilgrimage planning
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="max-h-[calc(85vh-8rem)] overflow-y-auto p-4">{consultationSteps[consultationStep].content}</div>
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -3 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                                    >
                                        <RippleButton className="group relative w-full overflow-hidden rounded-2xl border-2 border-[#2d4a6f]/50 bg-white/90 px-8 py-5 text-lg font-bold text-[#1e3a5f] shadow-xl transition-all duration-300 hover:border-[#2d4a6f] hover:shadow-2xl sm:w-auto sm:px-10 sm:py-6 sm:text-xl">
                                            <span className="relative" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                View Packages
                                            </span>
                                        </RippleButton>
                                    </motion.div>
                                </DialogTrigger>
                                <DialogContent className="max-h-[85vh] w-[min(560px,calc(100vw-1.5rem))] overflow-y-auto border border-[#d4af37]/25 bg-white shadow-2xl">
                                    <DialogHeader className="border-b border-[#d4af37]/15 pb-4">
                                        <DialogTitle className="text-lg font-bold text-[#1e3a5f]">
                                            <EditableText sectionKey="b2b.packages_dialog.title" value="Premium Packages" tag="span" />
                                        </DialogTitle>
                                        <DialogDescription className="mt-1 text-sm text-[#64748b]">
                                            <EditableText
                                                sectionKey="b2b.packages_dialog.description"
                                                value="Choose from our carefully curated packages for your spiritual journey"
                                                tag="span"
                                            />
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="max-h-[calc(85vh-10rem)] space-y-3 overflow-y-auto p-4">
                                        {packages.map((pkg, index) => (
                                            <motion.div
                                                key={pkg.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                                className={`rounded-xl border transition-all duration-200 ${
                                                    selectedPackage === pkg.id
                                                        ? 'border-[#d4af37]/40 bg-[#d4af37]/5 shadow-lg shadow-[#d4af37]/10'
                                                        : 'border-[#c7ddff] bg-[#f8fafc] hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5'
                                                }`}
                                            >
                                                <div className="p-4">
                                                    <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                                                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                                                            <h3 className="text-sm font-bold text-[#1e3a5f] sm:text-base">
                                                                <EditableText
                                                                    sectionKey={`b2b.packages.${pkg.id}.name`}
                                                                    value={pkg.name}
                                                                    tag="span"
                                                                />
                                                            </h3>
                                                            <span
                                                                className={`rounded-full bg-gradient-to-r ${pkg.badgeColor} px-2 py-0.5 text-[10px] font-medium text-white`}
                                                            >
                                                                <EditableText
                                                                    sectionKey={`b2b.packages.${pkg.id}.badge`}
                                                                    value={pkg.badge}
                                                                    tag="span"
                                                                />
                                                            </span>
                                                            <span className="text-xs text-[#64748b]">
                                                                <EditableText
                                                                    sectionKey={`b2b.packages.${pkg.id}.duration`}
                                                                    value={pkg.duration}
                                                                    tag="span"
                                                                />
                                                            </span>
                                                        </div>
                                                        <div className="flex-shrink-0 rounded-md border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1.5 text-right">
                                                            <p className="text-xs font-bold text-[#b8860b]">
                                                                <EditableText
                                                                    sectionKey={`b2b.packages.${pkg.id}.price`}
                                                                    value={pkg.price}
                                                                    tag="span"
                                                                />
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <p className="mb-2.5 line-clamp-2 rounded-md border border-[#ff5200]/15 bg-[#ff5200]/5 px-3 py-2 text-xs leading-relaxed text-[#475569]">
                                                        <EditableText
                                                            sectionKey={`b2b.packages.${pkg.id}.highlights`}
                                                            value={pkg.highlights}
                                                            tag="span"
                                                        />
                                                    </p>

                                                    <button
                                                        onClick={() => setSelectedPackage(selectedPackage === pkg.id ? null : pkg.id)}
                                                        className="mb-2.5 flex w-full items-center justify-between rounded-md border border-[#c7ddff] bg-[#eef6ff] px-3 py-2 text-left transition-colors hover:border-[#2d4a6f]/30 hover:bg-[#2d4a6f]/10"
                                                    >
                                                        <span className="text-xs font-medium text-[#475569]">What's Included</span>
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="rounded bg-[#ff5200]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#ff5200]">
                                                                {pkg.features.length}
                                                            </span>
                                                            <motion.svg
                                                                animate={{ rotate: selectedPackage === pkg.id ? 180 : 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="h-3.5 w-3.5 text-[#64748b]"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 9l-7 7-7-7"
                                                                />
                                                            </motion.svg>
                                                        </span>
                                                    </button>

                                                    {selectedPackage === pkg.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            transition={{ duration: 0.2 }}
                                                            className="mb-2.5 overflow-hidden"
                                                        >
                                                            <div className="grid grid-cols-1 gap-1.5 rounded-md border border-[#c7ddff] bg-[#f8fafc] p-2.5 sm:grid-cols-2">
                                                                {pkg.features.map((feature: string, idx: number) => (
                                                                    <div
                                                                        key={idx}
                                                                        className="flex items-start gap-1.5 rounded bg-white px-2.5 py-1.5 shadow-sm"
                                                                    >
                                                                        <div className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-500" />
                                                                        <span className="text-[11px] leading-snug text-[#475569]">
                                                                            <EditableText
                                                                                sectionKey={`b2b.packages.${pkg.id}.features.${idx}`}
                                                                                value={feature}
                                                                                tag="span"
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    <RippleButton
                                                        onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                                                        className="w-full rounded-lg py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg"
                                                        style={{ background: 'linear-gradient(to right, rgb(34 197 94), rgb(5 150 105))' }}
                                                    >
                                                        Get Quote via WhatsApp
                                                    </RippleButton>
                                                </div>
                                            </motion.div>
                                        ))}

                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex items-center gap-3 rounded-xl border border-[#2d4a6f]/20 bg-[#eef6ff] p-4"
                                        >
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#2d4a6f] to-[#3d5a80] text-lg">
                                                🎯
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-bold text-[#1e3a5f]">Need a Custom Package?</h3>
                                                <p className="line-clamp-2 text-xs text-[#64748b]">
                                                    Tailored experiences for your unique spiritual journey
                                                </p>
                                            </div>
                                            <RippleButton
                                                onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                                                className="flex-shrink-0 rounded-lg bg-gradient-to-r from-[#2d4a6f] to-[#3d5a80] px-4 py-2 text-xs font-semibold text-white"
                                            >
                                                Request Quote
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
                        <DialogContent className="max-h-[85vh] w-[min(520px,calc(100vw-1.5rem))] overflow-y-auto border border-[#d4af37]/25 bg-white shadow-2xl">
                            <DialogHeader className="border-b border-[#d4af37]/15 pb-4">
                                <DialogTitle className="flex items-center gap-2 text-lg font-bold text-[#1e3a5f]">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30"
                                    />
                                    <EditableText sectionKey="b2b.live_support.title" value="Live Support Center" tag="span" />
                                </DialogTitle>
                                <DialogDescription className="mt-1 text-sm text-[#64748b]">
                                    <EditableText
                                        sectionKey="b2b.live_support.description"
                                        value="Connect instantly with our expert consultants"
                                        tag="span"
                                    />
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3 p-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                                        className="rounded-lg border border-emerald-200 bg-emerald-50 p-3"
                                    >
                                        <div className="mb-2.5 flex items-center gap-2">
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 text-base">
                                                📱
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-bold text-[#1e3a5f]">
                                                    <EditableText sectionKey="b2b.live_support.whatsapp.title" value="WhatsApp" tag="span" />
                                                </h3>
                                                <p className="text-xs text-emerald-600">
                                                    <EditableText
                                                        sectionKey="b2b.live_support.whatsapp.subtitle"
                                                        value="Instant response"
                                                        tag="span"
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mb-2.5 flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/50 px-3 py-2">
                                            <span className="text-xs font-medium text-emerald-700">Response Time</span>
                                            <span className="text-xs font-semibold text-emerald-600">
                                                <EditableText sectionKey="b2b.live_support.whatsapp.response_time" value="< 2 min" tag="span" />
                                            </span>
                                        </div>
                                        <RippleButton
                                            onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                                            className="w-full rounded-lg py-2.5 text-xs font-semibold text-white shadow-md"
                                            style={{ background: 'linear-gradient(to right, rgb(34 197 94), rgb(5 150 105))' }}
                                        >
                                            <EditableText sectionKey="b2b.live_support.whatsapp.button" value="Start Chat" tag="span" />
                                        </RippleButton>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                                        className="rounded-lg border border-[#c7ddff] bg-[#eef6ff] p-3"
                                    >
                                        <div className="mb-2.5 flex items-center gap-2">
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#2d4a6f] to-[#3d5a80] text-base text-white">
                                                📞
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-bold text-[#1e3a5f]">
                                                    <EditableText sectionKey="b2b.live_support.phone.title" value="Phone" tag="span" />
                                                </h3>
                                                <p className="text-xs text-[#2d4a6f]">
                                                    <EditableText sectionKey="b2b.live_support.phone.subtitle" value="Direct line" tag="span" />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between rounded-md border border-[#c7ddff] bg-white px-3 py-2">
                                                <span className="text-xs font-medium text-[#2d4a6f]">
                                                    <EditableText sectionKey="b2b.live_support.phone.main_label" value="Main Office" tag="span" />
                                                </span>
                                                <span className="font-mono text-xs font-semibold text-[#1e3a5f]">
                                                    <EditableText sectionKey="b2b.live_support.phone.main_number" value="021-1234-5678" tag="span" />
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between rounded-md border border-[#c7ddff] bg-white px-3 py-2">
                                                <span className="text-xs font-medium text-[#2d4a6f]">Hours</span>
                                                <span className="text-xs font-semibold text-[#1e3a5f]">
                                                    <EditableText sectionKey="b2b.live_support.phone.hours" value="Mon-Fri: 08:00-17:00" tag="span" />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.18 }}
                                    className="rounded-lg border border-[#c7ddff] bg-[#f8fafc] px-3 py-2.5 text-center"
                                >
                                    <div className="mb-1 flex items-center justify-center gap-2">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="h-2 w-2 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30"
                                        />
                                        <span className="text-xs font-semibold text-emerald-600">
                                            <EditableText sectionKey="b2b.live_support.status" value="Live Support Active" tag="span" />
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#64748b]">
                                        <EditableText
                                            sectionKey="b2b.live_support.footer"
                                            value="All consultations are confidential and free"
                                            tag="span"
                                        />
                                    </p>
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
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !imageTargetKey) return;

                        const previewUrl = URL.createObjectURL(file);
                        setHeroImage(previewUrl);
                        markDirty();

                        try {
                            const compressed = await compressImageForUpload(file);
                            const form = new FormData();
                            form.append('key', imageTargetKey);
                            form.append('image', compressed);
                            const response = await axios.post('/admin/upload-image', form, {
                                headers: { Accept: 'application/json' },
                            });

                            const ok = response.data?.status === 'ok' || response.data?.success;
                            const url = response.data?.url || response.data?.imageUrl;
                            if (ok && url) {
                                URL.revokeObjectURL(previewUrl);
                                setHeroImage(url);

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
                        } catch (error: unknown) {
                            console.error('Image upload failed:', error);
                            URL.revokeObjectURL(previewUrl);
                            const originalImage = props.sections?.['b2b.hero.image']?.image || '/b2b.jpeg';
                            setHeroImage(originalImage);
                            const ax =
                                error && typeof error === 'object' && 'response' in error
                                    ? (error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
                                    : null;
                            const data = ax?.response?.data;
                            let msg = data?.message || (error instanceof Error ? error.message : 'Failed to upload image');
                            if (data?.errors && typeof data.errors === 'object') {
                                const flat = Object.values(data.errors).flat().filter(Boolean);
                                if (flat.length) msg = flat.join('. ');
                            }
                            alert(msg);
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
