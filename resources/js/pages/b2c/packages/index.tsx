import { EditableText } from '@/components/cms';
import PlaceholderImage from '@/components/media/placeholder-image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, CheckCircle2, Edit3, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Packages() {
    // Listen to global edit mode flag from provider
    const [editMode, setEditModeUI] = useState<boolean>(false);
    useEffect(() => {
        const check = () => setEditModeUI(document.documentElement.classList.contains('cms-edit'));
        check();
        const handler = () => check();
        window.addEventListener('cms:mode', handler as EventListener);
        return () => window.removeEventListener('cms:mode', handler as EventListener);
    }, []);

    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedPrice, setSelectedPrice] = useState<string>('');
    const [selectedDuration, setSelectedDuration] = useState<string>('');
    const [selectedPax, setSelectedPax] = useState<string>('');

    const [editorOpen, setEditorOpen] = useState<null | {
        id: number;
        title: string;
        location: string;
        duration: string;
        price: string;
        pax: string;
        type: string;
        description: string;
    }>(null);
    const [saving, setSaving] = useState(false);
    const [imageTargetKey, setImageTargetKey] = useState<string | null>(null);
    const hiddenImageInputId = 'packages-image-replacer';
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);
    const [dialogSaving, setDialogSaving] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    // Animation variants
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

    // Sample packages data
    const packages = [
        {
            id: 1,
            title: 'Konsorsium Mesir Aqsa Jordan',
            location: 'Jordan, Palestina & Mesir',
            duration: '9D8N',
            price: '$2,300',
            pax: 'Max 25 pax',
            type: 'Religious',
            image: '/packages1.png',
            highlights: ['Petra', 'Museum Mummy', 'Camel', 'Nile Cruise', 'Pyramid & Sphinx', 'Masjid Al Aqsa'],
            description:
                'Tempat mana yang paling bikin hati bergetar? Disinilah tempatnya yaitu napak tilas tiga negara sekaligus. Di Mesir, Di Aqsa, Di Jordan. Perjalanan ini bukan sekadar wisata, kita napak tilas belajar sejarah kisah nabi sebelumnya hingga merasakan khidmat dalam perjalanan ini agar kita terus bersyukur dan mengambil Pelajaran dari setiap kisah dan perjalanan ini.',
            features: ['Dinner Nile Cruise', 'Camel di Mesir', 'Petra', 'Museum Mummy', 'Tips Guide $80 (tidak termasuk)'],
            dates: [{ date: 'Oktober 2025', status: 'Available' }],
            hotels: [
                { name: 'Golden Tulip', location: 'Amman', stars: 4 },
                { name: 'Holyland', location: 'Jerusalem', stars: 4 },
                { name: 'Mega Club', location: 'Taba', stars: 4 },
                { name: 'Azal Pyramid', location: 'Cairo', stars: 4 },
            ],
        },
        {
            id: 2,
            title: '3 Negara dalam 1 Perjalanan',
            location: 'Jordan, Palestina & Mesir',
            duration: '10D9N',
            price: '$2,300',
            pax: 'Kuota Terbatas',
            type: 'Religious',
            image: '/packages2.png',
            highlights: ['Napak tilas Para Nabi', 'Wisata sejarah', 'Healing untuk hati', 'Momen tenang'],
            description:
                '⚠️ Breaking News! 🌏 Sekali Jalan Langsung 3 Negara Sekaligus! Yes! Kamu nggak salah baca. Jordan, Palestina, dan Mesir bisa kamu jelajahi hanya dalam 1 trip selama 10 hari!! Include menapak jejak Para Nabi, wisata sejarah, dan healing untuk hati yang rindu momen tenang ⭐️',
            features: ['Menapak jejak Para Nabi', 'Wisata sejarah', 'Healing untuk hati', 'Momen tenang', 'Kuota terbatas'],
            dates: [{ date: 'Oktober 2025', status: 'Limited' }],
        },
        {
            id: 3,
            title: '10 Hari Jordan Aqsa Mesir',
            location: 'Jordan, Aqsa & Mesir',
            duration: '10D9N',
            price: '$2,300',
            pax: 'Max 30 pax',
            type: 'Religious',
            image: '/packages3.png',
            highlights: ['Museum Mummy Firaun', 'Petra', 'Nile Cruise', 'Camel Ride', 'FREE WiFi', 'Waktu Shalat Terjaga'],
            description:
                'Bayangkan jika… Kamu sedang berdiri di depan Al-Aqsa, merasakan damainya doa di tempat suci. Langkahmu menyusuri Petra yang megah, berlayar di Sungai Nil, dan menyaksikan matahari tenggelam di balik Piramida. Ini bukan sekadar wisata, tapi perjalanan spiritual, sejarah, dan makna semua dalam satu pengalaman selama 10 hari ke Jordan, Aqsa & Mesir.',
            features: [
                'Makanan halal',
                'Waktu salat terjaga',
                'Hotel bintang 4/setara',
                'Wi-Fi gratis',
                'Dipandu dengan nyaman dan aman',
                'Free snack on the bus',
            ],
            dates: [
                { date: '21 Agustus 2025', status: 'Sold Out' },
                { date: '23 September 2025', status: 'Sold Out' },
                { date: '30 Oktober 2025', status: 'Limited' },
                { date: '5 Desember 2025', status: 'Limited' },
            ],
            hotels: [
                { name: 'Golden Tulip', location: 'Amman', stars: 4 },
                { name: 'Holyland', location: 'Jerusalem', stars: 4 },
                { name: 'Mega Club', location: 'Taba', stars: 4 },
                { name: 'Azal Pyramid', location: 'Cairo', stars: 4 },
            ],
        },
    ];

    // Filter options
    const typeOptions = ['All', 'Religious', 'Cultural', 'Adventure', 'Luxury'];
    const priceOptions = ['All', 'Under $2,000', '$2,000 - $2,500', '$2,500 - $3,000', 'Over $3,000'];
    const durationOptions = ['All', '4-6 Days', '7-9 Days', '10+ Days'];
    const paxOptions = ['All', 'Small Group (15-25)', 'Medium Group (25-35)', 'Large Group (35+)'];

    // Filter packages based on selected filters
    const filteredPackages = packages.filter((pkg) => {
        if (selectedType && selectedType !== 'All' && pkg.type !== selectedType) return false;
        if (selectedPrice && selectedPrice !== 'All') {
            const price = parseInt(pkg.price.replace('$', '').replace(',', ''));
            switch (selectedPrice) {
                case 'Under $2,000':
                    if (price >= 2000) return false;
                    break;
                case '$2,000 - $2,500':
                    if (price < 2000 || price > 2500) return false;
                    break;
                case '$2,500 - $3,000':
                    if (price < 2500 || price > 3000) return false;
                    break;
                case 'Over $3,000':
                    if (price <= 3000) return false;
                    break;
            }
        }
        if (selectedDuration && selectedDuration !== 'All') {
            const days = parseInt(pkg.duration.match(/\d+/)?.[0] || '0');
            switch (selectedDuration) {
                case '4-6 Days':
                    if (days < 4 || days > 6) return false;
                    break;
                case '7-9 Days':
                    if (days < 7 || days > 9) return false;
                    break;
                case '10+ Days':
                    if (days < 10) return false;
                    break;
            }
        }
        if (selectedPax && selectedPax !== 'All') {
            const maxPax = parseInt(pkg.pax.match(/\d+/)?.[0] || '0');
            switch (selectedPax) {
                case 'Small Group (15-25)':
                    if (maxPax < 15 || maxPax > 25) return false;
                    break;
                case 'Medium Group (25-35)':
                    if (maxPax < 25 || maxPax > 35) return false;
                    break;
                case 'Large Group (35+)':
                    if (maxPax < 35) return false;
                    break;
            }
        }
        return true;
    });

    return (
        <PublicLayout>
            <Head title="Packages" />

            {/* Dark theme wrapper - full width */}
            <div className="w-full bg-black">
                <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="mb-12"
                    >
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                            <div>
                                <h1 className="text-4xl font-bold text-white md:text-5xl">
                                    <EditableText
                                        sectionKey="packages.header.title"
                                        value="Travel Packages"
                                        tag="span"
                                        className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent"
                                    />
                                </h1>
                                <p className="mt-2 text-lg text-gray-300">
                                    <EditableText
                                        sectionKey="packages.header.subtitle"
                                        value="Discover our curated collection of spiritual and cultural journeys."
                                        tag="span"
                                    />
                                </p>
                            </div>

                            {/* Filter Section */}
                            <div className="flex flex-wrap gap-3">
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger className="w-32 border-white/20 bg-white/10 text-white backdrop-blur-sm">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {typeOptions.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                                    <SelectTrigger className="w-40 border-white/20 bg-white/10 text-white backdrop-blur-sm">
                                        <SelectValue placeholder="Price" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priceOptions.map((price) => (
                                            <SelectItem key={price} value={price}>
                                                {price}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                    <SelectTrigger className="w-36 border-white/20 bg-white/10 text-white backdrop-blur-sm">
                                        <SelectValue placeholder="Duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {durationOptions.map((duration) => (
                                            <SelectItem key={duration} value={duration}>
                                                {duration}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedPax} onValueChange={setSelectedPax}>
                                    <SelectTrigger className="w-44 border-white/20 bg-white/10 text-white backdrop-blur-sm">
                                        <SelectValue placeholder="Pax" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {paxOptions.map((pax) => (
                                            <SelectItem key={pax} value={pax}>
                                                {pax}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Packages Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
                    >
                        {filteredPackages.map((pkg) => (
                            <Dialog
                                key={pkg.id}
                                onOpenChange={(open) => {
                                    if (open) {
                                        setOpenDialogId(pkg.id);
                                        setShowSuccessAlert(false); // Reset alert when dialog opens
                                    } else {
                                        // Auto-save when dialog closes (if in edit mode)
                                        if (editMode && openDialogId === pkg.id) {
                                            // Trigger flush save to ensure all pending changes are saved
                                            window.dispatchEvent(new CustomEvent('cms:flush-save'));
                                            // Show success alert briefly before closing (if dialog is still mounted)
                                            // Note: Alert won't show if dialog closes immediately, but save still happens
                                        }
                                        setOpenDialogId(null);
                                        // Delay reset to allow any pending alerts to complete
                                        setTimeout(() => {
                                            setShowSuccessAlert(false);
                                        }, 100);
                                    }
                                }}
                            >
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
                                        className="group cursor-pointer overflow-hidden rounded-xl border border-white/15 bg-black/50 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                                    >
                                        {/* Image/Thumbnail */}
                                        <div className="relative aspect-video overflow-hidden">
                                            <img
                                                src={pkg.image}
                                                alt={pkg.title}
                                                data-package-id={pkg.id}
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

                                            {/* Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className="rounded-full bg-primary/90 px-2 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                                                    {pkg.type}
                                                </span>
                                            </div>

                                            {/* Edit Mode Controls */}
                                            {editMode && (
                                                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                                    {/* Replace Image Button - Camera Icon */}
                                                    <button
                                                        onClick={() => {
                                                            setImageTargetKey(`packages.${pkg.id}.image`);
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
                                                        onClick={() =>
                                                            setEditorOpen({
                                                                id: pkg.id,
                                                                title: pkg.title,
                                                                location: pkg.location,
                                                                duration: pkg.duration,
                                                                price: pkg.price,
                                                                pax: pkg.pax,
                                                                type: pkg.type,
                                                                description: pkg.description,
                                                            })
                                                        }
                                                        className="group/edit inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 backdrop-blur-sm text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:from-blue-600 hover:to-indigo-700 hover:scale-110 hover:shadow-2xl hover:ring-blue-300"
                                                        title="Edit all details - Title, location, duration, price, etc."
                                                    >
                                                        <Edit3 className="h-5 w-5 transition-transform group-hover/edit:rotate-12" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Hover Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-5 md:p-6">
                                            <h3 className="mb-2 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-amber-300 md:text-xl">
                                                <EditableText sectionKey={`packages.${pkg.id}.title`} value={pkg.title} tag="span" />
                                            </h3>
                                            <p className="mb-3 text-sm leading-relaxed text-gray-300">
                                                <EditableText sectionKey={`packages.${pkg.id}.location`} value={pkg.location} tag="span" />{' '}
                                                <EditableText sectionKey={`packages.${pkg.id}.duration`} value={pkg.duration} tag="span" /> Start from{' '}
                                                <EditableText sectionKey={`packages.${pkg.id}.price`} value={pkg.price} tag="span" />
                                            </p>
                                            <p className="mb-4 text-xs text-gray-400">
                                                <EditableText sectionKey={`packages.${pkg.id}.pax`} value={pkg.pax} tag="span" />
                                            </p>

                                            {/* Additional Info */}
                                            <div className="flex items-center justify-between">
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
                                                        <EditableText sectionKey={`packages.${pkg.id}.duration`} value={pkg.duration} tag="span" />
                                                    </span>
                                                </div>
                                                <div className="text-xs font-medium text-amber-300 transition-transform duration-300 group-hover:scale-105">
                                                    View details
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Accent Line */}
                                        <div className="h-1 origin-left scale-x-0 transform bg-gradient-to-r from-amber-300 to-orange-400 transition-transform duration-500 group-hover:scale-x-100" />
                                    </motion.article>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl border border-white/15 bg-black/80 text-white shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:max-w-2xl">
                                    <DialogHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <DialogTitle className="text-xl font-bold text-white">
                                                    <EditableText sectionKey={`packages.${pkg.id}.title`} value={pkg.title} tag="span" />
                                                </DialogTitle>
                                                <DialogDescription className="leading-relaxed text-gray-300">
                                                    <EditableText sectionKey={`packages.${pkg.id}.description`} value={pkg.description} tag="span" />
                                                </DialogDescription>
                                            </div>
                                            {editMode && (
                                                <button
                                                    onClick={() => {
                                                        setDialogSaving(true);
                                                        window.dispatchEvent(new CustomEvent('cms:flush-save'));
                                                        setTimeout(() => {
                                                            setDialogSaving(false);
                                                            setShowSuccessAlert(true);
                                                            setTimeout(() => {
                                                                setShowSuccessAlert(false);
                                                            }, 3000);
                                                        }, 500);
                                                    }}
                                                    className="ml-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-black transition-all duration-200 hover:bg-amber-400 hover:shadow-lg disabled:opacity-50"
                                                    title="Save changes"
                                                    disabled={dialogSaving}
                                                >
                                                    {dialogSaving ? (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        >
                                                            <Save className="h-5 w-5" />
                                                        </motion.div>
                                                    ) : (
                                                        <Save className="h-5 w-5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </DialogHeader>

                                    {/* Success Alert */}
                                    <AnimatePresence>
                                        {showSuccessAlert && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                                className="mt-4 rounded-lg border border-green-500/30 bg-green-500/20 p-4 backdrop-blur-sm"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-400" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-green-300">Changes saved successfully!</p>
                                                        <p className="text-xs text-green-400/80">All your edits have been saved.</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="mt-4 space-y-4">
                                        <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                                            <strong>Location:</strong>{' '}
                                            <EditableText sectionKey={`packages.${pkg.id}.location`} value={pkg.location} tag="span" />{' '}
                                            <strong>Duration:</strong>{' '}
                                            <EditableText sectionKey={`packages.${pkg.id}.duration`} value={pkg.duration} tag="span" />
                                        </div>
                                        <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                                            <strong>Price:</strong>{' '}
                                            <EditableText sectionKey={`packages.${pkg.id}.price`} value={pkg.price} tag="span" /> per person{' '}
                                            <strong>Group Size:</strong>{' '}
                                            <EditableText sectionKey={`packages.${pkg.id}.pax`} value={pkg.pax} tag="span" />
                                        </div>

                                        {pkg.features && (
                                            <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                                                <strong>Features:</strong>
                                                <ul className="mt-2 list-inside list-disc space-y-1 text-gray-200">
                                                    {pkg.features.map((feature, index) => (
                                                        <li key={index} className="text-sm">
                                                            <EditableText
                                                                sectionKey={`packages.${pkg.id}.features.${index}`}
                                                                value={feature}
                                                                tag="span"
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {pkg.dates && pkg.dates.length > 0 && (
                                            <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                                                <strong>Available Dates:</strong>
                                                <div className="mt-2 space-y-1">
                                                    {pkg.dates.map((date, index) => (
                                                        <div key={index} className="flex items-center justify-between text-sm">
                                                            <span>
                                                                <EditableText
                                                                    sectionKey={`packages.${pkg.id}.dates.${index}.date`}
                                                                    value={date.date}
                                                                    tag="span"
                                                                />
                                                            </span>
                                                            <span
                                                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                                    date.status === 'Available'
                                                                        ? 'bg-green-500/20 text-green-300'
                                                                        : date.status === 'Sold Out'
                                                                          ? 'bg-red-500/20 text-red-300'
                                                                          : 'bg-amber-500/20 text-amber-300'
                                                                } `}
                                                            >
                                                                <EditableText
                                                                    sectionKey={`packages.${pkg.id}.dates.${index}.status`}
                                                                    value={date.status}
                                                                    tag="span"
                                                                />
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {pkg.hotels && pkg.hotels.length > 0 && (
                                            <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                                                <strong>Hotels:</strong>
                                                <div className="mt-2 space-y-1">
                                                    {pkg.hotels.map((hotel, index) => (
                                                        <div key={index} className="flex items-center justify-between text-sm">
                                                            <span>
                                                                <EditableText
                                                                    sectionKey={`packages.${pkg.id}.hotels.${index}.name`}
                                                                    value={hotel.name}
                                                                    tag="span"
                                                                />
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                <EditableText
                                                                    sectionKey={`packages.${pkg.id}.hotels.${index}.location`}
                                                                    value={hotel.location}
                                                                    tag="span"
                                                                />{' '}
                                                                ·{' '}
                                                                {Array.from({ length: hotel.stars }, (_, i) => (
                                                                    <span key={i}>★</span>
                                                                ))}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                                            <strong>Highlights:</strong>
                                            <ul className="mt-2 list-inside list-disc space-y-1 text-gray-200">
                                                {pkg.highlights.map((highlight, index) => (
                                                    <li key={index} className="text-sm">
                                                        <EditableText
                                                            sectionKey={`packages.${pkg.id}.highlights.${index}`}
                                                            value={highlight}
                                                            tag="span"
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </motion.div>

                    {/* No Results Message */}
                    {filteredPackages.length === 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center">
                            <div className="mx-auto max-w-md">
                                <div className="mb-4 text-6xl">🔍</div>
                                <h3 className="mb-2 text-xl font-semibold text-foreground">No packages found</h3>
                                <p className="text-muted-foreground">Try adjusting your filters to find the perfect package for your journey.</p>
                            </div>
                        </motion.div>
                    )}
                </section>

                {/* Destination Photos Section */}
                <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-12 text-center"
                    >
                        <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-6 py-3">
                            <span className="text-sm font-medium text-primary">
                                <EditableText sectionKey="packages.gallery.badge" value="📸 Destination Gallery" tag="span" />
                            </span>
                        </div>
                        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                            <EditableText sectionKey="packages.gallery.title" value="Explore Our Destinations" tag="span" />
                        </h2>
                        <p className="mx-auto max-w-2xl text-gray-300">
                            <EditableText
                                sectionKey="packages.gallery.description"
                                value="Discover the breathtaking beauty and rich history of the destinations featured in our travel packages"
                                tag="span"
                            />
                        </p>
                    </motion.div>

                    {/* Destination Photos Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
                    >
                        {[
                            {
                                id: 1,
                                title: 'Petra, Jordan',
                                subtitle: 'The Rose City',
                                image: '/TURKEY.jpeg',
                                description: 'Ancient Nabataean city carved into red sandstone cliffs',
                                category: 'Historical',
                            },
                            {
                                id: 2,
                                title: 'Dome of the Rock',
                                subtitle: 'Jerusalem, Palestine',
                                image: '/umrah.jpeg',
                                description: 'Sacred Islamic shrine with stunning golden dome',
                                category: 'Religious',
                            },
                            {
                                id: 3,
                                title: 'Pyramids of Giza',
                                subtitle: 'Cairo, Egypt',
                                image: '/egypt.jpeg',
                                description: 'Ancient wonders of the world',
                                category: 'Historical',
                            },
                            {
                                id: 4,
                                title: 'Cappadocia',
                                subtitle: 'Turkey',
                                image: '/jordan.jpeg',
                                description: 'Fairy chimneys and hot air balloon rides',
                                category: 'Adventure',
                            },
                            {
                                id: 5,
                                title: 'Dubai Desert',
                                subtitle: 'UAE',
                                image: '/dubai1.jpeg',
                                description: 'Golden sand dunes and desert adventures',
                                category: 'Adventure',
                            },
                            {
                                id: 6,
                                title: 'Oman Desert',
                                subtitle: 'Muscat, Oman',
                                image: '/oman.jpg',
                                description: 'Ancient forts and traditional markets',
                                category: 'Cultural',
                            },
                        ].map((destination) => (
                            <motion.div
                                key={destination.id}
                                variants={cardVariants}
                                whileHover={{
                                    scale: 1.03,
                                    y: -8,
                                    transition: { duration: 0.3, ease: 'easeOut' },
                                }}
                                className="group relative overflow-hidden rounded-xl border border-white/15 bg-black/40 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-500"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={destination.image}
                                        alt={destination.title}
                                        data-gallery-id={destination.id}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                            if (nextElement) {
                                                nextElement.style.display = 'block';
                                            }
                                        }}
                                    />
                                    <PlaceholderImage className="hidden h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />

                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="rounded-full bg-primary/90 px-2 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                                            {destination.category}
                                        </span>
                                    </div>

                                    {/* Edit Mode Controls - Image Replacement */}
                                    {editMode && (
                                        <button
                                            onClick={() => {
                                                setImageTargetKey(`packages.gallery.${destination.id}.image`);
                                                const el = document.getElementById(hiddenImageInputId) as HTMLInputElement | null;
                                                el?.click();
                                            }}
                                            className="absolute top-3 left-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 backdrop-blur-sm text-gray-800 shadow-xl ring-2 ring-white/40 transition-all hover:bg-white hover:scale-105 hover:shadow-2xl"
                                            title="Replace image - Click to upload new photo"
                                        >
                                            <Camera className="h-5 w-5" strokeWidth={2.5} />
                                        </button>
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </div>

                                {/* Content */}
                                <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
                                    <h3 className="mb-1 text-lg font-semibold">
                                        <EditableText sectionKey={`packages.gallery.${destination.id}.title`} value={destination.title} tag="span" />
                                    </h3>
                                    <p className="mb-2 text-sm text-white/80">
                                        <EditableText
                                            sectionKey={`packages.gallery.${destination.id}.subtitle`}
                                            value={destination.subtitle}
                                            tag="span"
                                        />
                                    </p>
                                    <p className="text-xs text-white/70">
                                        <EditableText
                                            sectionKey={`packages.gallery.${destination.id}.description`}
                                            value={destination.description}
                                            tag="span"
                                        />
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Gallery CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-12 text-center"
                    >
                        <p className="mb-4 text-muted-foreground">Ready to experience these amazing destinations?</p>
                        <motion.a
                            href="/destinations"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 rounded-full bg-amber-400 px-7 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:bg-amber-300 hover:shadow-amber-400/30"
                        >
                            View All Destinations
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/15">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </motion.a>
                    </motion.div>
                </section>

                {/* Footer */}
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
                                // Handle both package images and gallery images
                                if (imageTargetKey.includes('gallery')) {
                                    // Gallery image: packages.gallery.{id}.image
                                    const galleryId = imageTargetKey.split('.')[2];
                                    const img = document.querySelector(`img[data-gallery-id="${galleryId}"]`) as HTMLImageElement | null;
                                    if (img) {
                                        img.src = r.data.imageUrl;
                                    }
                                } else {
                                    // Package image: packages.{id}.image
                                    const pkgId = imageTargetKey.split('.')[1];
                                    const img = document.querySelector(`img[data-package-id="${pkgId}"]`) as HTMLImageElement | null;
                                    if (img) {
                                        img.src = r.data.imageUrl;
                                    }
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

            {/* Editor Panel */}
            {editorOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setEditorOpen(null)}>
                    <div className="w-full max-w-lg rounded-xl border border-white/20 bg-black p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Edit Package</h3>
                            <button
                                onClick={() => setEditorOpen(null)}
                                className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
                            >
                                Close
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-300">Title</label>
                                <input
                                    type="text"
                                    value={editorOpen.title}
                                    onChange={(e) => setEditorOpen({ ...editorOpen, title: e.target.value })}
                                    className="w-full rounded-lg border border-white/20 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-300">Location</label>
                                <input
                                    type="text"
                                    value={editorOpen.location}
                                    onChange={(e) => setEditorOpen({ ...editorOpen, location: e.target.value })}
                                    className="w-full rounded-lg border border-white/20 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-300">Duration</label>
                                    <input
                                        type="text"
                                        value={editorOpen.duration}
                                        onChange={(e) => setEditorOpen({ ...editorOpen, duration: e.target.value })}
                                        className="w-full rounded-lg border border-white/20 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-300">Price</label>
                                    <input
                                        type="text"
                                        value={editorOpen.price}
                                        onChange={(e) => setEditorOpen({ ...editorOpen, price: e.target.value })}
                                        className="w-full rounded-lg border border-white/20 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-300">Pax</label>
                                <input
                                    type="text"
                                    value={editorOpen.pax}
                                    onChange={(e) => setEditorOpen({ ...editorOpen, pax: e.target.value })}
                                    className="w-full rounded-lg border border-white/20 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-300">Type</label>
                                <input
                                    type="text"
                                    value={editorOpen.type}
                                    onChange={(e) => setEditorOpen({ ...editorOpen, type: e.target.value })}
                                    className="w-full rounded-lg border border-white/20 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-300">Description</label>
                                <textarea
                                    value={editorOpen.description}
                                    onChange={(e) => setEditorOpen({ ...editorOpen, description: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-lg border border-white/20 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-300">Replace Image</label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    className="w-full rounded-lg border border-white/20 bg-gray-900 px-3 py-2 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black file:hover:bg-amber-400"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (!f) return;
                                        const formData = new FormData();
                                        formData.append('key', `packages.${editorOpen.id}.image`);
                                        formData.append('image', f);
                                        setSaving(true);
                                        axios
                                            .post('/admin/upload-image', formData, {
                                                headers: { 'Content-Type': 'multipart/form-data' },
                                            })
                                            .then((r) => {
                                                if (r.data.success && r.data.imageUrl) {
                                                    const img = document.querySelector(
                                                        `img[data-package-id="${editorOpen.id}"]`,
                                                    ) as HTMLImageElement | null;
                                                    if (img) img.src = r.data.imageUrl;
                                                    window.dispatchEvent(new CustomEvent('cms:flush-save'));
                                                }
                                            })
                                            .catch(() => {})
                                            .finally(() => {
                                                setSaving(false);
                                                e.target.value = '';
                                            });
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    const updates = [
                                        { key: `packages.${editorOpen.id}.title`, content: editorOpen.title },
                                        { key: `packages.${editorOpen.id}.location`, content: editorOpen.location },
                                        { key: `packages.${editorOpen.id}.duration`, content: editorOpen.duration },
                                        { key: `packages.${editorOpen.id}.price`, content: editorOpen.price },
                                        { key: `packages.${editorOpen.id}.pax`, content: editorOpen.pax },
                                        { key: `packages.${editorOpen.id}.type`, content: editorOpen.type },
                                        { key: `packages.${editorOpen.id}.description`, content: editorOpen.description },
                                    ];
                                    Promise.all(updates.map((u) => axios.post('/admin/update-section', u))).then(() => {
                                        window.dispatchEvent(new CustomEvent('cms:flush-save'));
                                        setEditorOpen(null);
                                    });
                                }}
                                disabled={saving}
                                className="w-full rounded-lg bg-amber-500 px-4 py-2.5 font-semibold text-black transition-colors hover:bg-amber-400 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
