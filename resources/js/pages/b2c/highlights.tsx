import { ImageCropModal } from '@/components/cms';
import PlaceholderImage from '@/components/media/placeholder-image';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { compressImageForUpload } from '@/utils/cmsImageUpload';
import { getImageUrl } from '@/utils/imageHelper';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Edit3, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const IMAGE_GUIDE = '1920×1080px recommended · Max 5MB · Auto-compressed · JPEG, PNG, WebP';

const highlights = [
    {
        id: 1,
        title: 'Spiritual Journey to the Holy Land',
        subtitle: 'Umrah & Hajj Experiences',
        description:
            'Experience the profound spiritual journey to Makkah and Madinah. Our Umrah and Hajj packages provide complete guidance, luxury accommodations, and authentic spiritual experiences that connect you with the sacred traditions of Islam.',
        image: '/umrah.jpeg',
        category: 'Spiritual',
        features: [
            'Professional spiritual guidance',
            '5-star hotel accommodations',
            'Direct flights from Indonesia',
            'VIP access to holy sites',
            'Comprehensive travel insurance',
            'Daily spiritual programs',
        ],
        stats: { travelers: '5000+', satisfaction: '98%', experience: '15+ years' },
        badge: 'Featured',
    },
    {
        id: 2,
        title: 'Cultural Heritage of Turkey',
        subtitle: 'Istanbul to Cappadocia Adventure',
        description:
            "Discover the perfect blend of East and West in Turkey. From the magnificent Hagia Sophia and Blue Mosque in Istanbul to the magical hot air balloon rides over Cappadocia's fairy chimneys.",
        image: '/TURKEY.jpeg',
        category: 'Cultural',
        features: [
            'Hot air balloon experience',
            'Historical site guided tours',
            'Traditional Turkish bath',
            'Bosphorus cruise',
            'Local cuisine tasting',
            'Cultural workshops',
        ],
        stats: { travelers: '3200+', satisfaction: '96%', experience: '12+ years' },
        badge: 'Popular',
    },
    {
        id: 3,
        title: 'Mesir - Pyramid',
        subtitle: 'Pyramids of Giza & Ancient Wonders',
        description:
            'Jelajahi keajaiban Mesir kuno dengan melihat langsung Piramida Giza yang megah. Perjalanan spiritual dan sejarah yang mengesankan ke salah satu keajaiban dunia.',
        image: 'Destination Cahaya 2.jpeg',
        category: 'Historical',
        features: [
            'Kunjungan ke Piramida Giza',
            'Pemandu profesional berbahasa Indonesia',
            'Akomodasi hotel bintang 5',
            'Tur ke situs-situs bersejarah',
            'Pengalaman budaya Mesir kuno',
            'Fasilitas lengkap dari Cahaya Anbiya',
        ],
        stats: { travelers: '2800+', satisfaction: '95%', experience: '10+ years' },
        badge: 'Heritage',
    },
    {
        id: 4,
        title: 'Jordan - Petra & Wadi Rum',
        subtitle: 'Petra, Wadi Rum & Ashabul Kahfi',
        description:
            'Perjalanan spiritual dan petualangan ke Yordania. Lihat langsung 7 keajaiban dunia di Petra, nikmati jeep tour di Lembah Wadi Rum, dan kunjungi Goa Ashabul Kahfi yang bersejarah.',
        image: 'Destination Cahaya 4.jpeg',
        category: 'Historical',
        features: [
            'Kunjungan ke Petra - 7 keajaiban dunia',
            'Jeep tour di Lembah Wadi Rum (fasilitas gratis dari Cahaya Anbiya)',
            'Kunjungan ke Goa Ashabul Kahfi',
            'Pemandu profesional berbahasa Indonesia',
            'Akomodasi hotel bintang 5',
            'Pengalaman Bedouin tradisional',
        ],
        stats: { travelers: '2500+', satisfaction: '97%', experience: '12+ years' },
        badge: 'Adventure',
    },
    {
        id: 5,
        title: 'Aqsa & Palestine',
        subtitle: 'Al-Aqsa, Bukit Zaitun & Jericho',
        description:
            'Perjalanan spiritual ke Tanah Suci. Kunjungi Komplek Al-Aqsa dengan Dome of the Rock yang megah, nikmati pemandangan dari Bukit Zaitun, dan jelajahi Jericho - kota tertua di dunia.',
        image: 'Destination Cahaya 6.jpeg',
        category: 'Spiritual',
        features: [
            'Kunjungan ke Komplek Al-Aqsa',
            'Dome of the Rock exploration',
            'Bukit Zaitun (Mount of Olives)',
            'Kunjungan ke Jericho',
            'Pemandu spiritual profesional',
            'Akomodasi hotel bintang 5',
        ],
        stats: { travelers: '3000+', satisfaction: '98%', experience: '15+ years' },
        badge: 'Spiritual',
    },
    {
        id: 6,
        title: 'Sinai - Patung Samiri',
        subtitle: 'Napak Tilas Sejarah Nabi',
        description:
            'Perjalanan spiritual ke Sinai untuk melihat kisah Patung Samiri. Napak tilas sejarah nabi dan mengambil pelajaran berharga dari setiap kisah perjalanan ini.',
        image: 'Destination Cahaya 3.jpeg',
        category: 'Spiritual',
        features: [
            'Kunjungan ke situs Patung Samiri',
            'Napak tilas sejarah nabi',
            'Pemandu spiritual profesional',
            'Akomodasi hotel bintang 5',
            'Pengalaman spiritual mendalam',
            'Fasilitas lengkap dari Cahaya Anbiya',
        ],
        stats: { travelers: '1800+', satisfaction: '96%', experience: '10+ years' },
        badge: 'Spiritual',
    },
];

type EditorData = {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    category: string;
    badge: string;
};

export default function Highlights() {
    const { props } = usePage<{ sections?: Record<string, { content?: string; image?: string }> }>();
    const getContent = (key: string, fallback: string) => props.sections?.[key]?.content?.trim() || fallback;
    const getImageSrc = (sectionKey: string, fallbackPath: string) => getImageUrl(props.sections, sectionKey, fallbackPath);

    const [editMode, setEditMode] = useState(false);
    const [editorOpen, setEditorOpen] = useState<EditorData | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const check = () => setEditMode(document.documentElement.classList.contains('cms-edit'));
        check();
        const handler = () => check();
        window.addEventListener('cms:mode', handler as EventListener);
        return () => window.removeEventListener('cms:mode', handler as EventListener);
    }, []);

    const handleSave = async () => {
        if (!editorOpen) return;
        setSaving(true);
        try {
            const updates = [
                { key: `highlights.${editorOpen.id}.title`, content: editorOpen.title },
                { key: `highlights.${editorOpen.id}.subtitle`, content: editorOpen.subtitle },
                { key: `highlights.${editorOpen.id}.description`, content: editorOpen.description },
                { key: `highlights.${editorOpen.id}.category`, content: editorOpen.category },
                { key: `highlights.${editorOpen.id}.badge`, content: editorOpen.badge },
            ];
            await Promise.all(updates.map((u) => axios.post('/admin/update-section', u)));
            if (pendingFile) {
                const compressed = await compressImageForUpload(pendingFile);
                const form = new FormData();
                form.append('key', `highlights.${editorOpen.id}.image`);
                form.append('image', compressed);
                const r = await axios.post('/admin/upload-image', form, {
                    headers: { Accept: 'application/json' },
                });
                const url = r.data?.url || r.data?.imageUrl;
                if (url) {
                    const img = document.querySelector(`img[data-highlight-id="${editorOpen.id}"]`) as HTMLImageElement | null;
                    if (img) img.src = url;
                }
            }
            setEditorOpen(null);
            setPendingFile(null);
            router.reload({ only: ['sections'] });
        } catch (err: unknown) {
            console.error(err);
            const ax =
                err && typeof err === 'object' && 'response' in err
                    ? (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
                    : null;
            const data = ax?.response?.data;
            let msg = data?.message || (err instanceof Error ? err.message : 'Failed to save');
            if (data?.errors && typeof data.errors === 'object') {
                const flat = Object.values(data.errors).flat().filter(Boolean);
                if (flat.length) msg = flat.join('. ');
            }
            alert(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <PublicLayout>
            <SeoHead
                title="Highlights - Cahaya Anbiya Travel"
                description="Rangkuman pengalaman terbaik dan highlight perjalanan Cahaya Anbiya Travel untuk umrah dan wisata premium."
            />

            <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
                <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 md:pt-16 md:pb-10">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.06),transparent_70%)] blur-3xl" />
                        <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.06),transparent_70%)] blur-3xl" />
                    </div>

                    <div className="relative mb-8 text-center md:mb-10">
                        <div className="mb-4 inline-block">
                            <div className="rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-4 py-1.5 shadow-xl">
                                <span className="text-xs font-semibold tracking-wider text-amber-200 uppercase sm:text-sm">
                                    ✨ Premium Travel Highlights
                                </span>
                            </div>
                        </div>
                        <h1 className="mb-4 bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-3xl leading-tight font-bold text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                            Travel Highlights & Experiences
                        </h1>
                        <p className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg lg:text-xl">
                            Discover our most popular and unforgettable travel experiences. From spiritual journeys to luxury adventures, each
                            highlight represents the best of what we offer.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/70 sm:gap-6 sm:text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-md" />
                                <span className="font-medium">Premium Experiences</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400 shadow-md" />
                                <span className="font-medium">Expert Guidance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-md" />
                                <span className="font-medium">Unforgettable Memories</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                        {highlights.map((h) => (
                            <article
                                key={h.id}
                                className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={getImageSrc(`highlights.${h.id}.image`, h.image)}
                                        alt={getContent(`highlights.${h.id}.title`, h.title)}
                                        data-highlight-id={h.id}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            const target = e.currentTarget;
                                            if (target.src?.includes('assets.cahayaanbiya.com')) {
                                                const u = target.src;
                                                target.src = u.includes('/public/')
                                                    ? u.replace('/public/', '/')
                                                    : u.replace('assets.cahayaanbiya.com/', 'assets.cahayaanbiya.com/public/');
                                            } else {
                                                target.style.display = 'none';
                                                const next = target.nextElementSibling as HTMLElement;
                                                if (next) next.style.display = 'block';
                                            }
                                        }}
                                    />
                                    <PlaceholderImage className="hidden h-full w-full object-cover" />

                                    <div className="absolute top-3 left-3">
                                        <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white shadow-lg sm:text-sm">
                                            {getContent(`highlights.${h.id}.category`, h.category)}
                                        </span>
                                    </div>

                                    {editMode && (
                                        <div className="absolute right-3 bottom-3 z-10">
                                            <button
                                                onClick={() => {
                                                    setEditorOpen({
                                                        id: h.id,
                                                        title: getContent(`highlights.${h.id}.title`, h.title),
                                                        subtitle: getContent(`highlights.${h.id}.subtitle`, h.subtitle),
                                                        description: getContent(`highlights.${h.id}.description`, h.description),
                                                        category: getContent(`highlights.${h.id}.category`, h.category),
                                                        badge: getContent(`highlights.${h.id}.badge`, h.badge),
                                                    });
                                                    setPendingFile(null);
                                                }}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:scale-110"
                                                title="Edit"
                                            >
                                                <Edit3 className="h-5 w-5" strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </div>

                                <div className="flex flex-1 flex-col p-5 sm:p-6">
                                    <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-amber-300 sm:text-xl">
                                        {getContent(`highlights.${h.id}.title`, h.title)}
                                    </h3>
                                    <p className="mb-3 text-sm font-semibold text-amber-300 sm:text-base">
                                        {getContent(`highlights.${h.id}.subtitle`, h.subtitle)}
                                    </p>
                                    <p className="mb-4 text-sm leading-relaxed text-white/80 sm:text-base">
                                        {getContent(`highlights.${h.id}.description`, h.description)}
                                    </p>

                                    <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-amber-300 sm:text-xl">
                                                {getContent(`highlights.${h.id}.stats.travelers`, h.stats.travelers)}
                                            </div>
                                            <div className="text-xs font-medium text-white/70">Travelers</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-amber-300 sm:text-xl">
                                                {getContent(`highlights.${h.id}.stats.satisfaction`, h.stats.satisfaction)}
                                            </div>
                                            <div className="text-xs font-medium text-white/70">Satisfaction</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-amber-300 sm:text-xl">
                                                {getContent(`highlights.${h.id}.stats.experience`, h.stats.experience)}
                                            </div>
                                            <div className="text-xs font-medium text-white/70">Experience</div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="mb-2 text-sm font-bold text-white sm:text-base">Key Features</h4>
                                        <ul className="space-y-1.5 text-xs text-white/80 sm:text-sm">
                                            {h.features.map((f, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-400" />
                                                    <span>{getContent(`highlights.${h.id}.features.${idx}`, f)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-auto">
                                        <a
                                            href="https://wa.me/6281234567890"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-center text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-amber-400 hover:to-orange-400 sm:px-6 sm:py-3 sm:text-base"
                                        >
                                            Contact Us
                                        </a>
                                    </div>
                                </div>

                                <div className="h-0.5 origin-left scale-x-0 transform bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 shadow-md transition-transform duration-500 group-hover:scale-x-100" />
                            </article>
                        ))}
                    </div>

                    <div className="relative mt-12 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center shadow-xl md:mt-16">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10" />
                        <div className="relative mx-auto max-w-3xl">
                            <h3 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">Ready to Experience These Highlights?</h3>
                            <p className="mb-6 text-sm text-white/95 sm:text-base md:text-lg">
                                Join thousands of satisfied travelers who have experienced the magic of our carefully curated destinations.
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-xl transition-all hover:scale-105 hover:bg-white/95 sm:px-8 sm:py-4 sm:text-base"
                                >
                                    Start Your Journey
                                    <ArrowRight className="h-5 w-5" />
                                </a>
                                <a
                                    href="/destinations"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-white hover:text-black sm:px-8 sm:py-4 sm:text-base"
                                >
                                    View All Destinations
                                    <ArrowRight className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 md:mt-16">
                        <h3 className="mb-8 bg-gradient-to-r from-amber-200 to-white bg-clip-text text-center text-2xl font-bold text-transparent sm:text-3xl md:text-4xl">
                            What Our Travelers Say
                        </h3>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                            {[
                                {
                                    name: 'Ahmad Rizki',
                                    location: 'Jakarta',
                                    testimonial: 'The Umrah experience with Cahaya Anbiya was truly spiritual and well-organized.',
                                    rating: 5,
                                    trip: 'Umrah Package',
                                },
                                {
                                    name: 'Sarah Putri',
                                    location: 'Bandung',
                                    testimonial: 'Our Turkey adventure was beyond expectations. The hot air balloon ride was magical!',
                                    rating: 5,
                                    trip: 'Turkey Heritage',
                                },
                                {
                                    name: 'Budi Santoso',
                                    location: 'Surabaya',
                                    testimonial: 'Dubai luxury experience was incredible. The desert safari was a highlight!',
                                    rating: 5,
                                    trip: 'Dubai Luxury',
                                },
                            ].map((t, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-5 shadow-xl sm:p-6"
                                >
                                    <div className="mb-4 flex items-center gap-1">
                                        {[...Array(t.rating)].map((_, j) => (
                                            <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400 sm:h-5 sm:w-5" />
                                        ))}
                                    </div>
                                    <p className="mb-4 text-sm leading-relaxed text-white/80 sm:text-base">&quot;{t.testimonial}&quot;</p>
                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        <div className="text-xs text-white/60 sm:text-sm">{t.location}</div>
                                        <div className="text-xs font-bold text-amber-300 sm:text-sm">{t.trip}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer className="relative border-t border-white/10 bg-black/70">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                            <div className="text-center text-base text-white/70 md:text-left">
                                <div className="font-semibold">Email: hello@cahaya-anbiya.com</div>
                                <div className="mt-2 font-semibold">WhatsApp: +62 812-3456-7890</div>
                                <div className="mt-2 font-semibold">24/7 Customer Support</div>
                            </div>
                            <div className="flex items-center gap-8">
                                {['Instagram', 'TikTok', 'YouTube'].map((social) => (
                                    <a
                                        key={social}
                                        href={`https://${social.toLowerCase()}.com`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-base font-semibold text-white/70 transition-all hover:scale-110 hover:text-amber-400"
                                    >
                                        {social}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 border-t border-white/10 pt-8 text-center">
                            <p className="text-sm text-white/50">© 2024 Cahaya Anbiya Travel. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>

            <AnimatePresence>
                {editMode && editorOpen && (
                    <motion.div
                        key={editorOpen.id}
                        className="fixed bottom-6 left-1/2 z-[9998] w-[min(640px,92vw)] -translate-x-1/2 rounded-xl border border-white/10 bg-black/95 p-6 shadow-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">Edit Highlight #{editorOpen.id}</span>
                        </div>
                        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2">
                            {(['title', 'subtitle', 'description', 'category', 'badge'] as const).map((field) => (
                                <div key={field}>
                                    <label className="mb-1 block text-xs font-medium text-gray-300 capitalize">{field}</label>
                                    {field === 'description' ? (
                                        <textarea
                                            value={editorOpen[field]}
                                            onChange={(e) => setEditorOpen({ ...editorOpen, [field]: e.target.value })}
                                            rows={4}
                                            className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={editorOpen[field]}
                                            onChange={(e) => setEditorOpen({ ...editorOpen, [field]: e.target.value })}
                                            className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
                                        />
                                    )}
                                </div>
                            ))}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-300">Replace Image</label>
                                <p className="mb-2 rounded-lg border border-amber-500/30 bg-amber-900/20 px-3 py-2 text-xs text-amber-100">
                                    {IMAGE_GUIDE}
                                </p>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setCropImageSrc(URL.createObjectURL(file));
                                            setCropModalOpen(true);
                                        }
                                        e.target.value = '';
                                    }}
                                    className="w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-amber-400"
                                />
                                {pendingFile && <p className="mt-2 text-xs text-emerald-400">✓ Gambar siap (sudah di-adjust)</p>}
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                onClick={() => {
                                    setEditorOpen(null);
                                    setPendingFile(null);
                                }}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 ring-1 ring-white/10 transition-all hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-60"
                            >
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {cropImageSrc && (
                <ImageCropModal
                    open={cropModalOpen}
                    onOpenChange={setCropModalOpen}
                    imageSrc={cropImageSrc}
                    aspect={16 / 9}
                    onApply={async (blob) => {
                        const file = new File([blob], 'image.jpg', { type: blob.type });
                        setPendingFile(file);
                        URL.revokeObjectURL(cropImageSrc);
                        setCropImageSrc(null);
                    }}
                    onCancel={() => {
                        URL.revokeObjectURL(cropImageSrc);
                        setCropImageSrc(null);
                    }}
                />
            )}
        </PublicLayout>
    );
}
