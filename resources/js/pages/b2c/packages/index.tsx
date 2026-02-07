import { EditableText } from '@/components/cms';
import PlaceholderImage from '@/components/media/placeholder-image';
import SeoHead from '@/components/SeoHead';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import { getImageUrl } from '@/utils/imageHelper';
import axios from 'axios';
import { router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Edit3, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const IMAGE_GUIDE = '1920×1080px recommended · Max 5MB · Auto-compressed · JPEG, PNG, WebP';

export default function Packages() {
    const { props } = usePage<{ sections?: Record<string, { content?: string; image?: string }> }>();
    const getContent = (key: string, fallback: string) => props.sections?.[key]?.content?.trim() || fallback;
    const getImageSrc = (sectionKey: string, fallbackPath: string) =>
        getImageUrl(props.sections, sectionKey, fallbackPath);

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
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [galleryEditorOpen, setGalleryEditorOpen] = useState<null | {
        id: number;
        title: string;
        subtitle: string;
        description: string;
        category: string;
    }>(null);
    const [galleryPendingFile, setGalleryPendingFile] = useState<File | null>(null);

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

    const typeOptions = ['All', 'Religious', 'Cultural', 'Adventure', 'Luxury'];
    const priceOptions = ['All', 'Under $2,000', '$2,000 - $2,500', '$2,500 - $3,000', 'Over $3,000'];
    const durationOptions = ['All', '4-6 Days', '7-9 Days', '10+ Days'];
    const paxOptions = ['All', 'Small Group (15-25)', 'Medium Group (25-35)', 'Large Group (35+)'];

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
            <SeoHead
                title="Travel Packages - Cahaya Anbiya Travel"
                description="Temukan paket perjalanan terbaik dari Cahaya Anbiya Travel: umrah, wisata budaya, dan perjalanan premium dengan fasilitas lengkap."
            />

            <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
                {/* Main Content Section */}
                <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 md:pt-20">
                    {/* Ambient Effects */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.1),transparent_70%)] blur-2xl" />
                        <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.1),transparent_70%)] blur-2xl" />
                    </div>

                    {/* Hero Section */}
                    <div className="relative mb-12 text-center md:mb-14">
                        {/* Badge */}
                        <div className="mb-4 inline-block">
                            <div className="group inline-flex items-center gap-2 rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-5 py-2 shadow-xl transition-all duration-300 hover:scale-105 hover:border-amber-400/70">
                                <Sparkles className="h-4 w-4 text-amber-300 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                                <span className="text-xs font-semibold tracking-wider text-amber-200 uppercase sm:text-sm">
                                    <EditableText sectionKey="packages.header.badge" value="Premium Travel Packages" tag="span" />
                                </span>
                            </div>
                        </div>

                        {/* Main Title */}
                        <h1 className="mb-4 bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-3xl leading-tight font-bold text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                            Discover Your Perfect Journey
                        </h1>

                        {/* Subtitle */}
                        <h2 className="mx-auto mb-5 max-w-3xl text-xl leading-snug font-semibold text-white sm:text-2xl md:text-3xl">
                            <EditableText sectionKey="packages.header.descriptionTitle" value="Your Perfect Journey Awaits" tag="span" />
                        </h2>

                        {/* Description */}
                        <div className="mx-auto mb-8 max-w-2xl space-y-2">
                            <p className="text-sm leading-relaxed text-white/80 sm:text-base md:text-lg lg:text-xl">
                                Discover our curated collection of spiritual and cultural journeys. From Umrah & Hajj experiences to luxury
                                adventures, find the perfect package for your next unforgettable journey.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/70 sm:gap-6 sm:text-sm">
                            {[
                                { label: 'Premium Experiences', color: 'from-amber-400 to-orange-400' },
                                { label: 'Expert Guidance', color: 'from-orange-400 to-red-400' },
                                { label: '24/7 Support', color: 'from-amber-500 to-yellow-400' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${item.color} shadow-md`} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="mt-8 mb-12">
                        <div className="mb-6 text-center">
                            <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl md:text-2xl">Find Your Perfect Package</h3>
                            <p className="text-sm text-white/70 sm:text-base">Use filters below to discover packages that match your preferences</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="h-10 w-full min-w-[140px] border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-800/90 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/20 sm:w-40">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent className="border border-white/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                                    {typeOptions.map((type) => (
                                        <SelectItem
                                            key={type}
                                            value={type}
                                            className="text-sm text-white transition-colors hover:bg-amber-500/20 hover:text-amber-200"
                                        >
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                                <SelectTrigger className="h-10 w-full min-w-[160px] border border-white/20 bg-gradient-to-br from-slate-900/90 to-slate-800/80 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/20 sm:w-48">
                                    <SelectValue placeholder="Price Range" />
                                </SelectTrigger>
                                <SelectContent className="border border-white/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                                    {priceOptions.map((price) => (
                                        <SelectItem
                                            key={price}
                                            value={price}
                                            className="text-sm text-white transition-colors hover:bg-amber-500/20 hover:text-amber-200"
                                        >
                                            {price}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                <SelectTrigger className="h-10 w-full min-w-[150px] border border-white/20 bg-gradient-to-br from-slate-900/90 to-slate-800/80 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/20 sm:w-44">
                                    <SelectValue placeholder="Duration" />
                                </SelectTrigger>
                                <SelectContent className="border border-white/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                                    {durationOptions.map((duration) => (
                                        <SelectItem
                                            key={duration}
                                            value={duration}
                                            className="text-sm text-white transition-colors hover:bg-amber-500/20 hover:text-amber-200"
                                        >
                                            {duration}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedPax} onValueChange={setSelectedPax}>
                                <SelectTrigger className="h-10 w-full min-w-[170px] border border-white/20 bg-gradient-to-br from-slate-900/90 to-slate-800/80 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/20 sm:w-52">
                                    <SelectValue placeholder="Group Size" />
                                </SelectTrigger>
                                <SelectContent className="border border-white/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                                    {paxOptions.map((pax) => (
                                        <SelectItem
                                            key={pax}
                                            value={pax}
                                            className="text-sm text-white transition-colors hover:bg-amber-500/20 hover:text-amber-200"
                                        >
                                            {pax}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Packages Grid - ✅ NO SCROLL ANIMATIONS */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPackages.map((pkg) => (
                            <article
                                key={pkg.id}
                                className="group overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-900/80 shadow-2xl transition-all duration-300 hover:-translate-y-2.5 hover:scale-105"
                            >
                                        <div className="relative aspect-video overflow-hidden">
                                            <img
                                                src={getImageSrc(`packages.${pkg.id}.image`, pkg.image)}
                                                alt={getContent(`packages.${pkg.id}.title`, pkg.title)}
                                                data-package-id={pkg.id}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                                                        const currentUrl = target.src;
                                                        if (currentUrl.includes('/public/')) {
                                                            target.src = currentUrl.replace('/public/', '/');
                                                        } else {
                                                            target.src = currentUrl.replace(
                                                                'assets.cahayaanbiya.com/',
                                                                'assets.cahayaanbiya.com/public/',
                                                            );
                                                        }
                                                    } else {
                                                        target.style.display = 'none';
                                                        const nextElement = target.nextElementSibling as HTMLElement;
                                                        if (nextElement) nextElement.style.display = 'block';
                                                    }
                                                }}
                                            />
                                            <PlaceholderImage className="hidden h-full w-full object-cover" />

                                            <div className="absolute top-4 left-4">
                                                <span className="rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white shadow-xl">
                                                    {getContent(`packages.${pkg.id}.type`, pkg.type)}
                                                </span>
                                            </div>

                                            {editMode && (
                                                <div className="absolute bottom-3 right-3 z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditorOpen({
                                                                id: pkg.id,
                                                                title: getContent(`packages.${pkg.id}.title`, pkg.title),
                                                                location: getContent(`packages.${pkg.id}.location`, pkg.location),
                                                                duration: getContent(`packages.${pkg.id}.duration`, pkg.duration),
                                                                price: getContent(`packages.${pkg.id}.price`, pkg.price),
                                                                pax: getContent(`packages.${pkg.id}.pax`, pkg.pax),
                                                                type: getContent(`packages.${pkg.id}.type`, pkg.type),
                                                                description: getContent(`packages.${pkg.id}.description`, pkg.description),
                                                            });
                                                            setPendingFile(null);
                                                        }}
                                                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl ring-2 ring-blue-400/50 transition-all hover:scale-110 hover:rotate-12"
                                                        title="Edit content & image"
                                                    >
                                                        <Edit3 className="h-6 w-6" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </div>

                                        <div className="p-6">
                                            <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-amber-300 sm:text-2xl">
                                                {getContent(`packages.${pkg.id}.title`, pkg.title)}
                                            </h3>
                                            <p className="mb-3 text-sm leading-relaxed text-white/80 sm:text-base">
                                                {getContent(`packages.${pkg.id}.location`, pkg.location)} •{' '}
                                                {getContent(`packages.${pkg.id}.duration`, pkg.duration)}
                                            </p>

                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="text-xl font-bold text-amber-300 sm:text-2xl">
                                                    {getContent(`packages.${pkg.id}.price`, pkg.price)}
                                                </div>
                                                <div className="text-xs font-medium text-white/70 sm:text-sm">
                                                    {getContent(`packages.${pkg.id}.pax`, pkg.pax)}
                                                </div>
                                            </div>

                                            <p className="mb-3 line-clamp-2 text-xs text-white/70 sm:text-sm">
                                                {getContent(`packages.${pkg.id}.description`, pkg.description)}
                                            </p>

                                            <div className="flex gap-3">
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
                                                    Ask
                                                </a>
                                            </div>
                                        </div>

                                        <div className="h-1.5 origin-left scale-x-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 shadow-lg transition-transform duration-500 group-hover:scale-x-100" />
                                    </article>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredPackages.length === 0 && (
                        <div className="mt-16 text-center">
                            <div className="mx-auto max-w-md rounded-3xl border-2 border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-12 shadow-2xl">
                                <div className="mb-6 text-6xl">🔍</div>
                                <h3 className="mb-3 text-2xl font-bold text-white">No packages found</h3>
                                <p className="text-base text-white/70">
                                    Try adjusting your filters to discover the perfect package for your journey.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Gallery Section */}
                    <div className="relative pt-12 md:pt-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <div className="mb-10 text-center">
                                <div className="mb-3 inline-block">
                                    <div className="rounded-full border-2 border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-6 py-3 shadow-xl">
                                        <span className="text-sm font-bold tracking-wider text-amber-200 uppercase">
                                            <EditableText sectionKey="packages.gallery.badge" value="📸 Destination Gallery" tag="span" />
                                        </span>
                                    </div>
                                </div>
                                <h2 className="mb-2 text-3xl leading-tight font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
                                    <EditableText sectionKey="packages.gallery.title" value="Explore Our Destinations" tag="span" />
                                </h2>
                                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
                                    <EditableText
                                        sectionKey="packages.gallery.description"
                                        value="Discover the breathtaking beauty and rich history of the destinations featured in our travel packages"
                                        tag="span"
                                    />
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                                    <div
                                        key={destination.id}
                                        className="group relative overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-900/80 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img
                                                src={getImageSrc(`packages.gallery.${destination.id}.image`, destination.image)}
                                                alt={getContent(`packages.gallery.${destination.id}.title`, destination.title)}
                                                data-gallery-id={destination.id}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                                                        const currentUrl = target.src;
                                                        if (currentUrl.includes('/public/')) {
                                                            target.src = currentUrl.replace('/public/', '/');
                                                        } else {
                                                            target.src = currentUrl.replace(
                                                                'assets.cahayaanbiya.com/',
                                                                'assets.cahayaanbiya.com/public/',
                                                            );
                                                        }
                                                    } else {
                                                        target.style.display = 'none';
                                                        const nextElement = target.nextElementSibling as HTMLElement;
                                                        if (nextElement) nextElement.style.display = 'block';
                                                    }
                                                }}
                                            />
                                            <PlaceholderImage className="hidden h-full w-full object-cover" />

                                            <div className="absolute top-4 left-4">
                                                <span className="rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white shadow-xl">
                                                    {getContent(`packages.gallery.${destination.id}.category`, destination.category)}
                                                </span>
                                            </div>

                                            {editMode && (
                                                <div className="absolute bottom-4 right-4 z-20">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setGalleryEditorOpen({
                                                                id: destination.id,
                                                                title: getContent(`packages.gallery.${destination.id}.title`, destination.title),
                                                                subtitle: getContent(`packages.gallery.${destination.id}.subtitle`, destination.subtitle),
                                                                description: getContent(`packages.gallery.${destination.id}.description`, destination.description),
                                                                category: getContent(`packages.gallery.${destination.id}.category`, destination.category),
                                                            });
                                                            setGalleryPendingFile(null);
                                                        }}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:scale-110"
                                                        title="Edit Gallery"
                                                    >
                                                        <Edit3 className="h-5 w-5" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                                        </div>

                                        <div className="absolute right-0 bottom-0 left-0 p-5 text-white">
                                            <h3 className="mb-1.5 text-lg font-bold sm:text-xl">
                                                {getContent(`packages.gallery.${destination.id}.title`, destination.title)}
                                            </h3>
                                            <p className="mb-1.5 text-sm font-semibold text-white/90 sm:text-base">
                                                {getContent(`packages.gallery.${destination.id}.subtitle`, destination.subtitle)}
                                            </p>
                                            <p className="text-xs text-white/80 sm:text-sm">
                                                {getContent(`packages.gallery.${destination.id}.description`, destination.description)}
                                            </p>
                                        </div>

                                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 shadow-lg transition-all duration-500 group-hover:w-full" />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12">
                                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                                    <div className="inline-flex items-center rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-5 py-2.5 shadow-lg transition-all duration-300 hover:border-amber-400/70 hover:shadow-amber-500/20">
                                        <span className="text-xs font-semibold text-amber-200 sm:text-sm">
                                            ✨ Ready to Experience These Amazing Destinations?
                                        </span>
                                    </div>
                                    <a
                                        href="/destinations"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/30 sm:px-8 sm:py-3 sm:text-base"
                                    >
                                        View All Destinations
                                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
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

            {/* Editor Modal - floating bottom, same as Destinations */}
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
                            <span className="text-sm font-semibold text-white">Edit Package #{editorOpen.id}</span>
                        </div>
                        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2">
                            {(['title', 'location', 'duration', 'price', 'pax', 'type'] as const).map((field) => (
                                <div key={field}>
                                    <label className="mb-1 block text-xs font-medium text-gray-300 capitalize">{field === 'pax' ? 'Group Size' : field}</label>
                                    <input
                                        type="text"
                                        value={editorOpen[field]}
                                        onChange={(e) => setEditorOpen({ ...editorOpen, [field]: e.target.value })}
                                        className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-300">Description</label>
                                <textarea
                                    value={editorOpen.description}
                                    onChange={(e) => setEditorOpen({ ...editorOpen, description: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-300">Replace Image</label>
                                <p className="mb-2 rounded-lg border border-amber-500/30 bg-amber-900/20 px-3 py-2 text-xs text-amber-100">
                                    {IMAGE_GUIDE}
                                </p>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
                                    className="w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-amber-400"
                                />
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
                                onClick={async () => {
                                    if (!editorOpen) return;
                                    setSaving(true);
                                    try {
                                        const updates = [
                                            { key: `packages.${editorOpen.id}.title`, content: editorOpen.title },
                                            { key: `packages.${editorOpen.id}.location`, content: editorOpen.location },
                                            { key: `packages.${editorOpen.id}.duration`, content: editorOpen.duration },
                                            { key: `packages.${editorOpen.id}.price`, content: editorOpen.price },
                                            { key: `packages.${editorOpen.id}.pax`, content: editorOpen.pax },
                                            { key: `packages.${editorOpen.id}.type`, content: editorOpen.type },
                                            { key: `packages.${editorOpen.id}.description`, content: editorOpen.description },
                                        ];
                                        await Promise.all(updates.map((u) => axios.post('/admin/update-section', u)));
                                        if (pendingFile) {
                                            const form = new FormData();
                                            form.append('key', `packages.${editorOpen.id}.image`);
                                            form.append('image', pendingFile);
                                            const r = await axios.post('/admin/upload-image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                                            const url = r.data?.url || r.data?.imageUrl;
                                            if (url) {
                                                const img = document.querySelector(`img[data-package-id="${editorOpen.id}"]`) as HTMLImageElement | null;
                                                if (img) img.src = url;
                                            }
                                        }
                                        setEditorOpen(null);
                                        setPendingFile(null);
                                        router.reload({ only: ['sections'] });
                                    } catch (err) {
                                        console.error(err);
                                        alert('Failed to save');
                                    } finally {
                                        setSaving(false);
                                    }
                                }}
                                disabled={saving}
                                className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-60"
                            >
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gallery Editor Modal - floating bottom, same structure */}
            <AnimatePresence>
                {editMode && galleryEditorOpen && (
                    <motion.div
                        key={`gallery-${galleryEditorOpen.id}`}
                        className="fixed bottom-6 left-1/2 z-[9998] w-[min(640px,92vw)] -translate-x-1/2 rounded-xl border border-white/10 bg-black/95 p-6 shadow-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">Edit Gallery #{galleryEditorOpen.id}</span>
                        </div>
                        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2">
                            {(['title', 'subtitle', 'category'] as const).map((field) => (
                                <div key={field}>
                                    <label className="mb-1 block text-xs font-medium text-gray-300 capitalize">{field}</label>
                                    <input
                                        type="text"
                                        value={galleryEditorOpen[field]}
                                        onChange={(e) => setGalleryEditorOpen({ ...galleryEditorOpen, [field]: e.target.value })}
                                        className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-300">Description</label>
                                <textarea
                                    value={galleryEditorOpen.description}
                                    onChange={(e) => setGalleryEditorOpen({ ...galleryEditorOpen, description: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-300">Replace Image</label>
                                <p className="mb-2 rounded-lg border border-amber-500/30 bg-amber-900/20 px-3 py-2 text-xs text-amber-100">
                                    {IMAGE_GUIDE}
                                </p>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => setGalleryPendingFile(e.target.files?.[0] ?? null)}
                                    className="w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-amber-400"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                onClick={() => {
                                    setGalleryEditorOpen(null);
                                    setGalleryPendingFile(null);
                                }}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 ring-1 ring-white/10 transition-all hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!galleryEditorOpen) return;
                                    setSaving(true);
                                    try {
                                        const updates = [
                                            { key: `packages.gallery.${galleryEditorOpen.id}.title`, content: galleryEditorOpen.title },
                                            { key: `packages.gallery.${galleryEditorOpen.id}.subtitle`, content: galleryEditorOpen.subtitle },
                                            { key: `packages.gallery.${galleryEditorOpen.id}.description`, content: galleryEditorOpen.description },
                                            { key: `packages.gallery.${galleryEditorOpen.id}.category`, content: galleryEditorOpen.category },
                                        ];
                                        await Promise.all(updates.map((u) => axios.post('/admin/update-section', u)));
                                        if (galleryPendingFile) {
                                            const form = new FormData();
                                            form.append('key', `packages.gallery.${galleryEditorOpen.id}.image`);
                                            form.append('image', galleryPendingFile);
                                            const r = await axios.post('/admin/upload-image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                                            const url = r.data?.url || r.data?.imageUrl;
                                            if (url) {
                                                const img = document.querySelector(`img[data-gallery-id="${galleryEditorOpen.id}"]`) as HTMLImageElement | null;
                                                if (img) img.src = url;
                                            }
                                        }
                                        setGalleryEditorOpen(null);
                                        setGalleryPendingFile(null);
                                        router.reload({ only: ['sections'] });
                                    } catch (err) {
                                        console.error(err);
                                        alert('Failed to save');
                                    } finally {
                                        setSaving(false);
                                    }
                                }}
                                disabled={saving}
                                className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-60"
                            >
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PublicLayout>
    );
}
