import { EditableText } from '@/components/cms';
import PlaceholderImage from '@/components/media/placeholder-image';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Camera, Check, Edit3, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Enhanced Modal Component
function HighlightEditorModal({
    highlight,
    onClose,
    onSave,
}: {
    highlight: {
        id: number;
        title: string;
        subtitle: string;
        description: string;
        category: string;
        badge: string;
    };
    onClose: () => void;
    onSave: (data: { id: number; title: string; subtitle: string; description: string; category: string; badge: string }) => Promise<void>;
}) {
    const [formData, setFormData] = useState(highlight);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        setFormData(highlight);
    }, [highlight]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex-shrink-0 border-b-2 border-white/10 bg-gradient-to-r from-amber-600/20 to-orange-600/20 px-8 py-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="mb-2 text-3xl font-bold text-white">✨ Edit Highlight</h2>
                                <p className="text-base text-gray-300">Update highlight information</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-xl p-3 text-gray-400 transition-all hover:rotate-90 hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 py-8">
                        <div className="space-y-6">
                            <div>
                                <label className="mb-3 block text-base font-bold text-gray-200">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                    placeholder="Highlight title"
                                />
                            </div>
                            <div>
                                <label className="mb-3 block text-base font-bold text-gray-200">Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                    placeholder="Short description"
                                />
                            </div>
                            <div>
                                <label className="mb-3 block text-base font-bold text-gray-200">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={5}
                                    className="w-full resize-none rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                    placeholder="Detailed description"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="mb-3 block text-base font-bold text-gray-200">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                        placeholder="e.g., Premium"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 block text-base font-bold text-gray-200">Badge</label>
                                    <input
                                        type="text"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                        placeholder="e.g., Featured"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-3 block text-base font-bold text-gray-200">Replace Image</label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-base text-white transition-all file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-amber-500 file:to-orange-500 file:px-5 file:py-3 file:font-bold file:text-white hover:file:from-amber-400 hover:file:to-orange-400"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setIsSaving(true);
                                        try {
                                            const formData = new FormData();
                                            formData.append('key', `highlights.${highlight.id}.image`);
                                            formData.append('image', file);
                                            const response = await axios.post('/admin/upload-image', formData, {
                                                headers: { 'Content-Type': 'multipart/form-data' },
                                            });
                                            if (response.data.success && response.data.imageUrl) {
                                                const img = document.querySelector(
                                                    `img[data-highlight-id="${highlight.id}"]`,
                                                ) as HTMLImageElement | null;
                                                if (img) img.src = response.data.imageUrl;
                                                const notification = document.createElement('div');
                                                notification.className =
                                                    'fixed top-20 right-4 z-[99999] rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-5 text-white shadow-2xl';
                                                notification.innerHTML =
                                                    '<div class="flex items-center gap-4"><svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><div><div class="font-bold text-lg">📸 Image Updated!</div><div class="text-sm opacity-90">Successfully saved</div></div></div>';
                                                document.body.appendChild(notification);
                                                setTimeout(() => notification.remove(), 3000);
                                            }
                                        } catch (error) {
                                            console.error('Upload failed:', error);
                                            alert('Failed to upload image');
                                        } finally {
                                            setIsSaving(false);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <p className="mt-3 text-sm text-gray-400">Supported: JPEG, PNG, WebP • Max 5MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 border-t-2 border-white/10 bg-gray-900/50 px-8 py-5">
                        <div className="flex items-center justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="rounded-xl border-2 border-white/10 px-6 py-3 text-base font-semibold text-gray-300 transition-all hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="hover:shadow-3xl rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-bold text-white shadow-2xl transition-all hover:scale-105 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    '💾 Save All Changes'
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body,
    );
}

export default function Highlights() {
    const [editMode, setEditModeUI] = useState<boolean>(false);
    useEffect(() => {
        const check = () => setEditModeUI(document.documentElement.classList.contains('cms-edit'));
        check();
        const handler = () => check();
        window.addEventListener('cms:mode', handler as EventListener);
        return () => window.removeEventListener('cms:mode', handler as EventListener);
    }, []);

    const [editorOpen, setEditorOpen] = useState<null | {
        id: number;
        title: string;
        subtitle: string;
        description: string;
        category: string;
        badge: string;
    }>(null);
    const [imageTargetKey, setImageTargetKey] = useState<string | null>(null);
    const hiddenImageInputId = 'highlights-image-replacer';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    };

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
            title: 'Ancient Wonders of Egypt',
            subtitle: 'Pyramids & Nile River Expedition',
            description:
                'Journey through the cradle of civilization and explore the magnificent wonders of ancient Egypt. From the Great Pyramids of Giza to the majestic Nile River cruises, experience the magic of pharaonic history.',
            image: '/egypt.jpeg',
            category: 'Historical',
            features: [
                'Nile River luxury cruise',
                'Pyramids guided exploration',
                'Valley of the Kings tour',
                'Abu Simbel temple visit',
                'Egyptian Museum tour',
                'Traditional felucca sailing',
            ],
            stats: { travelers: '2800+', satisfaction: '95%', experience: '10+ years' },
            badge: 'Heritage',
        },
        {
            id: 4,
            title: 'Luxury Dubai Experience',
            subtitle: 'Modern Wonders & Desert Adventures',
            description:
                'Experience the epitome of luxury and innovation in Dubai. From the iconic Burj Khalifa to thrilling desert safaris, discover why Dubai is the ultimate destination for luxury travelers seeking modern Arabian hospitality.',
            image: '/dubai1.jpeg',
            category: 'Luxury',
            features: [
                'Burj Khalifa observation deck',
                'Desert safari with dinner',
                'Luxury shopping experience',
                'Sheikh Zayed Mosque tour',
                'Ferrari World theme park',
                'Dhow cruise dinner',
            ],
            stats: { travelers: '4500+', satisfaction: '97%', experience: '14+ years' },
            badge: 'Premium',
        },
        {
            id: 5,
            title: 'Oman Adventure Discovery',
            subtitle: 'Hidden Gems of the Arabian Peninsula',
            description:
                'Explore the hidden gem of the Arabian Peninsula. From the stunning fjords of Musandam to the ancient forts of Nizwa, discover authentic Arabian experiences away from the crowds in this pristine destination.',
            image: '/oman.jpg',
            category: 'Adventure',
            features: [
                'Desert camping in Wahiba Sands',
                'Ancient fort exploration',
                'Wadi hiking adventures',
                'Traditional souk visits',
                'Dolphin watching cruise',
                'Mountain village tours',
            ],
            stats: { travelers: '1800+', satisfaction: '99%', experience: '8+ years' },
            badge: 'Explorer',
        },
        {
            id: 6,
            title: 'Qatar Luxury & Culture',
            subtitle: 'Tradition Meets Modernity',
            description:
                'Experience the perfect blend of tradition and modernity in Qatar. From the stunning Museum of Islamic Art to luxury at The Pearl, discover why Qatar is becoming a premier travel destination in the Gulf region.',
            image: '/qatar.jpg',
            category: 'Luxury',
            features: [
                'Museum of Islamic Art tour',
                'Souq Waqif cultural experience',
                'Desert safari adventure',
                'The Pearl luxury experience',
                'Katara Cultural Village',
                'Luxury resort accommodations',
            ],
            stats: { travelers: '2200+', satisfaction: '94%', experience: '9+ years' },
            badge: 'Premium',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Highlights - Cahaya Anbiya Travel" />

            <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
                <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 md:pt-16 md:pb-10">
                    {/* Ambient Effects */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.1),transparent_70%)] blur-2xl" style={{ willChange: 'auto' }} />
                        <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.1),transparent_70%)] blur-2xl" style={{ willChange: 'auto' }} />
                    </div>

                    {/* Hero Section - Compact */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative mb-8 text-center md:mb-10"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="mb-4 inline-block"
                        >
                            <div className="rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-4 py-1.5 shadow-xl">
                                <span className="text-xs font-semibold tracking-wider text-amber-200 uppercase sm:text-sm">
                                    ✨ Premium Travel Highlights
                                </span>
                            </div>
                        </motion.div>

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
                    </motion.div>

                    {/* Highlights Grid - Compact */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
                        style={{ gridAutoRows: '1fr' }}
                    >
                        {highlights.map((highlight) => (
                            <motion.article
                                key={highlight.id}
                                variants={cardVariants}
                                whileHover={{ scale: 1.03, y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
                                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 shadow-xl transition-all duration-300"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={highlight.image}
                                        alt={highlight.title}
                                        data-highlight-id={highlight.id}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                            if (nextElement) nextElement.style.display = 'block';
                                        }}
                                    />
                                    <PlaceholderImage className="hidden h-full w-full object-cover" />

                                    <div className="absolute top-3 left-3">
                                        <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white shadow-lg sm:text-sm">
                                            {highlight.category}
                                        </span>
                                    </div>

                                    {editMode && (
                                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                            <button
                                                onClick={() => {
                                                    setImageTargetKey(`highlights.${highlight.id}.image`);
                                                    document.getElementById(hiddenImageInputId)?.click();
                                                }}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-gray-800 shadow-xl ring-2 ring-white/40 transition-all hover:scale-105"
                                                title="Replace image"
                                            >
                                                <Camera className="h-5 w-5" strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setEditorOpen({
                                                        id: highlight.id,
                                                        title: highlight.title,
                                                        subtitle: highlight.subtitle,
                                                        description: highlight.description,
                                                        category: highlight.category,
                                                        badge: highlight.badge,
                                                    })
                                                }
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:scale-110 hover:rotate-12"
                                                title="Edit details"
                                            >
                                                <Edit3 className="h-5 w-5" strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </div>

                                <div className="flex flex-1 flex-col p-5 sm:p-6">
                                    <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-amber-300 sm:text-xl">
                                        <EditableText sectionKey={`highlights.${highlight.id}.title`} value={highlight.title} tag="span" />
                                    </h3>
                                    <p className="mb-3 text-sm font-semibold text-amber-300 sm:text-base">
                                        <EditableText sectionKey={`highlights.${highlight.id}.subtitle`} value={highlight.subtitle} tag="span" />
                                    </p>

                                    <p className="mb-4 text-sm leading-relaxed text-white/80 sm:text-base">
                                        <EditableText
                                            sectionKey={`highlights.${highlight.id}.description`}
                                            value={highlight.description}
                                            tag="span"
                                        />
                                    </p>

                                    <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-amber-300 sm:text-xl">
                                                <EditableText
                                                    sectionKey={`highlights.${highlight.id}.stats.travelers`}
                                                    value={highlight.stats.travelers}
                                                    tag="span"
                                                />
                                            </div>
                                            <div className="text-xs font-medium text-white/70">Travelers</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-amber-300 sm:text-xl">
                                                <EditableText
                                                    sectionKey={`highlights.${highlight.id}.stats.satisfaction`}
                                                    value={highlight.stats.satisfaction}
                                                    tag="span"
                                                />
                                            </div>
                                            <div className="text-xs font-medium text-white/70">Satisfaction</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-amber-300 sm:text-xl">
                                                <EditableText
                                                    sectionKey={`highlights.${highlight.id}.stats.experience`}
                                                    value={highlight.stats.experience}
                                                    tag="span"
                                                />
                                            </div>
                                            <div className="text-xs font-medium text-white/70">Experience</div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="mb-2 text-sm font-bold text-white sm:text-base">Key Features:</h4>
                                        <ul className="space-y-1.5 text-xs text-white/80 sm:text-sm">
                                            {highlight.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-400" />
                                                    <span>
                                                        <EditableText
                                                            sectionKey={`highlights.${highlight.id}.features.${index}`}
                                                            value={feature}
                                                            tag="span"
                                                        />
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:from-amber-400 hover:to-orange-400 sm:px-6 sm:py-3 sm:text-base"
                                        >
                                            Learn More
                                        </motion.button>
                                        <div className="text-xs font-semibold text-white/60 sm:text-sm">{highlight.features.length} features</div>
                                    </div>
                                </div>

                                <div className="h-0.5 origin-left scale-x-0 transform bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 shadow-md transition-transform duration-500 group-hover:scale-x-100" />
                            </motion.article>
                        ))}
                    </motion.div>

                    {/* CTA Section - Compact */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center shadow-xl md:mt-16"
                    >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-black/20 via-transparent to-black/10" />
                        <div className="relative mx-auto max-w-3xl">
                            <h3 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">Ready to Experience These Highlights?</h3>
                            <p className="mb-6 text-sm text-white/95 sm:text-base md:text-lg">
                                Join thousands of satisfied travelers who have experienced the magic of our carefully curated destinations. Let us
                                help you create unforgettable memories.
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <motion.a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    whileHover={{ scale: 1.05, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-xl transition-all hover:bg-white/95 sm:px-8 sm:py-4 sm:text-base"
                                >
                                    Start Your Journey
                                    <ArrowRight className="h-5 w-5" />
                                </motion.a>
                                <motion.a
                                    href="/destinations"
                                    whileHover={{ scale: 1.05, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white hover:text-black sm:px-8 sm:py-4 sm:text-base"
                                >
                                    View All Destinations
                                    <ArrowRight className="h-5 w-5" />
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Testimonials - Compact */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-12 md:mt-16"
                    >
                        <h3 className="mb-8 bg-gradient-to-r from-amber-200 to-white bg-clip-text text-center text-2xl font-bold text-transparent sm:text-3xl md:text-4xl">
                            What Our Travelers Say
                        </h3>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                            {[
                                {
                                    name: 'Ahmad Rizki',
                                    location: 'Jakarta',
                                    testimonial:
                                        'The Umrah experience with Cahaya Anbiya was truly spiritual and well-organized. Every detail was taken care of perfectly.',
                                    rating: 5,
                                    trip: 'Umrah Package',
                                },
                                {
                                    name: 'Sarah Putri',
                                    location: 'Bandung',
                                    testimonial:
                                        'Our Turkey adventure was beyond expectations. The hot air balloon ride in Cappadocia was absolutely magical!',
                                    rating: 5,
                                    trip: 'Turkey Heritage',
                                },
                                {
                                    name: 'Budi Santoso',
                                    location: 'Surabaya',
                                    testimonial:
                                        'Dubai luxury experience was incredible. The desert safari and Burj Khalifa visit were highlights of our trip.',
                                    rating: 5,
                                    trip: 'Dubai Luxury',
                                },
                            ].map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-5 shadow-xl sm:p-6"
                                >
                                    <div className="mb-4 flex items-center gap-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400 sm:h-5 sm:w-5" />
                                        ))}
                                    </div>
                                    <p className="mb-4 text-sm leading-relaxed text-white/80 sm:text-base">"{testimonial.testimonial}"</p>
                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        <div>
                                            <div className="text-xs text-white/60 sm:text-sm">{testimonial.location}</div>
                                        </div>
                                        <div className="text-xs font-bold text-amber-300 sm:text-sm">{testimonial.trip}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Footer - Enhanced */}
                <footer className="relative border-t border-white/10 bg-black/70">
                    <motion.div
                        className="mx-auto max-w-7xl px-4 py-12 sm:px-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                            <div className="text-center text-base text-white/70 md:text-left">
                                <div className="font-semibold">Email: hello@cahaya-anbiya.com</div>
                                <div className="mt-2 font-semibold">WhatsApp: +62 812-3456-7890</div>
                                <div className="mt-2 font-semibold">24/7 Customer Support</div>
                            </div>
                            <div className="flex items-center gap-8">
                                {['Instagram', 'TikTok', 'YouTube'].map((social) => (
                                    <motion.a
                                        key={social}
                                        href={`https://${social.toLowerCase()}.com`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-base font-semibold text-white/70 transition-colors hover:text-amber-400"
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {social}
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

            <input
                id={hiddenImageInputId}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f || !imageTargetKey) return;
                    const formData = new FormData();
                    formData.append('key', imageTargetKey);
                    formData.append('image', f);
                    axios
                        .post('/admin/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then((r) => {
                            if (r.data.success && r.data.imageUrl) {
                                const highlightId = imageTargetKey.split('.')[1];
                                const img = document.querySelector(`img[data-highlight-id="${highlightId}"]`) as HTMLImageElement | null;
                                if (img) img.src = r.data.imageUrl;
                                window.dispatchEvent(new CustomEvent('cms:flush-save'));
                            }
                        })
                        .catch(() => {})
                        .finally(() => {
                            setImageTargetKey(null);
                            e.target.value = '';
                        });
                }}
            />

            {editorOpen && (
                <HighlightEditorModal
                    highlight={editorOpen}
                    onClose={() => setEditorOpen(null)}
                    onSave={async (data) => {
                        const updates = [
                            { key: `highlights.${data.id}.title`, content: data.title },
                            { key: `highlights.${data.id}.subtitle`, content: data.subtitle },
                            { key: `highlights.${data.id}.description`, content: data.description },
                            { key: `highlights.${data.id}.category`, content: data.category },
                            { key: `highlights.${data.id}.badge`, content: data.badge },
                        ];
                        await Promise.all(updates.map((u) => axios.post('/admin/update-section', u)));
                        window.dispatchEvent(new CustomEvent('cms:flush-save'));
                        const notification = document.createElement('div');
                        notification.className =
                            'fixed top-20 right-4 z-[99999] rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-5 text-white shadow-2xl';
                        notification.innerHTML =
                            '<div class="flex items-center gap-4"><svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg><div><div class="font-bold text-lg">✅ Successfully Saved!</div><div class="text-sm opacity-90">All changes saved</div></div></div>';
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 3000);
                        setEditorOpen(null);
                    }}
                />
            )}
        </PublicLayout>
    );
}
