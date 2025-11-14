import { EditableText } from '@/components/cms';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HeroImage } from '@/components/HeroImage';
import PublicLayout from '@/layouts/public-layout';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Edit3, History } from 'lucide-react';
import { useEffect, useState } from 'react';

// Hero slides data
const slides = [
    {
        id: 1,
        title: 'Umrah Premium',
        subtitle: 'Comfort-first journeys',
        image: '/umrah.jpeg',
    },
    {
        id: 2,
        title: 'Hajj Packages',
        subtitle: 'Spiritual journey of a lifetime',
        image: '/arabsaudi.jpg',
    },
    {
        id: 3,
        title: 'Turkey Tours',
        subtitle: "Discover Istanbul's beauty",
        image: '/TURKEY.jpeg',
    },
    {
        id: 4,
        title: 'Egypt Adventures',
        subtitle: 'Ancient wonders await',
        image: '/egypt.jpeg',
    },
    {
        id: 5,
        title: 'Jordan Explorer',
        subtitle: 'Petra and beyond',
        image: '/jordan.jpeg',
    },
];

// Best Sellers destinations
const bestSellers = [
    {
        id: 1,
        title: 'Arab Saudi',
        subtitle: 'Spiritual journey to Holy Land',
        image: '/arabsaudi.jpg',
        tag: 'Best Seller',
    },
    {
        id: 2,
        title: 'Turkey Heritage',
        subtitle: 'Istanbul to Cappadocia',
        image: '/TURKEY.jpeg',
        tag: 'Best Seller',
    },
    {
        id: 3,
        title: 'Egypt Wonders',
        subtitle: 'Pyramids & Nile River',
        image: '/egypt.jpeg',
        tag: 'Best Seller',
    },
    {
        id: 4,
        title: 'Dubai Luxury',
        subtitle: 'Modern wonders',
        image: '/dubai1.jpeg',
        tag: 'Best Seller',
    },
];

// New Destinations
const newDestinations = [
    {
        id: 1,
        title: 'Oman Adventure',
        subtitle: 'Muscat + Nizwa + Wahiba Sands',
        image: '/oman.jpg',
        tag: 'New',
    },
    {
        id: 2,
        title: 'Qatar Luxury',
        subtitle: 'Doha + The Pearl + Desert',
        image: '/qatar.jpg',
        tag: 'New',
    },
    {
        id: 3,
        title: 'Kuwait Heritage',
        subtitle: 'Kuwait City + Failaka Island',
        image: '/kuwait.jpg',
        tag: 'New',
    },
    {
        id: 4,
        title: 'Bahrain Pearl',
        subtitle: "Manama + Qal'at al-Bahrain",
        image: '/bahrain.jpg',
        tag: 'New',
    },
];

// Highlights destinations
const highlights = [
    {
        id: 1,
        title: 'Kaaba Experience',
        subtitle: 'Spiritual journey to the heart of Islam',
        image: '/arabsaudi.jpg',
        tag: 'Featured',
    },
    {
        id: 2,
        title: 'Cappadocia Magic',
        subtitle: 'Hot air balloon adventure',
        image: '/TURKEY.jpeg',
        tag: 'Featured',
    },
    {
        id: 3,
        title: 'Pyramids Wonder',
        subtitle: 'Ancient Egyptian marvels',
        image: '/egypt.jpeg',
        tag: 'Featured',
    },
    {
        id: 4,
        title: 'Dubai Desert',
        subtitle: 'Luxury desert safari',
        image: '/dubai1.jpeg',
        tag: 'Featured',
    },
];

const heroImageVariants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

const heroContentVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
};

const titleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

const subtitleVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
};

const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

const buttonHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
};

export default function Home() {
    const [index, setIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    // Listen to global edit mode flag from provider without using the hook to avoid context order issues
    const [editMode, setEditModeUI] = useState<boolean>(false);
    useEffect(() => {
        const check = () => setEditModeUI(document.documentElement.classList.contains('cms-edit'));
        check();
        const handler = () => check();
        window.addEventListener('cms:mode', handler as EventListener);
        return () => window.removeEventListener('cms:mode', handler as EventListener);
    }, []);
    
    // Helper functions to mark dirty state (dispatch events to EditModeProvider)
    const markDirty = () => {
        // Dispatch event to mark dirty via global mechanism
        window.dispatchEvent(new CustomEvent('cms:mark-dirty'));
    };
    
    const clearDirty = () => {
        // Dispatch event to clear dirty via global mechanism
        window.dispatchEvent(new CustomEvent('cms:clear-dirty'));
    };
    
    const [editorOpen, setEditorOpen] = useState<null | { section: 'bestsellers' | 'new' | 'hl'; id: number; title: string; subtitle: string }>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [imageTargetKey, setImageTargetKey] = useState<string | null>(null);
    const hiddenImageInputId = 'home-image-replacer';
    const [saving, setSaving] = useState(false);
    
    // NEW: Store pending image uploads (key -> file mapping)
    const [pendingImageUploads, setPendingImageUploads] = useState<Map<string, File>>(new Map());
    const [imagePreviewUrls, setImagePreviewUrls] = useState<Map<string, string>>(new Map());

    // Get sections data from Inertia props (database)
    const { props } = usePage<{ sections?: Record<string, { content?: string; image?: string }> }>();

    // State for hero slides - ALWAYS prioritize database
    const [heroSlides, setHeroSlides] = useState(() => {
        // Initialize with database data if available
        console.log('🔧 Initializing hero slides...');
        return slides.map((slide) => {
            const dbImage = props.sections?.[`home.hero.${slide.id}.image`]?.image;
            if (dbImage) {
                console.log(`  ✓ Init Hero ${slide.id} with DB:`, dbImage.split('/').pop()?.split('?')[0]);
                return { ...slide, image: dbImage };
            }
            return slide;
        });
    });

    // Sync hero slides with database - CRITICAL: Always use DB data
    useEffect(() => {
        console.log('🔄 Syncing hero slides with database...');
        console.log('📦 Sections data:', props.sections ? Object.keys(props.sections).length + ' keys' : 'undefined');
        
        const updatedSlides = slides.map((slide) => {
            const dbImage = props.sections?.[`home.hero.${slide.id}.image`]?.image;
            const dbTitle = props.sections?.[`home.hero.${slide.id}.title`]?.content;
            const dbSubtitle = props.sections?.[`home.hero.${slide.id}.subtitle`]?.content;
            
            if (dbImage) {
                const filename = dbImage.split('/').pop()?.split('?')[0] || 'unknown';
                console.log(`  ✓ Hero ${slide.id}: Using DB image:`, filename);
            } else {
                console.log(`  ○ Hero ${slide.id}: No DB image, using default:`, slide.image);
            }
            
            // ALWAYS use DB data if available - DB wins over static!
            return {
                id: slide.id,
                title: dbTitle || slide.title,
                subtitle: dbSubtitle || slide.subtitle,
                image: dbImage || slide.image, // DB FIRST!
            };
        });
        
        // Force state update - clear any preview/upload state
        setHeroSlides(updatedSlides);
        console.log('✅ Hero slides synced! DB data applied.');
    }, [props.sections]);

    // Listen for global save event to upload all pending images
    useEffect(() => {
        const handleGlobalSave = async () => {
            if (pendingImageUploads.size === 0) {
                console.log('💡 No pending image uploads');
                return;
            }

            console.log(`📤 Uploading ${pendingImageUploads.size} pending image(s)...`);
            setSaving(true);

            try {
                // Upload all pending images in parallel
                const uploadPromises = Array.from(pendingImageUploads.entries()).map(async ([key, file]) => {
                    const form = new FormData();
                    form.append('key', key);
                    form.append('image', file);
                    
                    console.log('⏳ Uploading:', key);
                    const response = await axios.post('/admin/upload-image', form, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    console.log('✅ Uploaded:', key);
                    return response;
                });

                await Promise.all(uploadPromises);

                // Clear all pending uploads
                setPendingImageUploads(new Map());
                
                // Cleanup all preview URLs
                imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
                setImagePreviewUrls(new Map());

                console.log('✅ All images uploaded successfully!');

                // Reload to get fresh data from database
                router.reload({ 
                    only: ['sections'],
                    onSuccess: () => {
                        console.log('✅ Data reloaded from database');
                    }
                });
                
            } catch (error) {
                console.error('❌ Image upload failed:', error);
                alert('Failed to upload images: ' + (error as any).message);
            } finally {
                setSaving(false);
            }
        };

        window.addEventListener('cms:flush-save', handleGlobalSave);
        return () => window.removeEventListener('cms:flush-save', handleGlobalSave);
    }, [pendingImageUploads, imagePreviewUrls]);

    useEffect(() => {
        // Disable auto-transition when in edit mode
        if (editMode) {
            return;
        }

        const interval = setInterval(() => {
            if (!isTransitioning) {
                setIndex((prev) => (prev + 1) % heroSlides.length);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isTransitioning, editMode, heroSlides.length]);
    
    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            // Cleanup all preview URLs when component unmounts
            imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imagePreviewUrls]);

    const handleSlideChange = (newIndex: number) => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setIndex(newIndex);

        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };

    const handlePrevSlide = () => {
        const newIndex = index === 0 ? heroSlides.length - 1 : index - 1;
        handleSlideChange(newIndex);
    };

    const handleNextSlide = () => {
        const newIndex = (index + 1) % heroSlides.length;
        handleSlideChange(newIndex);
    };

    const smoothScrollTo = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const currentSlide = heroSlides[index];

    return (
        <ErrorBoundary>
            <PublicLayout>
                <Head title="Home" />

                {/* Hero Section */}
                <section
                    className="relative z-[1] h-screen w-full"
                    style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 }}
                >
                    <div className="absolute inset-0">
                        <AnimatePresence mode="wait">
                            <HeroImage
                                key={currentSlide.id}
                                src={currentSlide.image}
                                alt={currentSlide.title}
                                className="h-full w-full"
                                variants={heroImageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            />
                        </AnimatePresence>
                    </div>

                    <div className="absolute inset-0 z-[5] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Edit Controls (only visible in edit mode) */}
                    {editMode && (
                        <div className="absolute top-3 right-3 z-[999] flex items-start gap-2">
                            {/* Replace Image Button - Compact & Refined */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('🖼️ Replace image clicked for slide:', currentSlide.id);
                                    setImageTargetKey(`home.hero.${currentSlide.id}.image`);
                                    const el = document.getElementById(hiddenImageInputId) as HTMLInputElement | null;
                                    el?.click();
                                }}
                                className={`relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg backdrop-blur-sm shadow-lg ring-2 transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 ${
                                    pendingImageUploads.has(`home.hero.${currentSlide.id}.image`)
                                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white ring-amber-300/50'
                                        : 'bg-white/95 text-gray-800 ring-white/40 hover:bg-white'
                                }`}
                                title={pendingImageUploads.has(`home.hero.${currentSlide.id}.image`) 
                                    ? '⏳ Image selected - Click "Save" to upload' 
                                    : 'Replace hero image - Click to upload new photo'}
                                type="button"
                            >
                                <Camera className="h-5 w-5" strokeWidth={2.5} />
                                
                                {/* Pending Badge - Small & Subtle */}
                                {pendingImageUploads.has(`home.hero.${currentSlide.id}.image`) && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md ring-1 ring-white"
                                    >
                                        1
                                    </motion.div>
                                )}
                            </button>
                            
                            {/* Total Pending Counter - Compact Badge */}
                            {pendingImageUploads.size > 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 backdrop-blur-sm px-2.5 py-1.5 text-[11px] font-bold text-white shadow-lg ring-1 ring-amber-300/50"
                                >
                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px]">
                                        {pendingImageUploads.size}
                                    </div>
                                    <span>pending</span>
                                </motion.div>
                            )}
                        </div>
                    )}

                    <div className="relative z-10 flex h-full items-center justify-center px-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`content-${currentSlide.id}`}
                                className="max-w-4xl text-center text-white"
                                variants={heroContentVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <motion.h1 className="mb-4 text-4xl font-bold md:text-6xl" variants={titleVariants}>
                                    <EditableText sectionKey={`home.hero.${currentSlide.id}.title`} value={currentSlide.title} tag="span" />
                                </motion.h1>

                                <motion.p className="mb-8 text-lg opacity-90 md:text-xl" variants={subtitleVariants}>
                                    <EditableText sectionKey={`home.hero.${currentSlide.id}.subtitle`} value={currentSlide.subtitle} tag="span" />
                                </motion.p>

                                <motion.div variants={buttonVariants}>
                                    <motion.button
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#FF8C00] px-8 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#FF7F00]"
                                        variants={buttonHover}
                                        initial="rest"
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={() => smoothScrollTo('best-sellers')}
                                    >
                                        Explore Destinations
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Arrows (only visible in edit mode) */}
                    {editMode && (
                        <>
                            {/* Left Arrow */}
                            <button
                                onClick={handlePrevSlide}
                                className="absolute top-1/2 left-4 z-[25] -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black/70"
                                aria-label="Previous slide"
                                type="button"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Right Arrow */}
                            <button
                                onClick={handleNextSlide}
                                className="absolute top-1/2 right-4 z-[25] -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black/70"
                                aria-label="Next slide"
                                type="button"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform">
                        <div className="flex space-x-2">
                            {heroSlides.map((_, i) => (
                                <button
                                    key={i}
                                    className={`h-3 w-3 rounded-full transition-all duration-300 ${i === index ? 'bg-[#FF8C00]' : 'bg-white/50 hover:bg-white/80'}`}
                                    onClick={() => handleSlideChange(i)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Best Sellers Section */}
                <section id="best-sellers" className="bg-black py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-16 text-left">
                            <h2 className="mb-4 text-4xl font-bold text-white">Best Sellers</h2>
                            <p className="max-w-2xl text-xl text-[#A0A0A0]">Discover our most loved travel experiences</p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {bestSellers.map((item) => (
                                <div
                                    key={item.id}
                                    className="group cursor-pointer overflow-hidden rounded-xl bg-[#1A1A1A] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className="rounded-md bg-[#FF8C00] px-3 py-1 text-xs font-semibold text-white">{item.tag}</span>
                                        </div>
                                        {editMode && (
                                            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                                {/* Replace Image Button - Camera Icon */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImageTargetKey(`home.bestsellers.${item.id}.image`);
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
                                                            section: 'bestsellers',
                                                            id: item.id,
                                                            title: item.title,
                                                            subtitle: item.subtitle,
                                                        });
                                                    }}
                                                    className="group/edit inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 backdrop-blur-sm text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:from-blue-600 hover:to-indigo-700 hover:scale-110 hover:shadow-2xl hover:ring-blue-300"
                                                    title="Edit all details - Title and subtitle"
                                                >
                                                    <Edit3 className="h-5 w-5 transition-transform group-hover/edit:rotate-12" strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="mb-2 text-xl font-bold text-white">
                                            <EditableText sectionKey={`home.bestsellers.${item.id}.title`} value={item.title} tag="span" />
                                        </h3>
                                        <p className="text-[#A0A0A0]">
                                            <EditableText sectionKey={`home.bestsellers.${item.id}.subtitle`} value={item.subtitle} tag="span" />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* New Destinations Section */}
                <section className="bg-black py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-16 text-left">
                            <h2 className="mb-4 text-4xl font-bold text-white">New Destinations</h2>
                            <p className="max-w-2xl text-xl text-[#A0A0A0]">Fresh adventures and undiscovered gems</p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {newDestinations.map((item) => (
                                <div
                                    key={item.id}
                                    className="group cursor-pointer overflow-hidden rounded-xl bg-[#1A1A1A] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className="rounded-full bg-[#FF8C00] px-3 py-1 text-xs font-semibold text-white">{item.tag}</span>
                                        </div>
                                        {editMode && (
                                            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                                {/* Replace Image Button - Camera Icon */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImageTargetKey(`home.new.${item.id}.image`);
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
                                                        setEditorOpen({ section: 'new', id: item.id, title: item.title, subtitle: item.subtitle });
                                                    }}
                                                    className="group/edit inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 backdrop-blur-sm text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:from-blue-600 hover:to-indigo-700 hover:scale-110 hover:shadow-2xl hover:ring-blue-300"
                                                    title="Edit all details - Title and subtitle"
                                                >
                                                    <Edit3 className="h-5 w-5 transition-transform group-hover/edit:rotate-12" strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="mb-2 text-xl font-bold text-white">
                                            <EditableText sectionKey={`home.new.${item.id}.title`} value={item.title} tag="span" />
                                        </h3>
                                        <p className="text-[#A0A0A0]">
                                            <EditableText sectionKey={`home.new.${item.id}.subtitle`} value={item.subtitle} tag="span" />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Highlights Section */}
                <section className="bg-black py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-16 text-left">
                            <h2 className="mb-4 text-4xl font-bold text-white">Highlights</h2>
                            <p className="max-w-2xl text-xl text-[#A0A0A0]">Moments that make every journey unforgettable</p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {highlights.map((item) => (
                                <div
                                    key={item.id}
                                    className="group cursor-pointer overflow-hidden rounded-xl bg-[#1A1A1A] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className="rounded-md bg-[#FF8C00] px-3 py-1 text-xs font-semibold text-white">{item.tag}</span>
                                        </div>
                                        {editMode && (
                                            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                                {/* Replace Image Button - Camera Icon */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImageTargetKey(`home.hl.${item.id}.image`);
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
                                                        setEditorOpen({ section: 'hl', id: item.id, title: item.title, subtitle: item.subtitle });
                                                    }}
                                                    className="group/edit inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 backdrop-blur-sm text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:from-blue-600 hover:to-indigo-700 hover:scale-110 hover:shadow-2xl hover:ring-blue-300"
                                                    title="Edit all details - Title and subtitle"
                                                >
                                                    <Edit3 className="h-5 w-5 transition-transform group-hover/edit:rotate-12" strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="mb-2 text-xl font-bold text-white">
                                            <EditableText sectionKey={`home.hl.${item.id}.title`} value={item.title} tag="span" />
                                        </h3>
                                        <p className="text-[#A0A0A0]">
                                            <EditableText sectionKey={`home.hl.${item.id}.subtitle`} value={item.subtitle} tag="span" />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {editMode && editorOpen && (
                    <div className="fixed bottom-6 left-1/2 z-[9998] w-[min(640px,92vw)] -translate-x-1/2 rounded-xl border border-white/10 bg-black/80 p-4 backdrop-blur">
                        <div className="mb-3 text-sm font-semibold text-white">
                            Edit Content — {editorOpen.section} #{editorOpen.id}
                        </div>
                        <div className="grid gap-3">
                            <label className="text-xs text-gray-300">Title</label>
                            <input
                                value={editorOpen.title}
                                onChange={(e) => setEditorOpen({ ...editorOpen, title: e.target.value })}
                                className="rounded-md border border-white/15 bg-black/60 px-3 py-2 text-sm text-white ring-amber-400/0 outline-none focus:ring-2"
                            />
                            <label className="mt-2 text-xs text-gray-300">Subtitle</label>
                            <textarea
                                value={editorOpen.subtitle}
                                onChange={(e) => setEditorOpen({ ...editorOpen, subtitle: e.target.value })}
                                rows={3}
                                className="rounded-md border border-white/15 bg-black/60 px-3 py-2 text-sm text-white ring-amber-400/0 outline-none focus:ring-2"
                            />
                            <label className="mt-2 text-xs text-gray-300">Replace image</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
                                className="text-xs text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black hover:file:bg-amber-400"
                            />
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-3">
                            <button
                                onClick={() => {
                                    setEditorOpen(null);
                                    setPendingFile(null);
                                }}
                                className="rounded-md px-3 py-2 text-sm text-gray-300 ring-1 ring-white/15 hover:bg-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!editorOpen) return;
                                    setSaving(true);
                                    try {
                                        await axios.post('/admin/update-section', {
                                            key: `home.${editorOpen.section}.${editorOpen.id}.title`,
                                            content: editorOpen.title,
                                        });
                                        await axios.post('/admin/update-section', {
                                            key: `home.${editorOpen.section}.${editorOpen.id}.subtitle`,
                                            content: editorOpen.subtitle,
                                        });
                                        if (pendingFile) {
                                            const form = new FormData();
                                            form.append('key', `home.${editorOpen.section}.${editorOpen.id}.image`);
                                            form.append('image', pendingFile);
                                            await axios.post('/admin/upload-image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                                        }
                                        setEditorOpen(null);
                                        setPendingFile(null);
                                        
                                        // Reload to fetch fresh data with success notification
                                        router.reload({ 
                                            only: ['sections'],
                                            onSuccess: () => {
                                                console.log('✅ Card content updated from database');
                                                
                                                // Show success notification
                                                const notification = document.createElement('div');
                                                notification.className = 'fixed top-20 right-4 z-[99999] rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-2xl';
                                                notification.innerHTML = `
                                                    <div class="flex items-center gap-3">
                                                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                        <div>
                                                            <div class="font-bold">Perubahan Berhasil!</div>
                                                            <div class="text-sm opacity-90">Semua perubahan tersimpan dengan backup</div>
                                                        </div>
                                                    </div>
                                                `;
                                                document.body.appendChild(notification);
                                                setTimeout(() => notification.remove(), 3000);
                                            }
                                        });
                                    } finally {
                                        setSaving(false);
                                    }
                                }}
                                disabled={saving}
                                className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black ring-1 ring-amber-300/60 hover:bg-amber-400 disabled:opacity-60"
                            >
                                {saving ? 'Saving…' : 'Save & Update'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Hidden file input for image replace */}
                {editMode && (
                    <input
                        id={hiddenImageInputId}
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file || !imageTargetKey) return;

                            console.log('🖼️ Image selected:', imageTargetKey);

                            // 🔴 CRITICAL: Mark as dirty to trigger save button!
                            markDirty();
                            console.log('✅ Marked as dirty - Save button will appear');

                            // Create preview URL
                            const previewUrl = URL.createObjectURL(file);
                            
                            // Store pending upload
                            setPendingImageUploads(prev => {
                                const newMap = new Map(prev);
                                newMap.set(imageTargetKey, file);
                                return newMap;
                            });
                            
                            // Store preview URL
                            setImagePreviewUrls(prev => {
                                const newMap = new Map(prev);
                                // Cleanup old preview URL if exists
                                const oldUrl = prev.get(imageTargetKey);
                                if (oldUrl) URL.revokeObjectURL(oldUrl);
                                newMap.set(imageTargetKey, previewUrl);
                                return newMap;
                            });

                            // Update hero slides with preview
                            const match = imageTargetKey.match(/home\.hero\.(\d+)\.image/);
                            if (match) {
                                const slideId = parseInt(match[1]);
                                setHeroSlides(prevSlides =>
                                    prevSlides.map(slide =>
                                        slide.id === slideId ? { ...slide, image: previewUrl } : slide
                                    )
                                );
                                console.log(`📸 Preview set for Hero ${slideId}`);
                            }

                            // Reset input
                                setImageTargetKey(null);
                                (e.target as HTMLInputElement).value = '';
                            
                            console.log('💡 Image ready for upload - Click "Save" button to upload');
                        }}
                    />
                )}

                {/* Footer Section */}
                <footer className="bg-black py-12">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex flex-col justify-between md:flex-row">
                            <div className="mb-6 md:mb-0">
                                <p className="mb-2 text-white">Email: hello@cahaya-anbiya.com</p>
                                <p className="text-white">WhatsApp: +62 812-3456-7890</p>
                            </div>
                            <div className="flex space-x-6 text-white">
                                <a href="#" className="transition-colors hover:text-[#FF8C00]">
                                    Instagram
                                </a>
                                <a href="#" className="transition-colors hover:text-[#FF8C00]">
                                    TikTok
                                </a>
                                <a href="#" className="transition-colors hover:text-[#FF8C00]">
                                    YouTube
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </PublicLayout>
        </ErrorBoundary>
    );
}
