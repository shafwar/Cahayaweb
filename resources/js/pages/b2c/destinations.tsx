import { EditableText } from '@/components/cms';
import PlaceholderImage from '@/components/media/placeholder-image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Camera, Check, Clock, Edit3, MapPin, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Enhanced Modal Component
function DestinationEditorModal({
    destination,
    onClose,
    onSave,
}: {
    destination: {
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
    onClose: () => void;
    onSave: (data: { name: string; description: string; image: string; badge: string }) => Promise<void>;
}) {
    const [formData, setFormData] = useState(destination);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        setFormData(destination);
    }, [destination]);

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
                    className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-2 border-blue-500/50 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex-shrink-0 border-b-2 border-white/10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 px-8 py-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="mb-2 text-3xl font-bold text-white">✏️ Edit Destination</h2>
                                <p className="text-base text-gray-300">Update all destination information</p>
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
                                    className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="Destination title"
                                />
                            </div>
                            <div>
                                <label className="mb-3 block text-base font-bold text-gray-200">Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="Short description"
                                />
                            </div>
                            <div>
                                <label className="mb-3 block text-base font-bold text-gray-200">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="e.g., Dubai, UAE"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="mb-3 block text-base font-bold text-gray-200">Duration</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="e.g., 5D4N"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 block text-base font-bold text-gray-200">Price</label>
                                    <input
                                        type="text"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="e.g., Rp 15M"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-3 block text-base font-bold text-gray-200">Highlights</label>
                                <textarea
                                    value={formData.highlights}
                                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                                    rows={3}
                                    className="w-full resize-none rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="Key features"
                                />
                            </div>
                            <div>
                                <label className="mb-3 block text-base font-bold text-gray-200">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full resize-none rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                                        className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="e.g., Premium"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 block text-base font-bold text-gray-200">Badge</label>
                                    <input
                                        type="text"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className="w-full rounded-xl border-2 border-white/20 bg-gray-900/50 px-5 py-3 text-lg text-white transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="e.g., Best Seller"
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
                                            formData.append('key', `destinations.${destination.id}.image`);
                                            formData.append('image', file);
                                            const response = await axios.post('/admin/upload-image', formData, {
                                                headers: { 'Content-Type': 'multipart/form-data' },
                                            });
                                            if (response.data.success && response.data.imageUrl) {
                                                const img = document.querySelector(
                                                    `img[data-destination-id="${destination.id}"]`,
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

export default function Destinations() {
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
        location: string;
        duration: string;
        price: string;
        highlights: string;
        description: string;
        category: string;
        badge: string;
    }>(null);
    const [imageTargetKey, setImageTargetKey] = useState<string | null>(null);
    const hiddenImageInputId = 'destinations-image-replacer';

    useEffect(() => {
        if (editorOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [editorOpen]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    };

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
            title: 'Egypt Wonders',
            subtitle: 'Pyramids & Nile River Expedition',
            image: '/egypt.jpeg',
            duration: '8D7N',
            price: 'Rp 16.5M',
            location: 'Cairo, Luxor, Aswan, Abu Simbel',
            highlights: 'Pyramids of Giza, Nile cruise, ancient temples, Valley of the Kings',
            description:
                'Journey through the cradle of civilization and explore the mysteries of ancient Egypt. Marvel at the Great Pyramids of Giza and cruise the majestic Nile River.',
            features: [
                'Nile River luxury cruise',
                'Pyramids of Giza guided tour',
                'Valley of the Kings exploration',
                'Abu Simbel temple visit',
                'Egyptian Museum tour',
                'Traditional felucca sailing',
            ],
            badge: 'Heritage',
            category: 'Historical',
        },
        {
            id: 4,
            title: 'Dubai Luxury',
            subtitle: 'Modern Wonders & Desert Adventures',
            image: '/dubai1.jpeg',
            duration: '5D4N',
            price: 'Rp 14.2M',
            location: 'Dubai, Abu Dhabi, Desert Safari',
            highlights: 'Burj Khalifa, desert safari, luxury shopping, Ferrari World',
            description:
                'Experience the epitome of luxury and innovation in Dubai. Ascend the iconic Burj Khalifa, shop in world-class malls, and enjoy thrilling desert safaris.',
            features: [
                'Burj Khalifa observation deck access',
                'Desert safari with dinner',
                'Luxury shopping experience',
                'Sheikh Zayed Mosque tour',
                'Ferrari World theme park',
                'Dhow cruise dinner',
            ],
            badge: 'Luxury',
            category: 'Modern',
        },
        {
            id: 5,
            title: 'Oman Adventure',
            subtitle: 'Muscat + Nizwa + Wahiba Sands',
            image: '/oman.jpg',
            duration: '6D5N',
            price: 'Rp 18.9M',
            location: 'Muscat, Nizwa, Wahiba Sands, Salalah',
            highlights: 'Desert camping, ancient forts, wadis, traditional souks',
            description:
                'Explore the hidden gem of the Arabian Peninsula. Discover stunning fjords of Musandam, explore ancient forts in Nizwa, and camp under the stars in Wahiba Sands.',
            features: [
                'Desert camping in Wahiba Sands',
                'Ancient fort exploration',
                'Wadi hiking adventures',
                'Traditional souk visits',
                'Dolphin watching cruise',
                'Mountain village tours',
            ],
            badge: 'Explorer',
            category: 'Adventure',
        },
        {
            id: 6,
            title: 'Qatar Luxury',
            subtitle: 'Doha + The Pearl + Desert Safari',
            image: '/qatar.jpg',
            duration: '5D4N',
            price: 'Rp 16.2M',
            location: 'Doha, The Pearl, Inland Sea, Al Wakrah',
            highlights: 'Museum of Islamic Art, Souq Waqif, desert safari, luxury resorts',
            description:
                'Experience the perfect blend of tradition and modernity in Qatar. Visit the stunning Museum of Islamic Art and explore the vibrant Souq Waqif.',
            features: [
                'Museum of Islamic Art tour',
                'Souq Waqif cultural experience',
                'Desert safari adventure',
                'The Pearl luxury experience',
                'Katara Cultural Village',
                'Luxury resort accommodations',
            ],
            badge: 'Premium',
            category: 'Luxury',
        },
        {
            id: 7,
            title: 'Kuwait Heritage',
            subtitle: 'Kuwait City + Failaka Island',
            image: '/kuwait.jpg',
            duration: '4D3N',
            price: 'Rp 12.8M',
            location: 'Kuwait City, Failaka Island, Al Jahra',
            highlights: 'Kuwait Towers, Grand Mosque, island visit, cultural heritage',
            description:
                'Discover the rich heritage and modern charm of Kuwait. Visit the iconic Kuwait Towers and explore the magnificent Grand Mosque.',
            features: [
                'Kuwait Towers visit',
                'Grand Mosque tour',
                'Failaka Island exploration',
                'Traditional dhow boat ride',
                'Cultural heritage tours',
                'Modern city exploration',
            ],
            badge: 'Heritage',
            category: 'Cultural',
        },
        {
            id: 8,
            title: 'Bahrain Pearl',
            subtitle: "Manama + Qal'at al-Bahrain",
            image: '/bahrain.jpg',
            duration: '4D3N',
            price: 'Rp 11.5M',
            location: "Manama, Qal'at al-Bahrain, Al Muharraq",
            highlights: 'Pearl diving, ancient forts, Formula 1 circuit, traditional culture',
            description:
                'Experience the pearl of the Gulf with its rich history and modern attractions. Explore ancient forts and learn about traditional pearl diving.',
            features: [
                'Ancient fort exploration',
                'Pearl diving experience',
                'Formula 1 circuit tour',
                'Traditional souk visits',
                'Cultural heritage tours',
                'Modern entertainment',
            ],
            badge: 'Culture',
            category: 'Heritage',
        },
        {
            id: 9,
            title: 'Jordan Discovery',
            subtitle: 'Wadi Rum & Petra Adventure',
            image: '/jordan.jpeg',
            duration: '7D6N',
            price: 'Rp 17.2M',
            location: 'Amman, Petra, Wadi Rum, Dead Sea',
            highlights: 'Petra ancient city, desert camping, Dead Sea, biblical sites',
            description:
                'Journey through the ancient wonders of Jordan. Explore the magnificent rock-cut city of Petra and camp under the stars in Wadi Rum desert.',
            features: [
                'Petra ancient city exploration',
                'Wadi Rum desert camping',
                'Dead Sea floating experience',
                'Biblical site visits',
                'Traditional Bedouin experience',
                'Luxury desert accommodations',
            ],
            badge: 'Adventure',
            category: 'Historical',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Destinations - Cahaya Anbiya Travel" />

            <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
                {/* Hero Section - Compact */}
                <section className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-10">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.1),transparent_70%)] blur-2xl" style={{ willChange: 'auto' }} />
                        <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.1),transparent_70%)] blur-2xl" style={{ willChange: 'auto' }} />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="mb-8 text-center md:mb-10"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="mb-4 inline-block"
                            >
                                <div className="rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-4 py-1.5 shadow-xl">
                                    <span className="text-xs font-semibold tracking-wider text-amber-200 uppercase sm:text-sm">
                                        ✨ Explore Dream Destinations
                                    </span>
                                </div>
                            </motion.div>

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
                        </motion.div>

                        {/* Destinations Grid - Compact */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-100px' }}
                            className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
                        >
                            {destinations.map((destination) => (
                                <Dialog key={destination.id}>
                                    <DialogTrigger asChild>
                                        <motion.article
                                            variants={cardVariants}
                                            whileHover={{ scale: 1.03, y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
                                            className="group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 shadow-xl transition-all duration-300"
                                        >
                                            <div className="relative aspect-video overflow-hidden">
                                                <img
                                                    src={destination.image}
                                                    alt={destination.title}
                                                    data-destination-id={destination.id}
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

                                                <div className="absolute top-0 right-0 z-10">
                                                    <div className="flex h-9 items-center rounded-bl-xl bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg sm:px-4 sm:text-sm">
                                                        <EditableText
                                                            sectionKey={`destinations.${destination.id}.badge`}
                                                            value={destination.badge}
                                                            tag="span"
                                                            className="text-white"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="absolute top-3 left-3">
                                                    <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white shadow-lg sm:text-sm">
                                                        {destination.category}
                                                    </span>
                                                </div>

                                                {editMode && (
                                                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setImageTargetKey(`destinations.${destination.id}.image`);
                                                                document.getElementById(hiddenImageInputId)?.click();
                                                            }}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-gray-800 shadow-xl ring-2 ring-white/40 transition-all hover:scale-105"
                                                            title="Replace image"
                                                        >
                                                            <Camera className="h-5 w-5" strokeWidth={2.5} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditorOpen({
                                                                    id: destination.id,
                                                                    title: destination.title,
                                                                    subtitle: destination.subtitle,
                                                                    location: destination.location,
                                                                    duration: destination.duration,
                                                                    price: destination.price,
                                                                    highlights: destination.highlights,
                                                                    description: destination.description,
                                                                    category: destination.category,
                                                                    badge: destination.badge,
                                                                });
                                                            }}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:scale-110"
                                                            title="Edit details"
                                                        >
                                                            <Edit3 className="h-5 w-5" strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            </div>

                                            <div className="p-5 sm:p-6">
                                                <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-amber-300 sm:text-xl">
                                                    <EditableText
                                                        sectionKey={`destinations.${destination.id}.title`}
                                                        value={destination.title}
                                                        tag="span"
                                                    />
                                                </h3>
                                                <p className="mb-3 text-sm leading-relaxed text-white/80 sm:text-base">
                                                    <EditableText
                                                        sectionKey={`destinations.${destination.id}.subtitle`}
                                                        value={destination.subtitle}
                                                        tag="span"
                                                    />
                                                </p>

                                                <div className="mb-3 flex items-center justify-between">
                                                    <div className="text-lg font-bold text-amber-300 sm:text-xl">
                                                        <EditableText
                                                            sectionKey={`destinations.${destination.id}.price`}
                                                            value={destination.price}
                                                            tag="span"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70 sm:text-sm">
                                                        <Clock className="h-4 w-4" />
                                                        <span>
                                                            <EditableText
                                                                sectionKey={`destinations.${destination.id}.duration`}
                                                                value={destination.duration}
                                                                tag="span"
                                                            />
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-white/70 sm:text-sm">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>
                                                        <EditableText
                                                            sectionKey={`destinations.${destination.id}.location`}
                                                            value={destination.location}
                                                            tag="span"
                                                        />
                                                    </span>
                                                </div>

                                                <p className="mb-4 line-clamp-2 text-xs text-white/70 sm:text-sm">
                                                    <EditableText
                                                        sectionKey={`destinations.${destination.id}.highlights`}
                                                        value={destination.highlights}
                                                        tag="span"
                                                    />
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-bold text-amber-300 transition-transform group-hover:scale-105 sm:text-base">
                                                        View Details →
                                                    </div>
                                                    <div className="text-xs text-white/60 sm:text-sm">{destination.features.length} features</div>
                                                </div>
                                            </div>

                                            <div className="h-0.5 origin-left scale-x-0 transform bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 shadow-md transition-transform duration-500 group-hover:scale-x-100" />
                                        </motion.article>
                                    </DialogTrigger>

                                    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl border-2 border-white/20 bg-gradient-to-br from-black/98 to-slate-900/98 shadow-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-3xl font-bold text-white">
                                                <EditableText
                                                    sectionKey={`destinations.${destination.id}.title`}
                                                    value={destination.title}
                                                    tag="span"
                                                />
                                            </DialogTitle>
                                            <DialogDescription className="text-lg leading-relaxed text-white/80">
                                                <EditableText
                                                    sectionKey={`destinations.${destination.id}.description`}
                                                    value={destination.description}
                                                    tag="span"
                                                />
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-8 space-y-6">
                                            <div className="rounded-2xl border-2 border-white/20 bg-white/5 p-8 shadow-xl">
                                                <h4 className="mb-5 text-xl font-bold text-amber-300">Package Details</h4>
                                                <div className="grid grid-cols-2 gap-5 text-base text-white/90">
                                                    <div>
                                                        <strong>Location:</strong>{' '}
                                                        <EditableText
                                                            sectionKey={`destinations.${destination.id}.location`}
                                                            value={destination.location}
                                                            tag="span"
                                                        />
                                                    </div>
                                                    <div>
                                                        <strong>Duration:</strong>{' '}
                                                        <EditableText
                                                            sectionKey={`destinations.${destination.id}.duration`}
                                                            value={destination.duration}
                                                            tag="span"
                                                        />
                                                    </div>
                                                    <div>
                                                        <strong>Price:</strong>{' '}
                                                        <EditableText
                                                            sectionKey={`destinations.${destination.id}.price`}
                                                            value={destination.price}
                                                            tag="span"
                                                        />{' '}
                                                        per person
                                                    </div>
                                                    <div>
                                                        <strong>Category:</strong> {destination.category}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-2xl border-2 border-white/20 bg-white/5 p-8 shadow-xl">
                                                <h4 className="mb-5 text-xl font-bold text-amber-300">Highlights</h4>
                                                <p className="text-base leading-relaxed text-white/90">
                                                    <EditableText
                                                        sectionKey={`destinations.${destination.id}.highlights`}
                                                        value={destination.highlights}
                                                        tag="span"
                                                    />
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border-2 border-white/20 bg-white/5 p-8 shadow-xl">
                                                <h4 className="mb-5 text-xl font-bold text-amber-300">What's Included</h4>
                                                <ul className="space-y-3">
                                                    {destination.features.map((feature, index) => (
                                                        <li key={index} className="flex items-center gap-3 text-base text-white/90">
                                                            <Check className="h-6 w-6 flex-shrink-0 text-green-400" />
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="flex gap-4">
                                                <motion.a
                                                    href="https://wa.me/6281234567890"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-center text-lg font-bold text-white shadow-2xl transition-all hover:from-amber-400 hover:to-orange-400"
                                                >
                                                    Book Now
                                                </motion.a>
                                                <motion.a
                                                    href="https://wa.me/6281234567890"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex-1 rounded-xl border-2 border-amber-500 px-8 py-4 text-center text-lg font-bold text-amber-300 transition-all hover:bg-amber-500 hover:text-white"
                                                >
                                                    Ask Questions
                                                </motion.a>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ))}
                        </motion.div>

                        {/* CTA Section - Enhanced */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="mt-20 text-center"
                        >
                            <div className="mb-8 inline-flex items-center rounded-full border-2 border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-8 py-4 shadow-xl">
                                <span className="text-base font-bold text-amber-200">
                                    <EditableText sectionKey="destinations.cta.badge" value="✨ Custom Packages Available" tag="span" />
                                </span>
                            </div>
                            <h3 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                                <EditableText sectionKey="destinations.cta.title" value="Can't Find the Perfect Destination?" tag="span" />
                            </h3>
                            <p className="mx-auto mb-10 max-w-3xl text-xl text-white/80">
                                <EditableText
                                    sectionKey="destinations.cta.description"
                                    value="Our travel experts are here to create the perfect custom itinerary just for you. Whether you're looking for a spiritual journey, cultural adventure, or luxury escape."
                                    tag="span"
                                />
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                <motion.a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    whileHover={{ scale: 1.05, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all hover:from-amber-400 hover:to-orange-400"
                                >
                                    Free Consultation
                                    <ArrowRight className="h-6 w-6" />
                                </motion.a>
                                <motion.a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    whileHover={{ scale: 1.05, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-amber-500 px-10 py-5 text-lg font-bold text-amber-300 transition-all hover:bg-amber-500 hover:text-white"
                                >
                                    Custom Package
                                    <Plus className="h-6 w-6" />
                                </motion.a>
                            </div>
                        </motion.div>
                    </div>
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
                    setSaving(true);
                    axios
                        .post('/admin/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then((r) => {
                            if (r.data.success && r.data.imageUrl) {
                                const destId = imageTargetKey.split('.')[1];
                                const img = document.querySelector(`img[data-destination-id="${destId}"]`) as HTMLImageElement | null;
                                if (img) img.src = r.data.imageUrl;
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

            {editorOpen && (
                <DestinationEditorModal
                    destination={editorOpen}
                    onClose={() => setEditorOpen(null)}
                    onSave={async (data) => {
                        const updates = [
                            { key: `destinations.${data.id}.title`, content: data.title },
                            { key: `destinations.${data.id}.subtitle`, content: data.subtitle },
                            { key: `destinations.${data.id}.location`, content: data.location },
                            { key: `destinations.${data.id}.duration`, content: data.duration },
                            { key: `destinations.${data.id}.price`, content: data.price },
                            { key: `destinations.${data.id}.highlights`, content: data.highlights },
                            { key: `destinations.${data.id}.description`, content: data.description },
                            { key: `destinations.${data.id}.category`, content: data.category },
                            { key: `destinations.${data.id}.badge`, content: data.badge },
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
