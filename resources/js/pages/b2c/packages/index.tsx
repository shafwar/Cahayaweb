import { EditableText, ImageCropModal } from '@/components/cms';
import PlaceholderImage from '@/components/media/placeholder-image';
import SeoHead from '@/components/SeoHead';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import { compressImageForUpload } from '@/utils/cmsImageUpload';
import { getImageUrl } from '@/utils/imageHelper';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp, Edit3, ImageIcon, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const IMAGE_GUIDE = '1920×1080px recommended · Max 5MB · Auto-compressed · JPEG, PNG, WebP';

type TravelPackageRow = Record<string, unknown> & {
    id: number;
    title: string;
    location: string;
    duration: string;
    price: string;
    pax: string;
    type: string;
    image: string;
    highlights?: string[];
    description: string;
    features?: string[];
    dates?: { date: string; status: string }[];
    hotels?: { name: string; location: string; stars: number }[];
    slug?: string;
    registration_open?: boolean;
    from_database?: boolean;
    filter_pax_capacity?: number;
};

export default function Packages() {
    const { props } = usePage<{
        sections?: Record<string, { content?: string; image?: string }>;
        travelPackages?: TravelPackageRow[] | null;
        flash?: { type: string; message: string } | null;
    }>();
    const getContent = (key: string, fallback: string) => props.sections?.[key]?.content?.trim() || fallback;
    const getImageSrc = (sectionKey: string, fallbackPath: string) => getImageUrl(props.sections, sectionKey, fallbackPath);
    /** Package cards are managed in Admin → B2C packages; do not use CMS section keys for listing images. */
    const packageCardImageSrc = (pkg: TravelPackageRow) => getImageUrl(undefined, '_', pkg.image);

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
    const [saving, setSaving] = useState(false);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [cropModalTarget, setCropModalTarget] = useState<'gallery' | null>(null);
    const [galleryEditorOpen, setGalleryEditorOpen] = useState<null | {
        id: number;
        title: string;
        subtitle: string;
        description: string;
        category: string;
    }>(null);
    const [galleryPendingFile, setGalleryPendingFile] = useState<File | null>(null);
    const [expandedPackageId, setExpandedPackageId] = useState<number | null>(null);
    const [imageLightbox, setImageLightbox] = useState<{ src: string; alt: string; caption?: string } | null>(null);
    const lightboxContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!imageLightbox) return;
        const onEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setImageLightbox(null);
        };
        document.addEventListener('keydown', onEscape);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onEscape);
            document.body.style.overflow = '';
        };
    }, [imageLightbox]);

    const LEGACY_PACKAGES_DATA: TravelPackageRow[] = [
        {
            id: 1,
            title: 'Konsorsium Mesir Aqsa Jordan',
            location: 'Jordan, Palestina & Mesir',
            duration: '9D8N',
            price: '$2,300',
            pax: 'Max 25 pax',
            type: 'Religious',
            image: '/images/packages/packages1.png',
            highlights: ['Petra', 'Museum Mummy', 'Camel', 'Nile Cruise', 'Pyramid & Sphinx', 'Masjid Al Aqsa'],
            description:
                'Where does the heart stir most? Here: trace the footsteps of three countries in one journey—Egypt, Aqsa, and Jordan. This is not just tourism; we follow the paths of the prophets, learn their stories, and find meaning in every step.',
            features: ['Dinner Nile Cruise', 'Camel ride in Egypt', 'Petra', 'Mummy Museum', 'Guide tips $80 (excluded)'],
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
            title: '3 Countries in 1 Journey',
            location: 'Jordan, Palestine & Egypt',
            duration: '10D9N',
            price: '$2,300',
            pax: 'Limited Seats',
            type: 'Religious',
            image: '/images/packages/packages2.png',
            highlights: ['Footsteps of the Prophets', 'Historical travel', 'Spiritual renewal', 'Peaceful moments'],
            description:
                'Three countries in one trip: Jordan, Palestine, and Egypt in 10 days. Follow the footsteps of the Prophets, explore history, and find peace. All in one unforgettable journey.',
            features: ['Footsteps of the Prophets', 'Historical tours', 'Spiritual renewal', 'Peaceful moments', 'Limited seats'],
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
            image: '/images/packages/packages3.png',
            highlights: ['Pharaoh Mummy Museum', 'Petra', 'Nile Cruise', 'Camel Ride', 'FREE WiFi', 'Prayer times observed'],
            description:
                'Imagine standing before Al-Aqsa, feeling the peace of prayer. Walk through majestic Petra, sail the Nile, and watch the sun set behind the Pyramids. A 10-day spiritual, historical journey to Jordan, Aqsa & Egypt—more than a tour, an experience of meaning.',
            features: [
                'Halal meals',
                'Prayer times observed',
                '4-star or equivalent hotels',
                'Free Wi-Fi',
                'Comfortable and safe guided tour',
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
        // --- New packages from client (Packages Cahaya Anbiya) ---
        {
            id: 4,
            title: 'PROGRAM 3TAN 2026',
            location: 'Uzbekistan | Kyrgyzstan | Kazakhstan',
            duration: '8 Days',
            price: 'Rp 26,9 JT',
            priceNote: 'Excl. Insurance & Tipping',
            pax: 'Limited Seats',
            type: 'Cultural',
            image: '/images/packages/packages-cahaya-4.jpeg',
            imageCaption:
                '3TAN 2026 Package - Central Asian Islamic architecture, blue domes, Samarkand Mosque, and cultural landscapes of Uzbekistan, Kyrgyzstan, Kazakhstan.',
            highlights: ['Shymbulak cable car', 'High-speed train', 'Central Asian Islamic architecture', 'Samarkand & Bukhara'],
            description:
                'Eid moment at 3TAN 2026! Explore Uzbekistan, Kyrgyzstan, and Kazakhstan in 8 days. Includes round-trip flights, 3-star hotels, transport, breakfast, tour leader & local guide. FREE Shymbulak cable car & high-speed train ticket.',
            features: [
                'Round-trip flights',
                '3-star hotels',
                'Transport',
                'Breakfast',
                'Tour leader & local guide',
                'FREE Shymbulak cable car',
                'FREE high-speed train ticket',
            ],
            freeBadge: 'FREE Cable car & Train',
            dates: [
                { date: '4 Februari 2026 (Winter)', status: 'Available' },
                { date: '19 Maret 2026 (Spring)', status: 'Available' },
                { date: '9 April 2026 (Spring)', status: 'Available' },
                { date: '29 Juni 2026 (School Holiday)', status: 'Available' },
                { date: '24 Desember 2026 (Year-End)', status: 'Limited' },
            ],
        },
        {
            id: 5,
            title: 'EGYPT AQSA JORDAN',
            location: 'Jordan • Aqsa • Egypt',
            duration: '10 Days',
            price: '$2,350',
            priceOriginal: '$2,500',
            priceNote: 'Exc. Tips Guide $80 & Asuransi $25',
            pax: 'Limited Seats',
            type: 'Religious',
            image: '/images/packages/packages-cahaya-5.jpeg',
            imageCaption: '10-Day Consortium Package - Dome of the Rock (Al-Aqsa Jerusalem), Giza Pyramids Egypt, and Wadi Rum Jordan landscape.',
            highlights: [
                'Pyramid & Sphinx',
                'Sinai',
                'Komplek Al-Aqsa',
                'Jericho',
                'Maqam Nabi Musa',
                'Hebron',
                'Bethlehem',
                'Petra',
                'Wadirum',
                'Gua Ashhabul Kahfi',
            ],
            description:
                '10-Day Consortium Package (JORDAN-AQSA-EGYPT). BONUS: Free Nile cruise, Free Mummy Museum ticket, Free Wadi Rum jeep tour, Free Petra ticket. Total ALL IN: $2,455.',
            features: ['Free Nile Cruise', 'Free Mummy Museum ticket', 'Free Wadi Rum jeep tour', 'Free Petra ticket'],
            freeBadge: 'FREE Nile, Mummy, Petra, Wadirum',
            dates: [{ date: '14 April 2026', status: 'Available' }],
            hotels: [
                { name: 'Pyramid/Azal/setaraf', location: 'Cairo', stars: 4 },
                { name: 'Mega Club/setaraf', location: 'Taba', stars: 4 },
                { name: 'National/setaraf', location: 'Jerusalem', stars: 3 },
                { name: 'Sulaf luxury/setaraf', location: 'Amman', stars: 4 },
            ],
        },
        {
            id: 6,
            title: 'EGYPT AQSA JORDAN Eid al-Adha',
            location: 'Jordan • Aqsa • Egypt',
            duration: '9 Days',
            price: '$2,450',
            priceOriginal: '$2,700',
            priceNote: 'Exc. Asuransi $25 & Tipping $80',
            pax: 'Limited Seats',
            type: 'Religious',
            image: '/images/packages/packages-cahaya-6.jpeg',
            imageCaption: 'Special Eid al-Adha moment at Aqsa - Dome of the Rock Jerusalem, Giza Pyramids, and Eid symbolism.',
            highlights: ['Eid al-Adha at Aqsa', 'Nile Cruise', 'Mummy Museum ticket', 'Petra', 'Wadi Rum'],
            description:
                'Special Eid al-Adha at Aqsa! 9-day journey to Jordan, Aqsa, and Egypt. FREE Nile Cruise, Mummy Museum ticket, Petra ticket, Wadi Rum.',
            features: ['Nile Cruise', 'Mummy Museum ticket', 'Petra ticket', 'Wadi Rum'],
            freeBadge: 'FREE',
            dates: [{ date: '22 Mei 2026', status: 'Available' }],
            hotels: [
                { name: 'Armada/Sulaf', location: 'Jordan', stars: 4 },
                { name: 'National', location: 'Aqsa', stars: 4 },
                { name: 'Pyramid Front/Azal', location: 'Cairo', stars: 4 },
                { name: 'Nuweiba', location: 'Taba', stars: 4 },
            ],
        },
        {
            id: 7,
            title: 'JORDAN AQSA',
            location: 'Jordan & Palestine',
            duration: '8 Days',
            price: '$2,150',
            priceOriginal: '$2,190',
            pax: 'Limited Seats',
            type: 'Religious',
            image: '/images/packages/packages-cahaya-7.jpeg',
            imageCaption: 'Jordan Aqsa 2026 Package - Petra panorama, Dome of the Rock Jerusalem, and Wadi Rum landscape.',
            highlights: ['100% FREE Petra Wadi Rum ticket', 'Dome of the Rock', 'Petra', 'Wadi Rum'],
            description:
                '2026 TRAVEL PACKAGE - 8 Days Jordan Aqsa. 100% FREE Petra Wadi Rum ticket! 4-star hotels in Jordan & Aqsa. Register now, limited seats!',
            features: ['100% FREE Petra Wadi Rum ticket', 'Hotel Jordan Armada/Sulaf ★★★★', 'Hotel Aqsa National ★★★★'],
            freeBadge: '100% FREE Petra Wadirum',
            dates: [
                { date: '9 Februari 2026', status: 'Available' },
                { date: '3 Maret 2026', status: 'Available' },
                { date: '13 April 2026', status: 'Available' },
                { date: '16 Juni 2026', status: 'Available' },
                { date: '20 Juli 2026', status: 'Available' },
                { date: '24 Agustus 2026', status: 'Available' },
                { date: '15 September 2026', status: 'Available' },
                { date: '20 Oktober 2026', status: 'Available' },
                { date: '17 November 2026', status: 'Available' },
            ],
            hotels: [
                { name: 'Armada/Sulaf', location: 'Jordan', stars: 4 },
                { name: 'National', location: 'Aqsa', stars: 4 },
            ],
        },
        {
            id: 8,
            title: 'JORDAN EGYPT AQSA',
            location: 'Jordan • Egypt • Aqsa',
            duration: '9 Days',
            price: '$2,350',
            priceOriginal: '$2,550',
            pax: 'Limited Seats',
            type: 'Religious',
            image: '/images/packages/packages-cahaya-8.jpeg',
            imageCaption: 'Jordan Egypt Aqsa 2026 Package - Al-Aqsa Mosque complex, Giza Pyramids, and three-country landscape.',
            highlights: ['Mummy Museum ticket', 'Nile Cruise', 'Petra ticket', 'Pyramid & Sphinx', 'Al-Aqsa'],
            description:
                '2026 TRAVEL PACKAGE - 9 Days Jordan Egypt Aqsa. FREE Mummy Museum ticket, Nile Cruise, Petra ticket. 4-star hotels at all destinations.',
            features: ['Mummy Museum ticket', 'Nile Cruise', 'Petra ticket'],
            freeBadge: 'FREE',
            dates: [
                { date: '13 April 2026', status: 'Available' },
                { date: '29 Juni 2026', status: 'Available' },
                { date: '20 Juli 2026', status: 'Available' },
                { date: '24 Agustus 2026', status: 'Available' },
                { date: '15 September 2026', status: 'Available' },
                { date: '20 Oktober 2026', status: 'Available' },
                { date: '17 November 2026', status: 'Available' },
            ],
            hotels: [
                { name: 'Armada/Sulaf', location: 'Jordan', stars: 4 },
                { name: 'National', location: 'Aqsa', stars: 4 },
                { name: 'Azal Pyramid/Pyramid Front', location: 'Egypt', stars: 4 },
            ],
        },
        {
            id: 9,
            title: 'UMRAH KIT',
            location: 'From Cahaya Anbiya',
            duration: 'Bonus Package',
            price: 'Included',
            pax: '6 Items',
            type: 'Religious',
            image: '/images/packages/packages-cahaya-9.jpeg',
            imageCaption:
                'Umrah kit from Cahaya Anbiya - 26" suitcase, uniform, prayer dress, ihram cloth, shoulder bag, belt. Kaaba & Abraj Al-Bait backdrop.',
            highlights: ['26" suitcase', 'Uniform', 'Prayer dress', 'Ihram cloth', 'Shoulder bag', 'Belt'],
            description:
                'Complete Umrah kit: 26" suitcase, uniform, prayer dress, ihram cloth, shoulder bag, belt. From Cahaya Anbiya with guaranteed quality.',
            features: ['26" suitcase', 'Uniform', 'Prayer dress', 'Ihram cloth', 'Shoulder bag', 'Belt'],
            freeBadge: '6 Item',
        },
        {
            id: 10,
            title: 'Premium Travel Package',
            location: 'Various Destinations',
            duration: 'Flexible',
            price: 'Contact Us',
            pax: 'Custom',
            type: 'Cultural',
            image: '/images/packages/packages-cahaya-10.jpeg',
            imageCaption: 'Cahaya Anbiya premium travel package - handpicked destinations with full facilities and premium service.',
            highlights: ['Handpicked destinations', 'Full facilities', 'Premium service'],
            description: 'Find the premium travel package that fits your needs. Contact us for full details and special offers.',
            features: ['Custom itinerary', 'Expert guide', 'Premium accommodation'],
        },
        {
            id: 11,
            title: 'Spiritual & Cultural Package',
            location: 'Religious Destinations',
            duration: 'Various',
            price: 'Contact Us',
            pax: 'Custom',
            type: 'Religious',
            image: '/images/packages/packages-cahaya-11.jpeg',
            imageCaption: 'Spiritual and cultural journey - footsteps of the prophets, historical travel, and meaningful experiences.',
            highlights: ['Footsteps of the prophets', 'Historical travel', 'Spiritual experience'],
            description: 'Meaningful spiritual and cultural journeys. Explore sacred sites and heritage with expert guides.',
            features: ['Halal certified', 'Cultural immersion', 'Spiritual guide'],
        },
    ];

    /**
     * DB-backed list: when the server sends rows (including closed packages), show them all so every
     * catalog card stays visible with Register Online vs Registration closed. When the array is empty
     * or the prop is missing, fall back to legacy marketing cards (WhatsApp CTAs).
     */
    const packages = useMemo(() => {
        const rows = props.travelPackages;
        if (Array.isArray(rows) && rows.length > 0) {
            return rows as TravelPackageRow[];
        }
        return LEGACY_PACKAGES_DATA;
    }, [props.travelPackages]);

    const hasDbPackages = Array.isArray(props.travelPackages) && props.travelPackages.length > 0;

    const flash = props.flash;

    const typeOptions = ['All', 'Religious', 'Cultural', 'Adventure', 'Luxury'];
    const priceOptions = ['All', 'Under $2,000', '$2,000 - $2,500', '$2,500 - $3,000', 'Over $3,000', 'Rp 25-30 JT'];
    const durationOptions = ['All', '4-6 Days', '7-9 Days', '10+ Days'];
    const paxOptions = ['All', 'Small Group (15-25)', 'Medium Group (25-35)', 'Large Group (35+)'];

    const filteredPackages = packages.filter((pkg) => {
        if (selectedType && selectedType !== 'All' && pkg.type !== selectedType) return false;
        if (selectedPrice && selectedPrice !== 'All') {
            const isRp = (pkg.price || '').includes('Rp') || (pkg.price || '').includes('JT');
            if (selectedPrice === 'Rp 25-30 JT') {
                if (!isRp) return false;
                return true;
            }
            if (isRp) return false; // $ filters exclude Rp packages
            const price = parseInt((pkg.price || '').replace(/\$/g, '').replace(/,/g, ''));
            if (isNaN(price)) return true; // Contact Us, Include etc. show for non-Rp filter
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
            const days = parseInt(String(pkg.duration).match(/\d+/)?.[0] || '0');
            if (days > 0) {
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
        }
        if (selectedPax && selectedPax !== 'All') {
            const maxPax = pkg.filter_pax_capacity ?? parseInt(String(pkg.pax).match(/\d+/)?.[0] || '0');
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
                description="Choose the best travel packages from Cahaya Anbiya Travel. Umrah, Hajj, and halal travel packages with competitive prices and premium service."
                keywords="Umrah packages, Hajj packages, halal travel packages, travel packages, Umrah prices, Hajj prices"
            />

            <div className="bg-section-photos-home min-h-screen border-t border-[#d4af37]/20">
                {flash?.message ? (
                    <div
                        className={`mx-auto max-w-7xl px-4 pt-4 sm:px-6 ${
                            flash.type === 'error'
                                ? 'rounded-xl border border-red-300/60 bg-red-500/10 text-red-100'
                                : 'rounded-xl border border-emerald-300/50 bg-emerald-500/10 text-emerald-100'
                        } py-3 text-center text-sm font-medium`}
                        role="status"
                    >
                        {flash.message}
                    </div>
                ) : null}
                {/* Main Content Section */}
                <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 md:pt-20">
                    {/* Sentuhan emas & oranye halus di background */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 left-1/4 h-[420px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent_65%)] blur-3xl" />
                        <div className="absolute right-1/4 bottom-0 h-[400px] w-[480px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.06),transparent_65%)] blur-3xl" />
                    </div>

                    {/* Hero Section */}
                    <div className="relative mb-12 text-center md:mb-14">
                        {/* Badge */}
                        <div className="mb-4 inline-block">
                            <div className="group inline-flex items-center gap-2 rounded-full border-2 border-[#d4af37] bg-[#d4af37]/15 px-5 py-2 shadow-md transition-all duration-300 hover:scale-105 hover:border-[#ff5200] hover:bg-[#ff5200]/15">
                                <Sparkles className="h-4 w-4 text-[#b8860b] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:text-[#e64a00]" />
                                <span className="text-xs font-bold tracking-wider text-[#b8860b] uppercase group-hover:text-[#e64a00] sm:text-sm">
                                    {getContent('packages.header.badge', 'Premium Travel Packages')}
                                </span>
                            </div>
                        </div>

                        {/* Main Title */}
                        <h1 className="mb-4 text-3xl leading-tight font-bold text-[#1e3a5f] sm:text-4xl md:text-5xl lg:text-6xl">
                            Discover Your Perfect Journey
                        </h1>

                        {/* Subtitle */}
                        <h2 className="mx-auto mb-5 max-w-3xl text-xl leading-snug font-semibold text-[#334155] sm:text-2xl md:text-3xl">
                            {getContent('packages.header.descriptionTitle', 'Your Perfect Journey Awaits')}
                        </h2>

                        {/* Description */}
                        <div className="mx-auto mb-8 max-w-2xl space-y-2">
                            <p className="text-sm leading-relaxed text-[#475569] sm:text-base md:text-lg lg:text-xl">
                                Discover our curated collection of spiritual and cultural journeys. From Umrah & Hajj experiences to luxury
                                adventures, find the perfect package for your next unforgettable journey.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#64748b] sm:gap-6 sm:text-sm">
                            {[
                                { label: 'Premium Experiences', color: 'from-[#3d5a80] to-[#ff5200]' },
                                { label: 'Expert Guidance', color: 'from-[#5a7a9e] to-[#d4af37]' },
                                { label: '24/7 Support', color: 'from-[#ff5200] to-[#fec901]' },
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
                            <h3 className="mb-2 text-xl font-bold text-[#1e3a5f] sm:text-2xl md:text-2xl">Find Your Perfect Package</h3>
                            <p className="text-sm text-[#475569] sm:text-base">Use filters below to discover packages that match your preferences</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="h-10 w-full min-w-[140px] border border-[#d4af37]/30 bg-white text-sm font-medium text-[#1e3a5f] shadow-md transition-all duration-300 hover:border-[#d4af37]/50 sm:w-40">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent className="border border-[#d4af37]/20 bg-white shadow-2xl">
                                    {typeOptions.map((type) => (
                                        <SelectItem
                                            key={type}
                                            value={type}
                                            className="text-sm text-[#1e3a5f] transition-colors hover:bg-[#e8ecf4]/90 hover:text-[#1e3a5f]"
                                        >
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                                <SelectTrigger className="h-10 w-full min-w-[160px] border border-[#d4af37]/30 bg-white text-sm font-medium text-[#1e3a5f] shadow-md transition-all duration-300 hover:border-[#d4af37]/50 sm:w-48">
                                    <SelectValue placeholder="Price Range" />
                                </SelectTrigger>
                                <SelectContent className="border border-[#d4af37]/20 bg-white shadow-2xl">
                                    {priceOptions.map((price) => (
                                        <SelectItem
                                            key={price}
                                            value={price}
                                            className="text-sm text-[#1e3a5f] transition-colors hover:bg-[#e8ecf4]/90 hover:text-[#1e3a5f]"
                                        >
                                            {price}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                <SelectTrigger className="h-10 w-full min-w-[150px] border border-[#d4af37]/30 bg-white text-sm font-medium text-[#1e3a5f] shadow-md transition-all duration-300 hover:border-[#d4af37]/50 sm:w-44">
                                    <SelectValue placeholder="Duration" />
                                </SelectTrigger>
                                <SelectContent className="border border-[#d4af37]/20 bg-white shadow-2xl">
                                    {durationOptions.map((duration) => (
                                        <SelectItem
                                            key={duration}
                                            value={duration}
                                            className="text-sm text-[#1e3a5f] transition-colors hover:bg-[#e8ecf4]/90 hover:text-[#1e3a5f]"
                                        >
                                            {duration}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedPax} onValueChange={setSelectedPax}>
                                <SelectTrigger className="h-10 w-full min-w-[170px] border border-[#d4af37]/30 bg-white text-sm font-medium text-[#1e3a5f] shadow-md transition-all duration-300 hover:border-[#d4af37]/50 sm:w-52">
                                    <SelectValue placeholder="Group Size" />
                                </SelectTrigger>
                                <SelectContent className="border border-[#d4af37]/20 bg-white shadow-2xl">
                                    {paxOptions.map((pax) => (
                                        <SelectItem
                                            key={pax}
                                            value={pax}
                                            className="text-sm text-[#1e3a5f] transition-colors hover:bg-[#e8ecf4]/90 hover:text-[#1e3a5f]"
                                        >
                                            {pax}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Packages Grid - ✅ Click to expand for full details */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPackages.map((pkg) => (
                            <article
                                key={pkg.id}
                                onClick={() => setExpandedPackageId((prev) => (prev === pkg.id ? null : pkg.id))}
                                className="group cursor-pointer overflow-hidden rounded-3xl border-2 border-[#d4af37]/25 bg-white shadow-2xl transition-all duration-300 hover:-translate-y-2.5 hover:scale-105 hover:border-[#d4af37]/50"
                            >
                                <div
                                    className={
                                        pkg.from_database
                                            ? 'relative aspect-[3/4] cursor-zoom-in overflow-hidden bg-slate-100 sm:aspect-[4/5]'
                                            : 'relative aspect-video cursor-zoom-in overflow-hidden'
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setImageLightbox({
                                            src: packageCardImageSrc(pkg),
                                            alt: pkg.title,
                                            caption: (pkg as { imageCaption?: string }).imageCaption,
                                        });
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setImageLightbox({
                                                src: packageCardImageSrc(pkg),
                                                alt: pkg.title,
                                                caption: (pkg as { imageCaption?: string }).imageCaption,
                                            });
                                        }
                                    }}
                                    aria-label="Click to view full size image"
                                >
                                    <img
                                        src={packageCardImageSrc(pkg)}
                                        alt={pkg.title}
                                        title="Click to view full size"
                                        data-package-id={pkg.id}
                                        loading="lazy"
                                        decoding="async"
                                        className={
                                            pkg.from_database
                                                ? 'h-full w-full object-contain object-top transition-transform duration-700 group-hover:scale-[1.02]'
                                                : 'h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                                        }
                                        onError={(e) => {
                                            const target = e.currentTarget;
                                            if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                                                const currentUrl = target.src;
                                                if (currentUrl.includes('/public/')) {
                                                    target.src = currentUrl.replace('/public/', '/');
                                                } else {
                                                    target.src = currentUrl.replace('assets.cahayaanbiya.com/', 'assets.cahayaanbiya.com/public/');
                                                }
                                            } else {
                                                target.style.display = 'none';
                                                const nextElement = target.nextElementSibling as HTMLElement;
                                                if (nextElement) nextElement.style.display = 'block';
                                            }
                                        }}
                                    />
                                    <PlaceholderImage className="hidden h-full w-full object-cover" />

                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                                        <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                                            <ImageIcon className="h-8 w-8 text-white" strokeWidth={2} />
                                        </div>
                                    </div>

                                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white shadow-xl">
                                            {pkg.type}
                                        </span>
                                        {(pkg as { freeBadge?: string }).freeBadge && (
                                            <span className="rounded-full bg-accent/90 px-3 py-1.5 text-xs font-bold text-white shadow-xl">
                                                {(pkg as { freeBadge?: string }).freeBadge}
                                            </span>
                                        )}
                                    </div>

                                    <div className="pointer-events-none absolute inset-0 bg-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-0" />
                                </div>
                                {(pkg as { imageCaption?: string }).imageCaption && (
                                    <p
                                        className="border-b border-gray-200 px-4 py-2 text-xs leading-snug text-[#64748b]"
                                        title={(pkg as { imageCaption?: string }).imageCaption}
                                    >
                                        <span className="line-clamp-2">{(pkg as { imageCaption?: string }).imageCaption}</span>
                                    </p>
                                )}

                                <div className="p-6">
                                    <h3 className="mb-2 text-xl font-bold text-[#1e3a5f] transition-colors group-hover:text-primary sm:text-2xl">
                                        {pkg.title}
                                    </h3>
                                    <p className="mb-3 text-sm leading-relaxed text-[#475569] sm:text-base">
                                        {pkg.location} • {pkg.duration}
                                    </p>

                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2">
                                                {(pkg as { priceOriginal?: string }).priceOriginal && (
                                                    <span className="text-sm font-medium text-[#94a3b8] line-through">
                                                        {(pkg as { priceOriginal?: string }).priceOriginal}
                                                    </span>
                                                )}
                                                <span className="text-xl font-bold text-primary sm:text-2xl">
                                                    {pkg.price}
                                                </span>
                                            </div>
                                            {(pkg as { priceNote?: string }).priceNote && (
                                                <span className="text-xs text-[#64748b]">{(pkg as { priceNote?: string }).priceNote}</span>
                                            )}
                                        </div>
                                        <div className="text-xs font-medium text-[#64748b] sm:text-sm">
                                            {pkg.pax}
                                        </div>
                                    </div>

                                    <p
                                        className={`mb-3 text-xs text-[#475569] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-sm ${expandedPackageId === pkg.id ? 'line-clamp-none' : 'line-clamp-2'}`}
                                    >
                                        {pkg.description}
                                    </p>

                                    <AnimatePresence initial={false}>
                                        {expandedPackageId === pkg.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{
                                                    height: 'auto',
                                                    opacity: 1,
                                                    transition: {
                                                        height: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                                                        opacity: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                                                    },
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                    transition: {
                                                        height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                                                        opacity: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                                                    },
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <motion.div
                                                    initial="closed"
                                                    animate="open"
                                                    exit="closed"
                                                    variants={{
                                                        open: {
                                                            transition: {
                                                                staggerChildren: 0.06,
                                                                delayChildren: 0.08,
                                                            },
                                                        },
                                                        closed: {
                                                            transition: {
                                                                staggerChildren: 0.03,
                                                                staggerDirection: -1,
                                                            },
                                                        },
                                                    }}
                                                    className="space-y-4 border-t border-gray-200 pt-4"
                                                >
                                                    {pkg.highlights && pkg.highlights.length > 0 && (
                                                        <motion.div
                                                            variants={{
                                                                open: { opacity: 1, y: 0 },
                                                                closed: { opacity: 0, y: -8 },
                                                            }}
                                                        >
                                                            <h4 className="mb-2 text-xs font-semibold tracking-wider text-primary/90 uppercase">
                                                                Highlight
                                                            </h4>
                                                            <ul className="flex flex-wrap gap-1.5">
                                                                {pkg.highlights.map((h, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs text-[#1e3a5f]"
                                                                    >
                                                                        {h}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </motion.div>
                                                    )}
                                                    {pkg.features && pkg.features.length > 0 && (
                                                        <motion.div
                                                            variants={{
                                                                open: { opacity: 1, y: 0 },
                                                                closed: { opacity: 0, y: -8 },
                                                            }}
                                                        >
                                                            <h4 className="mb-2 text-xs font-semibold tracking-wider text-primary/90 uppercase">
                                                                Include
                                                            </h4>
                                                            <ul className="space-y-1 text-xs text-[#475569]">
                                                                {pkg.features.map((f, i) => (
                                                                    <li key={i} className="flex items-center gap-2">
                                                                        <span className="text-accent">✓</span> {f}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </motion.div>
                                                    )}
                                                    {pkg.dates && pkg.dates.length > 0 && (
                                                        <motion.div
                                                            variants={{
                                                                open: { opacity: 1, y: 0 },
                                                                closed: { opacity: 0, y: -8 },
                                                            }}
                                                        >
                                                            <h4 className="mb-2 text-xs font-semibold tracking-wider text-primary/90 uppercase">
                                                                Tanggal Keberangkatan
                                                            </h4>
                                                            <ul className="space-y-1 text-xs text-[#475569]">
                                                                {pkg.dates.map((d, i) => (
                                                                    <li key={i} className="flex items-center justify-between gap-2">
                                                                        <span>{d.date}</span>
                                                                        <span
                                                                            className={`rounded px-2 py-0.5 text-[10px] font-medium ${d.status === 'Available' ? 'bg-green-500/30 text-green-200' : d.status === 'Limited' ? 'bg-accent/30 text-white' : 'bg-red-500/30 text-red-200'}`}
                                                                        >
                                                                            {d.status}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </motion.div>
                                                    )}
                                                    {pkg.hotels && pkg.hotels.length > 0 && (
                                                        <motion.div
                                                            variants={{
                                                                open: { opacity: 1, y: 0 },
                                                                closed: { opacity: 0, y: -8 },
                                                            }}
                                                        >
                                                            <h4 className="mb-2 text-xs font-semibold tracking-wider text-primary/90 uppercase">
                                                                Hotel
                                                            </h4>
                                                            <ul className="space-y-1.5 text-xs text-[#475569]">
                                                                {pkg.hotels.map((h, i) => (
                                                                    <li key={i} className="flex items-center gap-2">
                                                                        <span className="text-accent">{'★'.repeat(h.stars)}</span>
                                                                        <span className="font-medium">{h.name}</span>
                                                                        <span className="text-[#64748b]">• {h.location}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <span className="flex items-center gap-1 text-xs font-medium text-primary/90 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                                            {expandedPackageId === pkg.id ? (
                                                <>
                                                    <ChevronUp className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />{' '}
                                                    Tutup detail
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />{' '}
                                                    Klik untuk detail lengkap
                                                </>
                                            )}
                                        </span>
                                        <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                                            {pkg.from_database && pkg.slug ? (
                                                pkg.registration_open ? (
                                                    <Link
                                                        href={`/packages/register/${pkg.slug}`}
                                                        className="rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-center text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-primary/90 hover:to-accent/90"
                                                    >
                                                        Register Online
                                                    </Link>
                                                ) : (
                                                    <span className="rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-center text-xs font-bold text-white/70">
                                                        Registration closed
                                                    </span>
                                                )
                                            ) : (
                                            <a
                                                href="https://wa.me/6285285522122"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-center text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-primary/90 hover:to-accent/90"
                                            >
                                                Register Now
                                            </a>
                                            )}
                                            <a
                                                href="https://wa.me/6285285522121"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-xl border border-primary px-4 py-2 text-center text-xs font-bold text-primary transition-all hover:scale-105 hover:bg-primary hover:text-white"
                                            >
                                                Ask
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`h-1.5 origin-left bg-gradient-to-r from-primary via-accent to-primary shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${expandedPackageId === pkg.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                                />
                            </article>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredPackages.length === 0 && (
                        <div className="mt-16 text-center">
                            <div className="mx-auto max-w-md rounded-3xl border-2 border-[#d4af37]/25 bg-white p-12 shadow-2xl">
                                <div className="mb-6 text-6xl">{hasDbPackages && packages.length === 0 ? '📦' : '🔍'}</div>
                                <h3 className="mb-3 text-2xl font-bold text-[#1e3a5f]">
                                    {hasDbPackages && packages.length === 0
                                        ? 'Tidak ada paket buka pendaftaran'
                                        : 'Tidak ada paket yang cocok'}
                                </h3>
                                <p className="text-base text-[#475569]">
                                    {hasDbPackages && packages.length === 0
                                        ? 'Hanya paket dengan status Open (di Admin → Packages) yang tampil di sini. Set status ke Open untuk mengaktifkan tombol Register Online, atau longgarkan filter di atas.'
                                        : 'Coba ubah filter tipe, harga, durasi, atau ukuran grup.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Gallery Section */}
                    <div className="relative pt-12 md:pt-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <div className="mb-10 text-center">
                                <div className="mb-3 inline-block">
                                    <div className="rounded-full border-2 border-[#d4af37] bg-[#d4af37]/15 px-6 py-3 shadow-md">
                                        <span className="text-sm font-bold tracking-wider text-[#b8860b] uppercase">
                                            <EditableText sectionKey="packages.gallery.badge" value="📸 Destination Gallery" tag="span" />
                                        </span>
                                    </div>
                                </div>
                                <h2 className="mb-2 text-3xl leading-tight font-bold text-[#1e3a5f] sm:text-4xl md:text-5xl">
                                    <EditableText sectionKey="packages.gallery.title" value="Explore Our Destinations" tag="span" />
                                </h2>
                                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base md:text-lg">
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
                                        className="group relative overflow-hidden rounded-3xl border-2 border-[#d4af37]/25 bg-white shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
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
                                                <div className="absolute right-4 bottom-4 z-20">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setGalleryEditorOpen({
                                                                id: destination.id,
                                                                title: getContent(`packages.gallery.${destination.id}.title`, destination.title),
                                                                subtitle: getContent(
                                                                    `packages.gallery.${destination.id}.subtitle`,
                                                                    destination.subtitle,
                                                                ),
                                                                description: getContent(
                                                                    `packages.gallery.${destination.id}.description`,
                                                                    destination.description,
                                                                ),
                                                                category: getContent(
                                                                    `packages.gallery.${destination.id}.category`,
                                                                    destination.category,
                                                                ),
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

                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
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

                                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary via-accent to-primary shadow-lg transition-all duration-500 group-hover:w-full" />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12">
                                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                                    <div className="inline-flex items-center rounded-full border border-primary/60 bg-gradient-to-r from-primary/25 to-accent/25 px-5 py-2.5 shadow-lg transition-all duration-300 hover:border-primary/70 hover:shadow-primary/20">
                                        <span className="text-xs font-semibold text-white sm:text-sm">
                                            ✨ Ready to Experience These Amazing Destinations?
                                        </span>
                                    </div>
                                    <a
                                        href="/destinations"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-primary/90 hover:to-accent/90 hover:shadow-primary/30 sm:px-8 sm:py-3 sm:text-base"
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
                <footer className="relative border-t-2 border-[#d4af37]/30 bg-gradient-to-b from-[#1e3a5f] to-[#2d4a6f]">
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
                                        className="text-base font-semibold text-white/70 transition-all hover:scale-110 hover:text-primary"
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

            {/* Image Lightbox – tutup via tombol X, klik area luar gambar, atau ESC */}
            <AnimatePresence>
                {imageLightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lightbox-backdrop fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setImageLightbox(null);
                        }}
                        onPointerDown={(e) => {
                            if (e.target === e.currentTarget) setImageLightbox(null);
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Tampilan gambar diperbesar"
                        style={{ touchAction: 'manipulation' }}
                    >
                        {/* Close Button - selalu terlihat, besar untuk mobile */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setImageLightbox(null);
                            }}
                            onPointerDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setImageLightbox(null);
                            }}
                            className="absolute top-3 right-3 z-[10001] flex h-12 w-12 min-w-[48px] min-h-[48px] touch-manipulation items-center justify-center rounded-full border-2 border-white/60 bg-black/60 text-white shadow-xl transition-all hover:bg-black/80 hover:border-white/80 active:scale-95 sm:top-4 sm:right-4 sm:h-14 sm:w-14 sm:min-w-[56px] sm:min-h-[56px]"
                            aria-label="Tutup gambar"
                            style={{
                                WebkitTapHighlightColor: 'transparent',
                                touchAction: 'manipulation',
                                cursor: 'pointer',
                            }}
                        >
                            <X className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.5} />
                        </button>
                        <motion.div
                            ref={lightboxContentRef}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-shrink-0 flex-col items-center justify-center gap-4"
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            style={{ touchAction: 'manipulation' }}
                        >
                            <div className="flex max-h-[90vh] max-w-[90vw] items-center justify-center">
                                <img
                                    src={imageLightbox.src}
                                    alt={imageLightbox.alt}
                                    className="h-auto max-h-[85vh] w-auto max-w-[85vw] rounded-lg object-contain shadow-2xl select-none"
                                    draggable={false}
                                    style={{
                                        pointerEvents: 'none',
                                        display: 'block',
                                        margin: '0 auto',
                                        userSelect: 'none',
                                        WebkitUserSelect: 'none',
                                    }}
                                />
                            </div>
                            {imageLightbox.caption && (
                                <p className="mt-2 max-w-2xl px-4 text-center text-sm text-white/80">{imageLightbox.caption}</p>
                            )}
                            <p className="mt-2 text-center text-xs text-white/50">Tap X, tap area gelap, atau ESC untuk menutup</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gallery Editor Modal — package cards are edited in Admin → B2C packages */}
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
                                        className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-300">Description</label>
                                <textarea
                                    value={galleryEditorOpen.description}
                                    onChange={(e) => setGalleryEditorOpen({ ...galleryEditorOpen, description: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-300">Replace Image</label>
                                <p className="mb-2 rounded-lg border border-primary/30 bg-primary/20 px-3 py-2 text-xs text-white/90">
                                    {IMAGE_GUIDE}
                                </p>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setCropImageSrc(URL.createObjectURL(file));
                                            setCropModalTarget('gallery');
                                            setCropModalOpen(true);
                                        }
                                        e.target.value = '';
                                    }}
                                    className="w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90"
                                />
                                {galleryPendingFile && <p className="mt-2 text-xs text-emerald-400">✓ Gambar siap (sudah di-adjust)</p>}
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
                                            const compressed = await compressImageForUpload(galleryPendingFile);
                                            const form = new FormData();
                                            form.append('key', `packages.gallery.${galleryEditorOpen.id}.image`);
                                            form.append('image', compressed);
                                            const r = await axios.post('/admin/upload-image', form, {
                                                headers: { Accept: 'application/json' },
                                            });
                                            const url = r.data?.url || r.data?.imageUrl;
                                            if (url) {
                                                const img = document.querySelector(
                                                    `img[data-gallery-id="${galleryEditorOpen.id}"]`,
                                                ) as HTMLImageElement | null;
                                                if (img) img.src = url;
                                            }
                                        }
                                        setGalleryEditorOpen(null);
                                        setGalleryPendingFile(null);
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
                                }}
                                disabled={saving}
                                className="rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-60"
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
                        if (cropModalTarget === 'gallery') {
                            setGalleryPendingFile(file);
                        }
                        URL.revokeObjectURL(cropImageSrc);
                        setCropImageSrc(null);
                        setCropModalTarget(null);
                    }}
                    onCancel={() => {
                        URL.revokeObjectURL(cropImageSrc);
                        setCropImageSrc(null);
                        setCropModalTarget(null);
                    }}
                />
            )}
        </PublicLayout>
    );
}
