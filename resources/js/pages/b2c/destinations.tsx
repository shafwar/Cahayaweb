import { ImageCropModal } from '@/components/cms';
import PlaceholderImage from '@/components/media/placeholder-image';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { compressImageForUpload } from '@/utils/cmsImageUpload';
import { getImageUrl } from '@/utils/imageHelper';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Clock, Edit3, MapPin, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const IMAGE_GUIDE = '1920×1080px recommended · Max 5MB · Auto-compressed · JPEG, PNG, WebP';

const destinations = [
    {
        id: 1,
        title: 'Arab Saudi',
        subtitle: 'Spiritual Journey to the Holy Land',
        image: '/arabsaudi.jpg',
        duration: '9D8N',
        price: 'Rp 28.5M',
        location: 'Makkah & Madinah',
        highlights: '5-star hotels, direct flights, professional guide, spiritual guidance',
        description:
            'Embark on a profound spiritual journey to the holiest sites in Islam. Experience the sacred atmosphere of Makkah and Madinah with our premium Umrah packages.',
        features: [
            'Luxury 5-star hotel accommodations',
            'Direct flights from Indonesia',
            'Professional spiritual guide',
            'VIP access to holy sites',
            'Comprehensive travel insurance',
            'Daily spiritual programs',
        ],
        badge: 'Premium',
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
        description:
            'Discover the perfect blend of East and West in Turkey. Explore magnificent Hagia Sophia and Blue Mosque, soar above fairy chimneys in a hot air balloon.',
        features: [
            'Hot air balloon ride in Cappadocia',
            'Guided tours of historical sites',
            'Luxury hotel accommodations',
            'Traditional Turkish bath experience',
            'Bosphorus cruise in Istanbul',
            'Local cuisine tasting tours',
        ],
        badge: 'Adventure',
        category: 'Cultural',
    },
    {
        id: 3,
        title: 'Mesir - Pyramid',
        subtitle: 'Pyramids of Giza & Ancient Wonders',
        image: 'Destination Cahaya 2.jpeg',
        duration: '8D7N',
        price: 'Rp 16.5M',
        location: 'Mesir - Pyramid',
        highlights: 'Pyramids of Giza, ancient Egyptian marvels, historical exploration',
        description:
            'Jelajahi keajaiban Mesir kuno dengan melihat langsung Piramida Giza yang megah. Perjalanan spiritual dan sejarah yang mengesankan ke salah satu keajaiban dunia.',
        features: [
            'Kunjungan ke Piramida Giza',
            'Pemandu profesional berbahasa Indonesia',
            'Akomodasi hotel bintang 5',
            'Tur ke situs-situs bersejarah',
            'Pengalaman budaya Mesir kuno',
            'Fasilitas lengkap dari Cahaya Anbiya',
        ],
        badge: 'Heritage',
        category: 'Historical',
    },
    {
        id: 4,
        title: 'Jordan - Petra & Wadi Rum',
        subtitle: 'Petra, Wadi Rum & Ashabul Kahfi',
        image: 'Destination Cahaya 4.jpeg',
        duration: '7D6N',
        price: 'Rp 17.2M',
        location: 'Amman - Yordania',
        highlights: 'Petra (7 keajaiban dunia), Lembah Wadi Rum jeep tour, Goa Ashabul Kahfi',
        description:
            'Perjalanan spiritual dan petualangan ke Yordania. Lihat langsung 7 keajaiban dunia di Petra, nikmati jeep tour di Lembah Wadi Rum, dan kunjungi Goa Ashabul Kahfi yang bersejarah.',
        features: [
            'Kunjungan ke Petra - 7 keajaiban dunia',
            'Jeep tour di Lembah Wadi Rum (fasilitas gratis dari Cahaya Anbiya)',
            'Kunjungan ke Goa Ashabul Kahfi',
            'Pemandu profesional berbahasa Indonesia',
            'Akomodasi hotel bintang 5',
            'Pengalaman Bedouin tradisional',
        ],
        badge: 'Adventure',
        category: 'Historical',
    },
    {
        id: 5,
        title: 'Aqsa & Palestine',
        subtitle: 'Al-Aqsa, Bukit Zaitun & Jericho',
        image: 'Destination Cahaya 6.jpeg',
        duration: '8D7N',
        price: 'Rp 19.5M',
        location: 'Aqsa - Palestine',
        highlights: 'Komplek Al-Aqsa, Dome of the Rock, Bukit Zaitun, Jericho',
        description:
            'Perjalanan spiritual ke Tanah Suci. Kunjungi Komplek Al-Aqsa dengan Dome of the Rock yang megah, nikmati pemandangan dari Bukit Zaitun, dan jelajahi Jericho - kota tertua di dunia.',
        features: [
            'Kunjungan ke Komplek Al-Aqsa',
            'Dome of the Rock exploration',
            'Bukit Zaitun (Mount of Olives)',
            'Kunjungan ke Jericho',
            'Pemandu spiritual profesional',
            'Akomodasi hotel bintang 5',
        ],
        badge: 'Spiritual',
        category: 'Spiritual',
    },
    {
        id: 6,
        title: 'Sinai - Patung Samiri',
        subtitle: 'Napak Tilas Sejarah Nabi',
        image: 'Destination Cahaya 3.jpeg',
        duration: '6D5N',
        price: 'Rp 15.8M',
        location: 'Sinai',
        highlights: 'Kisah Patung Samiri, napak tilas sejarah nabi, perjalanan spiritual',
        description:
            'Perjalanan spiritual ke Sinai untuk melihat kisah Patung Samiri. Napak tilas sejarah nabi dan mengambil pelajaran berharga dari setiap kisah perjalanan ini.',
        features: [
            'Kunjungan ke situs Patung Samiri',
            'Napak tilas sejarah nabi',
            'Pemandu spiritual profesional',
            'Akomodasi hotel bintang 5',
            'Pengalaman spiritual mendalam',
            'Fasilitas lengkap dari Cahaya Anbiya',
        ],
        badge: 'Spiritual',
        category: 'Spiritual',
    },
];

type EditorData = {
    id: number;
    title: string;
    subtitle: string;
    location: string;
    duration: string;
    price: string;
    highlights: string;
    description: string;
    category: string;
    badge: string;
};

export default function Destinations() {
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
                { key: `destinations.${editorOpen.id}.title`, content: editorOpen.title },
                { key: `destinations.${editorOpen.id}.subtitle`, content: editorOpen.subtitle },
                { key: `destinations.${editorOpen.id}.location`, content: editorOpen.location },
                { key: `destinations.${editorOpen.id}.duration`, content: editorOpen.duration },
                { key: `destinations.${editorOpen.id}.price`, content: editorOpen.price },
                { key: `destinations.${editorOpen.id}.highlights`, content: editorOpen.highlights },
                { key: `destinations.${editorOpen.id}.description`, content: editorOpen.description },
                { key: `destinations.${editorOpen.id}.category`, content: editorOpen.category },
                { key: `destinations.${editorOpen.id}.badge`, content: editorOpen.badge },
            ];
            await Promise.all(updates.map((u) => axios.post('/admin/update-section', u)));
            if (pendingFile) {
                const compressed = await compressImageForUpload(pendingFile);
                const form = new FormData();
                form.append('key', `destinations.${editorOpen.id}.image`);
                form.append('image', compressed);
                const r = await axios.post('/admin/upload-image', form, {
                    headers: { Accept: 'application/json' },
                });
                const url = r.data?.url || r.data?.imageUrl;
                if (url) {
                    const img = document.querySelector(`img[data-destination-id="${editorOpen.id}"]`) as HTMLImageElement | null;
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
                title="Destinations - Cahaya Anbiya Travel"
                description="Jelajahi destinasi wisata halal terbaik dari Cahaya Anbiya Travel. Paket perjalanan ke berbagai destinasi menarik dengan layanan premium dan terpercaya."
                keywords="destinasi wisata halal, paket wisata, destinasi umrah, destinasi haji, paket perjalanan"
            />

            <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
                <section className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-10">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.06),transparent_70%)] blur-3xl" />
                        <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.06),transparent_70%)] blur-3xl" />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="mb-8 text-center md:mb-10">
                            <div className="mb-4 inline-block">
                                <div className="rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-4 py-1.5 shadow-xl">
                                    <span className="text-xs font-semibold tracking-wider text-amber-200 uppercase sm:text-sm">
                                        ✨ Explore Dream Destinations
                                    </span>
                                </div>
                            </div>
                            <h1 className="mb-4 bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-3xl leading-tight font-bold text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                                Discover Your Dream Destinations
                            </h1>
                            <p className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg lg:text-xl">
                                Embark on extraordinary journeys across the Middle East and beyond. From spiritual pilgrimages to luxury adventures,
                                we curate unforgettable experiences.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/70 sm:gap-6 sm:text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-md" />
                                    <span className="font-medium">9 Premium Destinations</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400 shadow-md" />
                                    <span className="font-medium">Curated Experiences</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-md" />
                                    <span className="font-medium">Professional Service</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                            {destinations.map((d) => (
                                <article
                                    key={d.id}
                                    className="group overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={getImageSrc(`destinations.${d.id}.image`, d.image)}
                                            alt={getContent(`destinations.${d.id}.title`, d.title)}
                                            data-destination-id={d.id}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const next = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (next) next.style.display = 'block';
                                            }}
                                        />
                                        <PlaceholderImage className="hidden h-full w-full object-cover" />

                                        <div className="absolute top-0 right-0 z-10">
                                            <div className="flex h-9 items-center rounded-bl-xl bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg sm:px-4 sm:text-sm">
                                                {getContent(`destinations.${d.id}.badge`, d.badge)}
                                            </div>
                                        </div>
                                        <div className="absolute top-3 left-3">
                                            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white shadow-lg sm:text-sm">
                                                {getContent(`destinations.${d.id}.category`, d.category)}
                                            </span>
                                        </div>

                                        {editMode && (
                                            <div className="absolute right-3 bottom-3 z-20">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditorOpen({
                                                            id: d.id,
                                                            title: getContent(`destinations.${d.id}.title`, d.title),
                                                            subtitle: getContent(`destinations.${d.id}.subtitle`, d.subtitle),
                                                            location: getContent(`destinations.${d.id}.location`, d.location),
                                                            duration: getContent(`destinations.${d.id}.duration`, d.duration),
                                                            price: getContent(`destinations.${d.id}.price`, d.price),
                                                            highlights: getContent(`destinations.${d.id}.highlights`, d.highlights),
                                                            description: getContent(`destinations.${d.id}.description`, d.description),
                                                            category: getContent(`destinations.${d.id}.category`, d.category),
                                                            badge: getContent(`destinations.${d.id}.badge`, d.badge),
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

                                    <div className="p-5 sm:p-6">
                                        <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-amber-300 sm:text-xl">
                                            {getContent(`destinations.${d.id}.title`, d.title)}
                                        </h3>
                                        <p className="mb-3 text-sm leading-relaxed text-white/80 sm:text-base">
                                            {getContent(`destinations.${d.id}.subtitle`, d.subtitle)}
                                        </p>
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="text-lg font-bold text-amber-300 sm:text-xl">
                                                {getContent(`destinations.${d.id}.price`, d.price)}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70 sm:text-sm">
                                                <Clock className="h-4 w-4" />
                                                <span>{getContent(`destinations.${d.id}.duration`, d.duration)}</span>
                                            </div>
                                        </div>
                                        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-white/70 sm:text-sm">
                                            <MapPin className="h-4 w-4" />
                                            <span>{getContent(`destinations.${d.id}.location`, d.location)}</span>
                                        </div>
                                        <p className="mb-3 line-clamp-2 text-xs text-white/70 sm:text-sm">
                                            {getContent(`destinations.${d.id}.highlights`, d.highlights)}
                                        </p>
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                            <h4 className="mb-2 text-xs font-bold text-amber-300 sm:text-sm">What&apos;s Included</h4>
                                            <ul className="space-y-1.5 text-xs text-white/90 sm:text-sm">
                                                {d.features.slice(0, 4).map((f, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-400" />
                                                        <span>{f}</span>
                                                    </li>
                                                ))}
                                                {d.features.length > 4 && <li className="text-white/60">+{d.features.length - 4} more</li>}
                                            </ul>
                                        </div>
                                        <div className="mt-4 flex gap-3">
                                            <a
                                                href="https://wa.me/6281234567890"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-center text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-amber-400 hover:to-orange-400"
                                            >
                                                Book Now
                                            </a>
                                            <a
                                                href="https://wa.me/6281234567890"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 rounded-xl border border-amber-500 px-4 py-2.5 text-center text-sm font-bold text-amber-300 transition-all hover:scale-105 hover:bg-amber-500 hover:text-white"
                                            >
                                                Ask Questions
                                            </a>
                                        </div>
                                    </div>

                                    <div className="h-0.5 origin-left scale-x-0 transform bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 shadow-md transition-transform duration-500 group-hover:scale-x-100" />
                                </article>
                            ))}
                        </div>

                        <div className="mt-20 text-center">
                            <div className="mb-8 inline-flex items-center rounded-full border-2 border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-8 py-4 shadow-xl">
                                <span className="text-base font-bold text-amber-200">✨ Custom Packages Available</span>
                            </div>
                            <h3 className="mb-6 text-4xl font-bold text-white md:text-5xl">Can&apos;t Find the Perfect Destination?</h3>
                            <p className="mx-auto mb-10 max-w-3xl text-xl text-white/80">
                                Our travel experts are here to create the perfect custom itinerary just for you. Whether you&apos;re looking for a
                                spiritual journey, cultural adventure, or luxury escape.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                <a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 hover:from-amber-400 hover:to-orange-400"
                                >
                                    Free Consultation
                                    <ArrowRight className="h-6 w-6" />
                                </a>
                                <a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-amber-500 px-10 py-5 text-lg font-bold text-amber-300 transition-all hover:scale-105 hover:bg-amber-500 hover:text-white"
                                >
                                    Custom Package
                                    <Plus className="h-6 w-6" />
                                </a>
                            </div>
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

            {/* Editor Modal - Home-style floating bottom */}
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
                            <span className="text-sm font-semibold text-white">Edit Destination #{editorOpen.id}</span>
                        </div>
                        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2">
                            {(['title', 'subtitle', 'location', 'duration', 'price', 'highlights', 'description', 'category', 'badge'] as const).map(
                                (field) => (
                                    <div key={field}>
                                        <label className="mb-1 block text-xs font-medium text-gray-300 capitalize">{field}</label>
                                        {field === 'highlights' || field === 'description' ? (
                                            <textarea
                                                value={editorOpen[field]}
                                                onChange={(e) => setEditorOpen({ ...editorOpen, [field]: e.target.value })}
                                                rows={field === 'description' ? 4 : 2}
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
                                ),
                            )}
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
