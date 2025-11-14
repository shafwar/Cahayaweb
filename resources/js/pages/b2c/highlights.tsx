import { EditableText } from '@/components/cms';
import PlaceholderImage from '@/components/media/placeholder-image';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Edit3, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Standalone Modal Component - Rendered via Portal (GUARANTEED CENTERED!)
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
    onSave: (data: any) => Promise<void>;
}) {
    const [formData, setFormData] = useState(highlight);
    const [isSaving, setIsSaving] = useState(false);

    // Lock body scroll when modal is mounted
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Update form data when highlight prop changes
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

    // Render modal using Portal - GUARANTEED to be at document root!
    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex-shrink-0 px-6 py-5 border-b border-white/10 bg-gradient-to-r from-amber-600/20 to-orange-600/20">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">✨ Edit Highlight</h2>
                                <p className="text-sm text-gray-400">Update highlight information</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:rotate-90"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                    placeholder="Highlight title"
                                />
                            </div>

                            {/* Subtitle */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                    placeholder="Short description"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all resize-none"
                                    placeholder="Detailed description"
                                />
                            </div>

                            {/* Category & Badge */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                        placeholder="e.g., Premium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Badge</label>
                                    <input
                                        type="text"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                        placeholder="e.g., Best Seller"
                                    />
                                </div>
                            </div>

                            {/* Image Replacement */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Replace Image</label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white text-sm file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-amber-500 file:to-orange-500 file:text-white file:font-semibold file:cursor-pointer hover:file:from-amber-400 hover:file:to-orange-400 transition-all"
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
                                                // Update image in DOM
                                                const img = document.querySelector(
                                                    `img[data-highlight-id="${highlight.id}"]`
                                                ) as HTMLImageElement | null;
                                                if (img) {
                                                    img.src = response.data.imageUrl;
                                                }

                                                // Show success notification
                                                const notification = document.createElement('div');
                                                notification.className = 'fixed top-20 right-4 z-[99999] rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 text-white shadow-2xl';
                                                notification.innerHTML = `
                                                    <div class="flex items-center gap-3">
                                                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                        <div>
                                                            <div class="font-bold">📸 Image Updated!</div>
                                                            <div class="text-sm opacity-90">Image saved successfully</div>
                                                        </div>
                                                    </div>
                                                `;
                                                document.body.appendChild(notification);
                                                setTimeout(() => notification.remove(), 3000);
                                            }
                                        } catch (error) {
                                            console.error('Image upload failed:', error);
                                            alert('Failed to upload image');
                                        } finally {
                                            setIsSaving(false);
                                            e.target.value = ''; // Reset input
                                        }
                                    }}
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Supported formats: JPEG, PNG, WebP • Max 5MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 px-6 py-4 border-t border-white/10 bg-gray-900/50">
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 border border-white/10 hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
        document.body
    );
}

export default function Highlights() {
    // Listen to global edit mode flag from provider
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
    const [saving, setSaving] = useState(false);
    const [imageTargetKey, setImageTargetKey] = useState<string | null>(null);
    const hiddenImageInputId = 'highlights-image-replacer';

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

    // Comprehensive highlights with travel-related content
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
            stats: {
                travelers: '5000+',
                satisfaction: '98%',
                experience: '15+ years',
            },
            badge: 'Featured',
            badgeColor: 'bg-gradient-to-r from-secondary to-accent',
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
            stats: {
                travelers: '3200+',
                satisfaction: '96%',
                experience: '12+ years',
            },
            badge: 'Popular',
            badgeColor: 'bg-gradient-to-r from-orange-500 to-red-500',
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
            stats: {
                travelers: '2800+',
                satisfaction: '95%',
                experience: '10+ years',
            },
            badge: 'Heritage',
            badgeColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
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
            stats: {
                travelers: '4500+',
                satisfaction: '97%',
                experience: '14+ years',
            },
            badge: 'Premium',
            badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
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
            stats: {
                travelers: '1800+',
                satisfaction: '99%',
                experience: '8+ years',
            },
            badge: 'Explorer',
            badgeColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
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
            stats: {
                travelers: '2200+',
                satisfaction: '94%',
                experience: '9+ years',
            },
            badge: 'Premium',
            badgeColor: 'bg-gradient-to-r from-secondary to-primary',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Highlights - Cahaya Anbiya Wisata" />

            <div className="w-full bg-black">
                <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
                    {/* Enhanced Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="mb-12 text-center md:mb-16"
                    >
                        <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl lg:text-7xl">
                            <EditableText
                                sectionKey="highlights.header.title"
                                value="Travel Highlights & Experiences"
                                tag="span"
                                className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent"
                            />
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-gray-300 md:text-xl">
                            <EditableText
                                sectionKey="highlights.header.subtitle"
                                value="Discover our most popular and unforgettable travel experiences. From spiritual journeys to luxury adventures, each highlight represents the best of what we offer to create lasting memories for our travelers."
                                tag="span"
                            />
                        </p>
                        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                <span>
                                    <EditableText sectionKey="highlights.header.badge1" value="Premium Experiences" tag="span" />
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-secondary"></div>
                                <span>
                                    <EditableText sectionKey="highlights.header.badge2" value="Expert Guidance" tag="span" />
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-secondary"></div>
                                <span>
                                    <EditableText sectionKey="highlights.header.badge3" value="Unforgettable Memories" tag="span" />
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Highlights Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10"
                        style={{ gridAutoRows: '1fr' }}
                    >
                        {highlights.map((highlight) => (
                            <motion.article
                                key={highlight.id}
                                variants={cardVariants}
                                whileHover={{
                                    scale: 1.03,
                                    y: -8,
                                    transition: { duration: 0.3, ease: 'easeOut' },
                                }}
                                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-white/15 bg-black/50 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                            >
                                {/* Highlight Image */}
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={highlight.image}
                                        alt={highlight.title}
                                        data-highlight-id={highlight.id}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                            if (nextElement) {
                                                nextElement.style.display = 'block';
                                            }
                                        }}
                                    />
                                    <PlaceholderImage className="hidden h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                            {highlight.category}
                                        </span>
                                    </div>

                                    {/* Edit Mode Controls - NEW ICONS! */}
                                    {editMode && (
                                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                            {/* Camera Icon - Image Replacement */}
                                            <button
                                                onClick={() => {
                                                    setImageTargetKey(`highlights.${highlight.id}.image`);
                                                    const el = document.getElementById(hiddenImageInputId) as HTMLInputElement | null;
                                                    el?.click();
                                                }}
                                                className="group/icon flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-800 shadow-lg ring-2 ring-white/20 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:shadow-xl"
                                                title="Replace image"
                                            >
                                                <Camera className="h-4 w-4" />
                                            </button>
                                            
                                            {/* Edit3 Icon - Edit Details */}
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
                                                className="group/icon flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl ring-2 ring-blue-400/50 backdrop-blur-sm transition-all hover:scale-110 hover:rotate-12 hover:shadow-2xl"
                                                title="Edit details"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </div>

                                {/* Highlight Content */}
                                <div className="flex flex-1 flex-col p-6">
                                    <h3 className="mb-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-amber-300 md:text-2xl">
                                        <EditableText sectionKey={`highlights.${highlight.id}.title`} value={highlight.title} tag="span" />
                                    </h3>
                                    <p className="mb-3 text-sm font-medium text-amber-300">
                                        <EditableText sectionKey={`highlights.${highlight.id}.subtitle`} value={highlight.subtitle} tag="span" />
                                    </p>

                                    <p className="mb-4 text-sm leading-relaxed text-gray-300">
                                        <EditableText
                                            sectionKey={`highlights.${highlight.id}.description`}
                                            value={highlight.description}
                                            tag="span"
                                        />
                                    </p>

                                    {/* Statistics */}
                                    <div className="mb-4 grid grid-cols-3 gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-amber-300">
                                                <EditableText
                                                    sectionKey={`highlights.${highlight.id}.stats.travelers`}
                                                    value={highlight.stats.travelers}
                                                    tag="span"
                                                />
                                            </div>
                                            <div className="text-xs text-gray-400">Travelers</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-amber-300">
                                                <EditableText
                                                    sectionKey={`highlights.${highlight.id}.stats.satisfaction`}
                                                    value={highlight.stats.satisfaction}
                                                    tag="span"
                                                />
                                            </div>
                                            <div className="text-xs text-gray-400">Satisfaction</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-amber-300">
                                                <EditableText
                                                    sectionKey={`highlights.${highlight.id}.stats.experience`}
                                                    value={highlight.stats.experience}
                                                    tag="span"
                                                />
                                            </div>
                                            <div className="text-xs text-gray-400">Experience</div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-4">
                                        <h4 className="mb-2 text-sm font-semibold text-white">Key Features:</h4>
                                        <ul className="grid grid-cols-1 gap-1 text-xs text-gray-300">
                                            {highlight.features.map((feature, index) => (
                                                <li key={index} className="flex items-center space-x-2">
                                                    <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
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

                                    {/* CTA Button */}
                                    <div className="mt-auto flex items-center justify-between">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition-all duration-300 hover:shadow-lg"
                                        >
                                            Learn More
                                        </motion.button>
                                        <div className="text-xs text-gray-400">{highlight.features.length} features included</div>
                                    </div>
                                </div>

                                {/* Bottom Accent Line */}
                                <div className="h-1 origin-left scale-x-0 transform bg-gradient-to-r from-amber-300 to-orange-400 transition-transform duration-500 group-hover:scale-x-100" />
                            </motion.article>
                        ))}
                    </motion.div>

                    {/* Call to Action Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-16 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 p-8 text-center backdrop-blur-sm sm:p-12"
                    >
                        <div className="mx-auto max-w-3xl">
                            <h3 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
                                <EditableText sectionKey="highlights.cta.title" value="Ready to Experience These Highlights?" tag="span" />
                            </h3>
                            <p className="mb-6 text-muted-foreground">
                                <EditableText
                                    sectionKey="highlights.cta.description"
                                    value="Join thousands of satisfied travelers who have experienced the magic of our carefully curated destinations. Let us help you create unforgettable memories with our expert guidance and premium travel experiences."
                                    tag="span"
                                />
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <motion.a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-lg sm:px-8 sm:py-4 sm:text-base"
                                >
                                    Start Your Journey
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </motion.a>
                                <motion.a
                                    href="/destinations"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center justify-center rounded-lg border border-primary px-6 py-3 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground sm:px-8 sm:py-4 sm:text-base"
                                >
                                    View All Destinations
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Testimonials Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-16"
                    >
                        <h3 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
                            <EditableText sectionKey="highlights.testimonials.title" value="What Our Travelers Say" tag="span" />
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="rounded-xl border border-border bg-card p-6 shadow-md"
                                >
                                    <div className="mb-4 flex items-center space-x-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        "
                                        <EditableText
                                            sectionKey={`highlights.testimonials.${index}.testimonial`}
                                            value={testimonial.testimonial}
                                            tag="span"
                                        />
                                        "
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-foreground">
                                                <EditableText
                                                    sectionKey={`highlights.testimonials.${index}.name`}
                                                    value={testimonial.name}
                                                    tag="span"
                                                />
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                <EditableText
                                                    sectionKey={`highlights.testimonials.${index}.location`}
                                                    value={testimonial.location}
                                                    tag="span"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-xs text-primary">
                                            <EditableText sectionKey={`highlights.testimonials.${index}.trip`} value={testimonial.trip} tag="span" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Enhanced Footer */}
                <footer className="border-t border-white/10 bg-black">
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
            </div>

            {/* Hidden File Input for Image Replacement */}
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
                    setSaving(true);
                    axios
                        .post('/admin/upload-image', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        })
                        .then((r) => {
                            if (r.data.success && r.data.imageUrl) {
                                const highlightId = imageTargetKey.split('.')[1];
                                const img = document.querySelector(`img[data-highlight-id="${highlightId}"]`) as HTMLImageElement | null;
                                if (img) {
                                    img.src = r.data.imageUrl;
                                }
                                window.dispatchEvent(new CustomEvent('cms:flush-save'));
                            }
                        })
                        .catch(() => {})
                        .finally(() => {
                            setSaving(false);
                            setImageTargetKey(null);
                            e.target.value = '';
                        });
                }}
            />

            {/* Portal-Based Modal - GUARANTEED Centered & Perfect! */}
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
                        
                        // Success notification
                        const notification = document.createElement('div');
                        notification.className = 'fixed top-20 right-4 z-[99999] rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-2xl';
                        notification.innerHTML = `
                            <div class="flex items-center gap-3">
                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <div>
                                    <div class="font-bold">✅ Berhasil Disimpan!</div>
                                    <div class="text-sm opacity-90">Semua perubahan tersimpan</div>
                                </div>
                            </div>
                        `;
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 3000);
                        
                        setEditorOpen(null);
                    }}
                />
            )}
        </PublicLayout>
    );
}
