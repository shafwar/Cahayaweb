import { EditableText } from '@/components/cms';
import PlaceholderImage from '@/components/media/placeholder-image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Edit3, ImagePlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Standalone Modal Component - Rendered via Portal (GUARANTEED CENTERED!)
function DestinationEditorModal({ 
    destination, 
    onClose, 
    onSave 
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
    onSave: (data: any) => Promise<void>;
}) {
    const [formData, setFormData] = useState(destination);
    const [isSaving, setIsSaving] = useState(false);

    // Lock body scroll when modal is mounted
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Update form data when destination prop changes
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
                    className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border-2 border-blue-500/50 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex-shrink-0 px-6 py-5 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">✏️ Edit Destination</h2>
                                <p className="text-sm text-gray-400">Update all destination information</p>
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
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="Destination title"
                                />
                            </div>

                            {/* Subtitle */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="Short description"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="e.g., Dubai, UAE"
                                />
                            </div>

                            {/* Duration & Price */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Duration</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="e.g., 5D4N"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Price</label>
                                    <input
                                        type="text"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="e.g., Rp 15M"
                                    />
                                </div>
                            </div>

                            {/* Highlights */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Highlights</label>
                                <textarea
                                    value={formData.highlights}
                                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                                    placeholder="Key features and highlights"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
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
                                        className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="e.g., Premium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Badge</label>
                                    <input
                                        type="text"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
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
                                            formData.append('key', `destinations.${destination.id}.image`);
                                            formData.append('image', file);

                                            const response = await axios.post('/admin/upload-image', formData, {
                                                headers: { 'Content-Type': 'multipart/form-data' },
                                            });

                                            if (response.data.success && response.data.imageUrl) {
                                                // Update image in DOM
                                                const img = document.querySelector(
                                                    `img[data-destination-id="${destination.id}"]`
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

export default function Destinations() {
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
        location: string;
        duration: string;
        price: string;
        highlights: string;
        description: string;
        category: string;
        badge: string;
    }>(null);
    const [saving, setSaving] = useState(false);
    const [imageTargetKey, setImageTargetKey] = useState<string | null>(null);
    const hiddenImageInputId = 'destinations-image-replacer';

    // Lock body scroll when modal is open
    useEffect(() => {
        if (editorOpen) {
            // Disable body scroll when modal opens
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable body scroll when modal closes
            document.body.style.overflow = '';
        }
        
        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [editorOpen]);

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

    return (
        <PublicLayout>
            <Head title="Destinations - Cahaya Anbiya Wisata" />

            {/* Dark theme wrapper - full width background */}
            <div className="w-full bg-black">
                <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
                    {/* Enhanced Header Section with Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="mb-12 text-center md:mb-16"
                    >
                        <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl lg:text-7xl">
                            <EditableText
                                sectionKey="destinations.header.title"
                                value="Discover Your Dream Destinations"
                                tag="span"
                                className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent"
                            />
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-gray-300 md:text-xl">
                            <EditableText
                                sectionKey="destinations.header.subtitle"
                                value="Embark on extraordinary journeys across the Middle East and beyond. From spiritual pilgrimages to luxury adventures, we curate unforgettable experiences that connect you with the world's most captivating destinations."
                                tag="span"
                            />
                        </p>
                        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                <span>9 Premium Destinations</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-secondary"></div>
                                <span>Curated Experiences</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-accent"></div>
                                <span>Professional Service</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Enhanced Destinations Grid */}
                    <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                        {[
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
                                    "Embark on a profound spiritual journey to the holiest sites in Islam. Experience the sacred atmosphere of Makkah and Madinah with our premium Umrah packages. Visit the Grand Mosque, perform Tawaf around the Kaaba, and pray at the Prophet's Mosque. Our packages include luxury accommodations, direct flights, and expert spiritual guidance.",
                                features: [
                                    'Luxury 5-star hotel accommodations',
                                    'Direct flights from Indonesia',
                                    'Professional spiritual guide',
                                    'VIP access to holy sites',
                                    'Comprehensive travel insurance',
                                    'Daily spiritual programs',
                                ],
                                badge: 'Premium',
                                badgeColor: 'bg-gradient-to-r from-primary to-secondary',
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
                                    'Discover the perfect blend of East and West in Turkey. Explore the magnificent Hagia Sophia and Blue Mosque in Istanbul, soar above the fairy chimneys of Cappadocia in a hot air balloon, and relax in the thermal springs of Pamukkale. Experience rich history, vibrant culture, and breathtaking landscapes.',
                                features: [
                                    'Hot air balloon ride in Cappadocia',
                                    'Guided tours of historical sites',
                                    'Luxury hotel accommodations',
                                    'Traditional Turkish bath experience',
                                    'Bosphorus cruise in Istanbul',
                                    'Local cuisine tasting tours',
                                ],
                                badge: 'Adventure',
                                badgeColor: 'bg-gradient-to-r from-orange-500 to-red-500',
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
                                    'Journey through the cradle of civilization and explore the mysteries of ancient Egypt. Marvel at the Great Pyramids of Giza, cruise the majestic Nile River, discover the Valley of the Kings, and visit the magnificent temples of Luxor and Abu Simbel. Experience the magic of pharaonic history.',
                                features: [
                                    'Nile River luxury cruise',
                                    'Pyramids of Giza guided tour',
                                    'Valley of the Kings exploration',
                                    'Abu Simbel temple visit',
                                    'Egyptian Museum tour',
                                    'Traditional felucca sailing',
                                ],
                                badge: 'Heritage',
                                badgeColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
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
                                    'Experience the epitome of luxury and innovation in Dubai. Ascend the iconic Burj Khalifa, shop in world-class malls, enjoy thrilling desert safaris, and visit the stunning Sheikh Zayed Mosque in Abu Dhabi. Discover the perfect blend of modern luxury and traditional Arabian hospitality.',
                                features: [
                                    'Burj Khalifa observation deck access',
                                    'Desert safari with dinner',
                                    'Luxury shopping experience',
                                    'Sheikh Zayed Mosque tour',
                                    'Ferrari World theme park',
                                    'Dhow cruise dinner',
                                ],
                                badge: 'Luxury',
                                badgeColor: 'bg-gradient-to-r from-primary to-secondary',
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
                                    'Explore the hidden gem of the Arabian Peninsula. Discover the stunning fjords of Musandam, explore ancient forts in Nizwa, camp under the stars in Wahiba Sands, and experience the monsoon season in Salalah. Oman offers authentic Arabian experiences away from the crowds.',
                                features: [
                                    'Desert camping in Wahiba Sands',
                                    'Ancient fort exploration',
                                    'Wadi hiking adventures',
                                    'Traditional souk visits',
                                    'Dolphin watching cruise',
                                    'Mountain village tours',
                                ],
                                badge: 'Explorer',
                                badgeColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
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
                                    'Experience the perfect blend of tradition and modernity in Qatar. Visit the stunning Museum of Islamic Art, explore the vibrant Souq Waqif, enjoy luxury at The Pearl, and experience thrilling desert adventures. Discover why Qatar is becoming a premier travel destination.',
                                features: [
                                    'Museum of Islamic Art tour',
                                    'Souq Waqif cultural experience',
                                    'Desert safari adventure',
                                    'The Pearl luxury experience',
                                    'Katara Cultural Village',
                                    'Luxury resort accommodations',
                                ],
                                badge: 'Premium',
                                badgeColor: 'bg-gradient-to-r from-accent to-secondary',
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
                                    'Discover the rich heritage and modern charm of Kuwait. Visit the iconic Kuwait Towers, explore the magnificent Grand Mosque, take a boat trip to historic Failaka Island, and experience the vibrant culture of this unique Gulf nation. Perfect for a short but enriching getaway.',
                                features: [
                                    'Kuwait Towers visit',
                                    'Grand Mosque tour',
                                    'Failaka Island exploration',
                                    'Traditional dhow boat ride',
                                    'Cultural heritage tours',
                                    'Modern city exploration',
                                ],
                                badge: 'Heritage',
                                badgeColor: 'bg-gradient-to-r from-red-500 to-pink-500',
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
                                    'Experience the pearl of the Gulf with its rich history and modern attractions. Explore ancient forts, learn about traditional pearl diving, visit the Formula 1 circuit, and discover the vibrant culture of Bahrain. A perfect blend of history, culture, and modern entertainment.',
                                features: [
                                    'Ancient fort exploration',
                                    'Pearl diving experience',
                                    'Formula 1 circuit tour',
                                    'Traditional souk visits',
                                    'Cultural heritage tours',
                                    'Modern entertainment',
                                ],
                                badge: 'Culture',
                                badgeColor: 'bg-gradient-to-r from-secondary to-primary',
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
                                    'Journey through the ancient wonders of Jordan. Explore the magnificent rock-cut city of Petra, camp under the stars in Wadi Rum desert, float in the mineral-rich Dead Sea, and visit biblical sites. Experience the perfect blend of history, adventure, and natural wonders.',
                                features: [
                                    'Petra ancient city exploration',
                                    'Wadi Rum desert camping',
                                    'Dead Sea floating experience',
                                    'Biblical site visits',
                                    'Traditional Bedouin experience',
                                    'Luxury desert accommodations',
                                ],
                                badge: 'Adventure',
                                badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
                                category: 'Historical',
                            },
                        ].map((destination) => (
                            <Dialog key={destination.id}>
                                <DialogTrigger asChild>
                                    <motion.article
                                        variants={cardVariants}
                                        whileHover={{
                                            scale: 1.03,
                                            y: -8,
                                            transition: {
                                                duration: 0.3,
                                                ease: 'easeOut',
                                            },
                                        }}
                                        className="group cursor-pointer overflow-hidden rounded-xl border border-white/15 bg-black/50 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-500 ease-in-out hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                                    >
                                        {/* Enhanced Image/Thumbnail */}
                                        <div className="relative aspect-video overflow-hidden">
                                            <img
                                                src={destination.image}
                                                alt={destination.title}
                                                data-destination-id={destination.id}
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

                                            {/* Enhanced Badge - Premium Badge di pojok kanan atas */}
                                            <div className="absolute top-0 right-0 z-10">
                                                <div className="flex h-10 items-center justify-center rounded-bl-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-1 text-sm font-semibold text-white shadow-md">
                                                    <EditableText
                                                        sectionKey={`destinations.${destination.id}.badge`}
                                                        value={destination.badge}
                                                        tag="span"
                                                        className="text-white"
                                                    />
                                                </div>
                                            </div>

                                            {/* Category Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className="rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                                    {destination.category}
                                                </span>
                                            </div>

                                            {/* Edit Mode Controls */}
                                            {editMode && (
                                                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                                    {/* Replace Image Button - Camera Icon */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setImageTargetKey(`destinations.${destination.id}.image`);
                                                            const el = document.getElementById(hiddenImageInputId) as HTMLInputElement | null;
                                                            el?.click();
                                                        }}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 backdrop-blur-sm text-gray-800 shadow-xl ring-2 ring-white/40 transition-all hover:bg-white hover:scale-105 hover:shadow-2xl"
                                                        title="Replace image - Click to upload new photo"
                                                    >
                                                        <Camera className="h-5 w-5" strokeWidth={2.5} />
                                                    </button>
                                                    
                                                    {/* Edit Details Button - Comprehensive Editor */}
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
                                                        className="group/edit inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 backdrop-blur-sm text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:from-blue-600 hover:to-indigo-700 hover:scale-110 hover:shadow-2xl hover:ring-blue-300"
                                                        title="Edit all details - Title, price, description, location, highlights, etc"
                                                    >
                                                        <Edit3 className="h-5 w-5 transition-transform group-hover/edit:rotate-12" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Enhanced Hover Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </div>

                                        {/* Enhanced Card Content */}
                                        <div className="p-5 md:p-6">
                                            <h3 className="mb-2 text-lg font-bold text-white transition-colors duration-300 group-hover:text-amber-300 md:text-xl">
                                                <EditableText
                                                    sectionKey={`destinations.${destination.id}.title`}
                                                    value={destination.title}
                                                    tag="span"
                                                />
                                            </h3>
                                            <p className="mb-3 text-sm leading-relaxed text-gray-300">
                                                <EditableText
                                                    sectionKey={`destinations.${destination.id}.subtitle`}
                                                    value={destination.subtitle}
                                                    tag="span"
                                                />
                                            </p>

                                            {/* Price and Duration */}
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="text-lg font-bold text-amber-300">
                                                    <EditableText
                                                        sectionKey={`destinations.${destination.id}.price`}
                                                        value={destination.price}
                                                        tag="span"
                                                    />
                                                </div>
                                                <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <span>
                                                        <EditableText
                                                            sectionKey={`destinations.${destination.id}.duration`}
                                                            value={destination.duration}
                                                            tag="span"
                                                        />
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div className="mb-3 flex items-center space-x-1 text-xs text-gray-400">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                <span>
                                                    <EditableText
                                                        sectionKey={`destinations.${destination.id}.location`}
                                                        value={destination.location}
                                                        tag="span"
                                                    />
                                                </span>
                                            </div>

                                            {/* Highlights */}
                                            <p className="mb-4 line-clamp-2 text-xs text-gray-400">
                                                <EditableText
                                                    sectionKey={`destinations.${destination.id}.highlights`}
                                                    value={destination.highlights}
                                                    tag="span"
                                                />
                                            </p>

                                            {/* CTA */}
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs font-medium text-amber-300 transition-transform duration-300 group-hover:scale-105">
                                                    View Details →
                                                </div>
                                                <div className="text-xs text-gray-400">{destination.features.length} features included</div>
                                            </div>
                                        </div>

                                        {/* Enhanced Bottom Accent Line */}
                                        <div className="h-1 origin-left scale-x-0 transform bg-gradient-to-r from-amber-300 to-orange-400 transition-transform duration-500 group-hover:scale-x-100" />
                                    </motion.article>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl border border-white/15 bg-black/80 text-white shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold text-white">
                                            <EditableText sectionKey={`destinations.${destination.id}.title`} value={destination.title} tag="span" />
                                        </DialogTitle>
                                        <DialogDescription className="text-base leading-relaxed text-gray-300">
                                            <EditableText
                                                sectionKey={`destinations.${destination.id}.description`}
                                                value={destination.description}
                                                tag="span"
                                            />
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-6 grid gap-4">
                                        {/* Package Details */}
                                        <div className="rounded-lg border border-white/15 bg-white/5 p-4 shadow-sm">
                                            <h4 className="mb-3 font-semibold text-amber-300">Package Details</h4>
                                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-200">
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

                                        {/* Highlights */}
                                        <div className="rounded-lg border border-white/15 bg-white/5 p-4 shadow-sm">
                                            <h4 className="mb-3 font-semibold text-amber-300">Highlights</h4>
                                            <p className="text-sm leading-relaxed text-gray-200">
                                                <EditableText
                                                    sectionKey={`destinations.${destination.id}.highlights`}
                                                    value={destination.highlights}
                                                    tag="span"
                                                />
                                            </p>
                                        </div>

                                        {/* Included Features */}
                                        <div className="rounded-lg border border-white/15 bg-white/5 p-4 shadow-sm">
                                            <h4 className="mb-3 font-semibold text-amber-300">What's Included</h4>
                                            <ul className="grid grid-cols-1 gap-2 text-sm text-gray-200">
                                                {destination.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center space-x-2">
                                                        <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* CTA Buttons */}
                                        <div className="flex gap-3">
                                            <motion.a
                                                href="https://wa.me/6281234567890"
                                                target="_blank"
                                                rel="noreferrer"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1 rounded-lg bg-amber-400 px-4 py-3 text-center text-sm font-semibold text-black transition-all duration-300 hover:shadow-lg"
                                            >
                                                Book Now
                                            </motion.a>
                                            <motion.a
                                                href="https://wa.me/6281234567890"
                                                target="_blank"
                                                rel="noreferrer"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1 rounded-lg border border-amber-400 px-4 py-3 text-center text-sm font-semibold text-amber-300 transition-all duration-300 hover:bg-amber-400 hover:text-black"
                                            >
                                                Ask Questions
                                            </motion.a>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </motion.div>

                    {/* Enhanced Call to Action Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-12 text-center sm:mt-16 md:mt-20"
                    >
                        <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 sm:mb-6 sm:px-6 sm:py-3">
                            <span className="text-xs font-medium text-primary sm:text-sm">
                                <EditableText sectionKey="destinations.cta.badge" value="✨ Custom Packages Available" tag="span" />
                            </span>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground sm:mb-4 sm:text-2xl md:text-3xl">
                            <EditableText sectionKey="destinations.cta.title" value="Can't Find the Perfect Destination?" tag="span" />
                        </h3>
                        <p className="mx-auto mb-6 max-w-2xl text-sm text-muted-foreground sm:mb-8 sm:text-base">
                            <EditableText
                                sectionKey="destinations.cta.description"
                                value="Our travel experts are here to create the perfect custom itinerary just for you. Whether you're looking for a spiritual journey, cultural adventure, or luxury escape, we'll design an experience that matches your dreams and preferences."
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
                                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-lg sm:px-8 sm:py-4 sm:text-base"
                            >
                                Free Consultation
                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </motion.a>
                            <motion.a
                                href="https://wa.me/6281234567890"
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground sm:px-8 sm:py-4 sm:text-base"
                            >
                                Custom Package
                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </motion.a>
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
                                // Find the image by destination ID from the key (e.g., "destinations.1.image" -> ID = 1)
                                const destId = imageTargetKey.split('.')[1];
                                const img = document.querySelector(`img[data-destination-id="${destId}"]`) as HTMLImageElement | null;
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

            {/* Portal-Based Modal - GUARANTEED Centered & Not Stuck! */}
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
