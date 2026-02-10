import { EditableText, EditableVideo, ImageCropModal, triggerVideoUpload, useEditMode } from '@/components/cms';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { compressImageForUpload } from '@/utils/cmsImageUpload';
import { getImageUrl, getVideoUrl } from '@/utils/imageHelper';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Edit3, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Video component with R2 fallback - Simplified and safer
function VideoWithFallback({ r2Url, fallbackUrl }: { r2Url: string; fallbackUrl: string }) {
    try {
        const videoRef = useRef<HTMLVideoElement>(null);
        const [videoSrc, setVideoSrc] = useState(() => {
            try {
                // Always use R2 URL, never local path
                return r2Url || fallbackUrl || 'https://assets.cahayaanbiya.com/public/videos/b2cherosectionvideo.mp4';
            } catch {
                // Even on error, use R2 URL structure
                return 'https://assets.cahayaanbiya.com/public/videos/b2cherosectionvideo.mp4';
            }
        });
        const [hasError, setHasError] = useState(false);

        useEffect(() => {
            try {
                const video = videoRef.current;
                if (!video) return;

                const handleError = () => {
                    try {
                        if (!hasError && videoSrc && videoSrc.includes('assets.cahayaanbiya.com')) {
                            setHasError(true);
                            // Try alternative R2 path variations
                            const currentUrl = videoSrc;
                            let altUrl = fallbackUrl;

                            // Try multiple path variations
                            if (currentUrl.includes('/public/videos/')) {
                                // Try without /public/
                                altUrl = currentUrl.replace('/public/videos/', '/videos/');
                            } else if (currentUrl.includes('/public/')) {
                                // Try without /public/
                                altUrl = currentUrl.replace('/public/', '/');
                            } else if (currentUrl.includes('/videos/')) {
                                // Try with /public/ prefix
                                altUrl = currentUrl.replace('/videos/', '/public/videos/');
                            } else {
                                // Try with /public/videos/ prefix
                                const fileName = currentUrl.split('/').pop() || 'b2cherosectionvideo.mp4';
                                altUrl = `https://assets.cahayaanbiya.com/public/videos/${fileName}`;
                            }

                            console.log('[Video] Trying alternative R2 path:', altUrl);
                            setVideoSrc(altUrl || 'https://assets.cahayaanbiya.com/public/videos/b2cherosectionvideo.mp4');
                            video.load();
                        }
                    } catch (err) {
                        console.error('Error in video error handler:', err);
                    }
                };

                video.addEventListener('error', handleError);
                return () => {
                    try {
                        video.removeEventListener('error', handleError);
                    } catch (err) {
                        console.error('Error removing video event listener:', err);
                    }
                };
            } catch (err) {
                console.error('Error in VideoWithFallback useEffect:', err);
            }
        }, [videoSrc, fallbackUrl, hasError]);

        return (
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full"
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    minWidth: '100%',
                    minHeight: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    zIndex: 0,
                }}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    } catch (error) {
        console.error('Error rendering VideoWithFallback:', error);
        // Fallback to R2 URL, not local path
        try {
            const fallbackR2Url = getVideoUrl(fallbackUrl || 'b2cherosectionvideo.mp4');
            return (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full"
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        minWidth: '100%',
                        minHeight: '100%',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        zIndex: 0,
                    }}
                >
                    <source src={fallbackR2Url} type="video/mp4" />
                    <source src={fallbackUrl || 'https://assets.cahayaanbiya.com/public/videos/b2cherosectionvideo.mp4'} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        } catch (fallbackError) {
            console.error('Error in VideoWithFallback fallback:', fallbackError);
            // Last resort: use R2 URL directly
            return (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full"
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        minWidth: '100%',
                        minHeight: '100%',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        zIndex: 0,
                    }}
                >
                    <source src="https://assets.cahayaanbiya.com/public/videos/b2cherosectionvideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        }
    }
}

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

// Premium easing
const ease = [0.22, 1, 0.36, 1];

// Animation variants
const heroImageVariants = {
    initial: { opacity: 0, scale: 1.1, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
};

const heroContentVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

function HeroVideoUploadTrigger() {
    const { isAdmin, editMode } = useEditMode();
    if (!isAdmin || !editMode) return null;
    return (
        <button
            type="button"
            onClick={() => triggerVideoUpload('home.hero.video')}
            className="group inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 shadow-lg transition-all hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-white"
        >
            <span className="opacity-80 group-hover:opacity-100">Drag & Drop video or Click to replace</span>
        </button>
    );
}

export default function Home() {
    const [editMode, setEditModeUI] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    // Optimized scroll with throttling for better performance
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
        layoutEffect: false, // Use regular effect instead of layout effect for better performance
    });

    // Throttled transform to reduce re-renders
    const videoY = useTransform(scrollYProgress, [0, 1], [0, 200], {
        clamp: false,
    });

    useEffect(() => {
        const check = () => setEditModeUI(document.documentElement.classList.contains('cms-edit'));
        check();
        const handler = () => check();
        window.addEventListener('cms:mode', handler as EventListener);
        return () => window.removeEventListener('cms:mode', handler as EventListener);
    }, []);

    const markDirty = () => {
        window.dispatchEvent(new CustomEvent('cms:mark-dirty'));
    };

    const [editorOpen, setEditorOpen] = useState<null | { section: 'bestsellers' | 'new' | 'hl'; id: number; title: string; subtitle: string }>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [imageTargetKey, setImageTargetKey] = useState<string | null>(null);
    const hiddenImageInputId = 'home-image-replacer';
    const [saving, setSaving] = useState(false);

    const [pendingImageUploads, setPendingImageUploads] = useState<Map<string, File>>(new Map());
    const [imagePreviewUrls, setImagePreviewUrls] = useState<Map<string, string>>(new Map());

    const { props } = usePage<{
        sections?: Record<string, { content?: string; image?: string; video?: string }>;
        cmsMediaGuide?: { images?: { short?: string } };
    }>();
    const imageGuide = props.cmsMediaGuide?.images?.short ?? '1920×1080px recommended · Max 5MB · Auto-compressed';

    // Helper to get content from sections (no inline edit - edit only via pencil modal)
    const getContent = (key: string, fallback: string) => props.sections?.[key]?.content?.trim() || fallback;

    // Helper function to get image URL with R2 support
    const getImageSrc = (sectionKey: string, fallbackPath: string) => {
        return getImageUrl(props.sections, sectionKey, fallbackPath);
    };

    // Removed heroSlides state since we're using a single video now

    useEffect(() => {
        const handleGlobalSave = async () => {
            if (pendingImageUploads.size === 0) return;

            setSaving(true);

            try {
                const uploadPromises = Array.from(pendingImageUploads.entries()).map(async ([key, file]) => {
                    const compressed = await compressImageForUpload(file);
                    const form = new FormData();
                    form.append('key', key);
                    form.append('image', compressed);

                    const response = await axios.post('/admin/upload-image', form, {
                        headers: { Accept: 'application/json' },
                    });
                    return response;
                });

                await Promise.all(uploadPromises);

                setPendingImageUploads(new Map());

                imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
                setImagePreviewUrls(new Map());

                router.reload({
                    only: ['sections'],
                    onSuccess: () => {
                        console.log('✅ Data reloaded from database');
                    },
                });
            } catch (error) {
                console.error('❌ Image upload failed:', error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                alert('Failed to upload images: ' + errorMessage);
            } finally {
                setSaving(false);
            }
        };

        window.addEventListener('cms:flush-save', handleGlobalSave);
        return () => window.removeEventListener('cms:flush-save', handleGlobalSave);
    }, [pendingImageUploads, imagePreviewUrls]);

    // Removed auto-slide interval since we're using a single video now

    useEffect(() => {
        return () => {
            imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviewUrls]);

    const smoothScrollTo = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <ErrorBoundary>
            <PublicLayout>
                <SeoHead
                    title="Home - Cahaya Anbiya Travel"
                    description="Cahaya Anbiya Travel menghadirkan paket umrah, wisata halal, dan perjalanan premium dengan layanan profesional."
                />

                <div ref={containerRef}>
                    {/* Hero Section - Clean Video Background - Mobile Optimized */}
                    <section className="relative h-[92vh] w-full overflow-hidden bg-black sm:h-[88vh] md:h-[85vh] lg:h-[85vh]">
                        {/* Video Background */}
                        <motion.div
                            className="absolute inset-0 overflow-hidden"
                            style={{
                                y: videoY,
                                width: '100%',
                                height: '100%',
                                minHeight: '100%',
                                willChange: 'transform', // GPU acceleration hint
                            }}
                        >
                            <EditableVideo
                                sectionKey="home.hero.video"
                                src={props.sections?.['home.hero.video']?.video}
                                fallbackSrc="videos/b2cherosectionvideo.mp4"
                                className="absolute inset-0 h-full w-full"
                                videoClassName="h-full w-full object-cover"
                                inlineTrigger
                            />
                        </motion.div>

                        {/* Enhanced gradient overlay - Lighter for better visibility */}
                        <div className="absolute inset-0 z-[5] bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

                        {/* Ambient glow effects */}
                        <div className="pointer-events-none absolute inset-0 z-[6]">
                            {/* Reduced blur for better performance - using blur-2xl instead of blur-3xl */}
                            <motion.div
                                className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.08),transparent_70%)] blur-2xl"
                                animate={{
                                    opacity: [0.3, 0.5, 0.3],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                style={{ willChange: 'opacity, transform' }} // GPU acceleration
                            />
                        </div>

                        {/* Hero Content - Clean Single Line + Video Upload Trigger */}
                        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-20 sm:pb-24">
                            <motion.div
                                className="flex max-w-5xl flex-col items-center gap-4 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h1 className="text-4xl leading-tight font-light text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
                                    <EditableText
                                        sectionKey="home.hero.tagline"
                                        value="Where ancient wonders meet extraordinary journeys"
                                        tag="span"
                                    />
                                </h1>
                                <HeroVideoUploadTrigger />
                            </motion.div>
                        </div>

                        {/* Scroll Down Button - Elegant & Subtle */}
                        <motion.div
                            className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 sm:bottom-8"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <motion.button
                                onClick={() => smoothScrollTo('best-sellers')}
                                className="group flex flex-col items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-3 transition-all duration-300 hover:border-white/30 hover:bg-white/15"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Scroll down"
                            >
                                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                                    <ChevronDown className="h-5 w-5 text-white/70 transition-colors group-hover:text-white/90" strokeWidth={1.5} />
                                </motion.div>
                                <span className="text-[10px] font-light tracking-wider text-white/50 transition-colors group-hover:text-white/70">
                                    SCROLL
                                </span>
                            </motion.button>
                        </motion.div>
                    </section>

                    {/* Best Sellers Section - Unified 2-Column Design */}
                    <section id="best-sellers" className="relative bg-gradient-to-b from-black via-slate-950 to-black py-24">
                        {/* Ambient background effects - Reduced blur for performance */}
                        <div className="pointer-events-none absolute inset-0">
                            <div
                                className="absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.04),transparent_70%)] blur-2xl"
                                style={{ willChange: 'auto' }}
                            />
                            <div
                                className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,84,255,0.03),transparent_70%)] blur-2xl"
                                style={{ willChange: 'auto' }}
                            />
                        </div>

                        <div className="relative mx-auto max-w-7xl px-4">
                            <motion.div
                                className="mb-20 text-center"
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: '-100px' }}
                                variants={fadeInUp}
                                transition={{ duration: 0.7, ease }}
                            >
                                <motion.div
                                    className="mb-4 inline-block"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5">
                                        <span className="bg-gradient-to-r from-amber-200 to-orange-300 bg-clip-text text-sm font-semibold text-transparent">
                                            MOST LOVED
                                        </span>
                                    </div>
                                </motion.div>
                                <h2 className="mb-4 bg-gradient-to-r from-amber-100 via-white to-amber-100 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                                    Best Sellers
                                </h2>
                                <p className="mx-auto max-w-2xl text-lg text-white/50">Discover our most loved travel experiences</p>
                            </motion.div>

                            {/* Unified 2-Column Grid */}
                            <motion.div
                                className="grid grid-cols-1 gap-6 md:grid-cols-2"
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: '-50px' }}
                            >
                                {bestSellers.map((item) => {
                                    const sectionKey = `home.bestsellers.${item.id}.image`;
                                    const imageSrc = getImageSrc(sectionKey, item.image);
                                    const sectionImageUrl = props.sections?.[sectionKey]?.image ?? '';
                                    return (
                                        <motion.div key={item.id} variants={fadeInUp} transition={{ duration: 0.7, ease }} className="group">
                                            <motion.div
                                                className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/80 to-slate-900/60"
                                                whileHover={{ y: -6 }}
                                                transition={{ duration: 0.4, ease }}
                                            >
                                                <div className="relative aspect-[16/10] overflow-hidden">
                                                    <motion.img
                                                        key={`bestseller-img-${item.id}-${sectionImageUrl || imageSrc}`}
                                                        src={imageSrc}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                        decoding="async"
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ duration: 0.8, ease }}
                                                        style={{ willChange: 'transform' }}
                                                        onError={(e) => {
                                                            // Try alternative R2 path if current R2 URL fails
                                                            const target = e.currentTarget;
                                                            if (target.src.includes('assets.cahayaanbiya.com')) {
                                                                const currentUrl = target.src;
                                                                let altPath = currentUrl;

                                                                // Try multiple path variations
                                                                if (currentUrl.includes('/public/images/')) {
                                                                    // Try without /public/
                                                                    altPath = currentUrl.replace('/public/images/', '/images/');
                                                                } else if (currentUrl.includes('/public/')) {
                                                                    // Try without /public/
                                                                    altPath = currentUrl.replace('/public/', '/');
                                                                } else if (currentUrl.includes('/images/')) {
                                                                    // Try with /public/ prefix
                                                                    altPath = currentUrl.replace('/images/', '/public/images/');
                                                                } else {
                                                                    // Try with /public/images/ prefix
                                                                    const fileName = currentUrl.split('/').pop() || item.image;
                                                                    altPath = `https://assets.cahayaanbiya.com/public/images/${fileName}`;
                                                                }

                                                                console.log('[Image] Trying alternative R2 path:', altPath);
                                                                target.src = altPath;
                                                            }
                                                        }}
                                                    />

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                                    {/* Badge */}
                                                    <div className="absolute top-4 right-4">
                                                        <motion.div
                                                            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 shadow-xl"
                                                            whileHover={{ scale: 1.05 }}
                                                        >
                                                            <Sparkles className="h-3.5 w-3.5 text-white" />
                                                            <span className="text-xs font-bold text-white">{item.tag}</span>
                                                        </motion.div>
                                                    </div>

                                                    {/* Edit Control - Pencil only */}
                                                    {editMode && (
                                                        <div className="absolute top-4 left-4 z-10">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditorOpen({
                                                                        section: 'bestsellers',
                                                                        id: item.id,
                                                                        title: getContent(`home.bestsellers.${item.id}.title`, item.title),
                                                                        subtitle: getContent(`home.bestsellers.${item.id}.subtitle`, item.subtitle),
                                                                    });
                                                                }}
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:scale-110"
                                                                title="Edit content & image"
                                                            >
                                                                <Edit3 className="h-5 w-5" strokeWidth={2.5} />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Content Overlay - Static display (edit via pencil) */}
                                                    <div className="absolute right-0 bottom-0 left-0 p-6">
                                                        <h3 className="mb-2 text-2xl font-bold text-white">
                                                            {getContent(`home.bestsellers.${item.id}.title`, item.title)}
                                                        </h3>
                                                        <p className="text-white/70">
                                                            {getContent(`home.bestsellers.${item.id}.subtitle`, item.subtitle)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 group-hover:w-full" />
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </div>
                    </section>

                    {/* New Destinations - Creative Magazine Layout */}
                    <section className="relative bg-gradient-to-b from-black via-slate-950 to-black py-24">
                        <div className="pointer-events-none absolute inset-0">
                            <div
                                className="absolute top-1/3 right-0 h-[500px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.04),transparent_70%)] blur-2xl"
                                style={{ willChange: 'auto' }}
                            />
                        </div>

                        <div className="relative mx-auto max-w-7xl px-4">
                            <motion.div
                                className="mb-20 text-center"
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                transition={{ duration: 0.7, ease }}
                            >
                                <motion.div
                                    className="mb-4 inline-block"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5">
                                        <span className="bg-gradient-to-r from-orange-200 to-amber-300 bg-clip-text text-sm font-semibold text-transparent">
                                            JUST LAUNCHED
                                        </span>
                                    </div>
                                </motion.div>
                                <h2 className="mb-4 bg-gradient-to-r from-orange-100 via-white to-orange-100 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                                    New Destinations
                                </h2>
                                <p className="mx-auto max-w-2xl text-lg text-white/50">Fresh adventures and undiscovered gems</p>
                            </motion.div>

                            {/* Balanced 2x2 Grid Layout - Clean & Organized */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
                                {/* Card 1 - Top Left */}
                                <motion.div
                                    variants={fadeInUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.7, ease }}
                                    className="group"
                                >
                                    <motion.div
                                        className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-900/80 shadow-xl transition-all duration-300"
                                        whileHover={{ y: -6 }}
                                        transition={{ duration: 0.3, ease }}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <motion.img
                                                src={getImageSrc(`home.new.${newDestinations[0].id}.image`, newDestinations[0].image)}
                                                alt={newDestinations[0].title}
                                                className="h-full w-full object-cover"
                                                whileHover={{ scale: 1.08 }}
                                                transition={{ duration: 0.6, ease }}
                                            />

                                            {/* Simple Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                            {/* Clean Badge */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 shadow-lg">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                                    <span className="text-xs font-semibold text-white">{newDestinations[0].tag}</span>
                                                </div>
                                            </div>

                                            {editMode && (
                                                <div className="absolute top-6 left-6 z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditorOpen({
                                                                section: 'new',
                                                                id: newDestinations[0].id,
                                                                title: getContent(
                                                                    `home.new.${newDestinations[0].id}.title`,
                                                                    newDestinations[0].title,
                                                                ),
                                                                subtitle: getContent(
                                                                    `home.new.${newDestinations[0].id}.subtitle`,
                                                                    newDestinations[0].subtitle,
                                                                ),
                                                            });
                                                        }}
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl ring-2 ring-blue-400/50 transition-all hover:scale-110"
                                                        title="Edit content & image"
                                                    >
                                                        <Edit3 className="h-5 w-5" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Content Overlay - Static (edit via pencil) */}
                                            <div className="absolute right-0 bottom-0 left-0 p-6">
                                                <h3 className="mb-2 text-xl font-bold text-white drop-shadow-md md:text-2xl lg:text-3xl">
                                                    {getContent(`home.new.${newDestinations[0].id}.title`, newDestinations[0].title)}
                                                </h3>
                                                <p className="mb-3 text-sm text-white/80 md:text-base">
                                                    {getContent(`home.new.${newDestinations[0].id}.subtitle`, newDestinations[0].subtitle)}
                                                </p>
                                                <div className="inline-flex items-center gap-2 text-orange-400">
                                                    <span className="text-sm font-medium">Explore</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                {/* Card 2 - Top Right */}
                                <motion.div
                                    variants={fadeInUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.7, ease, delay: 0.1 }}
                                    className="group"
                                >
                                    <motion.div
                                        className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-900/80 shadow-xl transition-all duration-300"
                                        whileHover={{ y: -6 }}
                                        transition={{ duration: 0.3, ease }}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <motion.img
                                                src={getImageSrc(`home.new.${newDestinations[1].id}.image`, newDestinations[1].image)}
                                                alt={newDestinations[1].title}
                                                className="h-full w-full object-cover"
                                                whileHover={{ scale: 1.08 }}
                                                transition={{ duration: 0.6, ease }}
                                            />

                                            {/* Simple Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                            {/* Clean Badge */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 shadow-lg">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                                    <span className="text-xs font-semibold text-white">{newDestinations[1].tag}</span>
                                                </div>
                                            </div>

                                            {editMode && (
                                                <div className="absolute top-4 left-4 z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditorOpen({
                                                                section: 'new',
                                                                id: newDestinations[1].id,
                                                                title: getContent(
                                                                    `home.new.${newDestinations[1].id}.title`,
                                                                    newDestinations[1].title,
                                                                ),
                                                                subtitle: getContent(
                                                                    `home.new.${newDestinations[1].id}.subtitle`,
                                                                    newDestinations[1].subtitle,
                                                                ),
                                                            });
                                                        }}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:scale-110"
                                                        title="Edit content & image"
                                                    >
                                                        <Edit3 className="h-5 w-5" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Clean Content - Static (edit via pencil) */}
                                            <div className="absolute right-0 bottom-0 left-0 p-6">
                                                <h3 className="mb-2 text-xl font-bold text-white drop-shadow-md md:text-2xl lg:text-3xl">
                                                    {getContent(`home.new.${newDestinations[1].id}.title`, newDestinations[1].title)}
                                                </h3>
                                                <p className="mb-3 text-sm text-white/80 md:text-base">
                                                    {getContent(`home.new.${newDestinations[1].id}.subtitle`, newDestinations[1].subtitle)}
                                                </p>
                                                <div className="inline-flex items-center gap-2 text-orange-400">
                                                    <span className="text-sm font-medium">Explore</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                {/* Card 3 - Bottom Left */}
                                <motion.div
                                    variants={fadeInUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.7, ease, delay: 0.2 }}
                                    className="group"
                                >
                                    <motion.div
                                        className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-900/80 shadow-xl transition-all duration-300"
                                        whileHover={{ y: -6 }}
                                        transition={{ duration: 0.3, ease }}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <motion.img
                                                src={getImageSrc(`home.new.${newDestinations[2].id}.image`, newDestinations[2].image)}
                                                alt={newDestinations[2].title}
                                                className="h-full w-full object-cover"
                                                whileHover={{ scale: 1.08 }}
                                                transition={{ duration: 0.6, ease }}
                                            />

                                            {/* Simple Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                            {/* Clean Badge */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 shadow-lg">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                                    <span className="text-xs font-semibold text-white">{newDestinations[2].tag}</span>
                                                </div>
                                            </div>

                                            {editMode && (
                                                <div className="absolute top-4 left-4 z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditorOpen({
                                                                section: 'new',
                                                                id: newDestinations[2].id,
                                                                title: getContent(
                                                                    `home.new.${newDestinations[2].id}.title`,
                                                                    newDestinations[2].title,
                                                                ),
                                                                subtitle: getContent(
                                                                    `home.new.${newDestinations[2].id}.subtitle`,
                                                                    newDestinations[2].subtitle,
                                                                ),
                                                            });
                                                        }}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:scale-110"
                                                        title="Edit content & image"
                                                    >
                                                        <Edit3 className="h-5 w-5" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Clean Content - Static (edit via pencil) */}
                                            <div className="absolute right-0 bottom-0 left-0 p-6">
                                                <h3 className="mb-2 text-xl font-bold text-white drop-shadow-md md:text-2xl lg:text-3xl">
                                                    {getContent(`home.new.${newDestinations[2].id}.title`, newDestinations[2].title)}
                                                </h3>
                                                <p className="mb-3 text-sm text-white/80 md:text-base">
                                                    {getContent(`home.new.${newDestinations[2].id}.subtitle`, newDestinations[2].subtitle)}
                                                </p>
                                                <div className="inline-flex items-center gap-2 text-orange-400">
                                                    <span className="text-sm font-medium">Explore</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                {/* Card 4 - Bottom Right */}
                                <motion.div
                                    variants={fadeInUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.7, ease, delay: 0.3 }}
                                    className="group"
                                >
                                    <motion.div
                                        className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-900/80 shadow-xl transition-all duration-300"
                                        whileHover={{ y: -6 }}
                                        transition={{ duration: 0.3, ease }}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <motion.img
                                                src={getImageSrc(`home.new.${newDestinations[3].id}.image`, newDestinations[3].image)}
                                                alt={newDestinations[3].title}
                                                className="h-full w-full object-cover"
                                                whileHover={{ scale: 1.08 }}
                                                transition={{ duration: 0.6, ease }}
                                            />

                                            {/* Simple Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                            {/* Clean Badge */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 shadow-lg">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                                    <span className="text-xs font-semibold text-white">{newDestinations[3].tag}</span>
                                                </div>
                                            </div>

                                            {editMode && (
                                                <div className="absolute top-4 left-4 z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditorOpen({
                                                                section: 'new',
                                                                id: newDestinations[3].id,
                                                                title: getContent(
                                                                    `home.new.${newDestinations[3].id}.title`,
                                                                    newDestinations[3].title,
                                                                ),
                                                                subtitle: getContent(
                                                                    `home.new.${newDestinations[3].id}.subtitle`,
                                                                    newDestinations[3].subtitle,
                                                                ),
                                                            });
                                                        }}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:scale-110"
                                                        title="Edit content & image"
                                                    >
                                                        <Edit3 className="h-5 w-5" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Clean Content - Static (edit via pencil) */}
                                            <div className="absolute right-0 bottom-0 left-0 p-6">
                                                <h3 className="mb-2 text-xl font-bold text-white drop-shadow-md md:text-2xl lg:text-3xl">
                                                    {getContent(`home.new.${newDestinations[3].id}.title`, newDestinations[3].title)}
                                                </h3>
                                                <p className="mb-3 text-sm text-white/80 md:text-base">
                                                    {getContent(`home.new.${newDestinations[3].id}.subtitle`, newDestinations[3].subtitle)}
                                                </p>
                                                <div className="inline-flex items-center gap-2 text-orange-400">
                                                    <span className="text-sm font-medium">Explore</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Highlights Section */}
                    <section className="relative bg-gradient-to-b from-black via-slate-900 to-black py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <motion.div
                                className="mb-12 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="mb-5"
                                >
                                    <div className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/15 px-4 py-1.5">
                                        <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-300 bg-clip-text text-xs font-semibold tracking-wider text-transparent uppercase sm:text-sm">
                                            Featured Experiences
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="mb-3 text-4xl leading-tight font-bold text-white sm:text-5xl md:text-6xl"
                                >
                                    Highlights
                                </motion.h2>

                                {/* Subtitle */}
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="mx-auto max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg"
                                >
                                    Moments that make every journey unforgettable
                                </motion.p>
                            </motion.div>

                            <motion.div
                                className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: '-50px' }}
                            >
                                {highlights.map((item) => (
                                    <motion.div key={item.id} variants={fadeInUp} transition={{ duration: 0.7, ease }} className="group">
                                        <motion.div
                                            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/85 to-slate-900/70 shadow-xl transition-all duration-500"
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            transition={{ duration: 0.4, ease }}
                                        >
                                            <div className="relative aspect-[16/10] overflow-hidden">
                                                <motion.img
                                                    src={getImageSrc(`home.highlights.${item.id}.image`, item.image)}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                    whileHover={{ scale: 1.15 }}
                                                    transition={{ duration: 0.9, ease }}
                                                />

                                                {/* Enhanced Gradient Overlays */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />

                                                {/* Enhanced Badge */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    <motion.span
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 px-4 py-1.5 text-xs font-bold tracking-wide text-white shadow-xl ring-1 ring-blue-400/30"
                                                        whileHover={{ scale: 1.1, rotate: 2 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {item.tag}
                                                    </motion.span>
                                                </div>

                                                {editMode && (
                                                    <div className="absolute top-4 left-4 z-10">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditorOpen({
                                                                    section: 'hl',
                                                                    id: item.id,
                                                                    title: getContent(`home.hl.${item.id}.title`, item.title),
                                                                    subtitle: getContent(`home.hl.${item.id}.subtitle`, item.subtitle),
                                                                });
                                                            }}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl ring-2 ring-blue-400/50 transition-all hover:scale-110"
                                                            title="Edit content & image"
                                                        >
                                                            <Edit3 className="h-5 w-5" strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Content Overlay - Static (edit via pencil) */}
                                                <div className="absolute right-0 bottom-0 left-0 p-6 md:p-8">
                                                    <h3 className="mb-2 text-2xl leading-tight font-bold text-white drop-shadow-lg md:text-3xl">
                                                        {getContent(`home.hl.${item.id}.title`, item.title)}
                                                    </h3>
                                                    <p className="text-base leading-relaxed text-white/80 md:text-lg">
                                                        {getContent(`home.hl.${item.id}.subtitle`, item.subtitle)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Animated Bottom Border */}
                                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transition-all duration-500 group-hover:w-full" />
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>

                    {/* Editor Modal */}
                    {editMode && editorOpen && (
                        <motion.div
                            className="fixed bottom-6 left-1/2 z-[9998] w-[min(640px,92vw)] -translate-x-1/2 rounded-xl border border-white/10 bg-black/95 p-6 shadow-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="text-sm font-semibold text-white">
                                    Edit Content — {editorOpen?.section} #{editorOpen?.id}
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-300">Title</label>
                                    <input
                                        value={editorOpen?.title || ''}
                                        onChange={(e) => {
                                            if (editorOpen) {
                                                setEditorOpen({ ...editorOpen, title: e.target.value });
                                            }
                                        }}
                                        className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white ring-amber-400/0 transition-all outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-300">Subtitle</label>
                                    <textarea
                                        value={editorOpen?.subtitle || ''}
                                        onChange={(e) => {
                                            if (editorOpen) {
                                                setEditorOpen({ ...editorOpen, subtitle: e.target.value });
                                            }
                                        }}
                                        rows={3}
                                        className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white ring-amber-400/0 transition-all outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-300">Replace Image</label>
                                    <p className="mb-2 rounded-lg border border-amber-500/30 bg-amber-900/20 px-3 py-2 text-xs text-amber-100">
                                        {imageGuide}
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
                                        className="w-full text-sm text-gray-300 transition-all file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-amber-400"
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
                                                const compressed = await compressImageForUpload(pendingFile);
                                                const form = new FormData();
                                                form.append('key', `home.${editorOpen.section}.${editorOpen.id}.image`);
                                                form.append('image', compressed);
                                                const uploadRes = await axios.post('/admin/upload-image', form, {
                                                    headers: { Accept: 'application/json' },
                                                });
                                                if (!uploadRes?.data?.success && !uploadRes?.data?.status) {
                                                    throw new Error(uploadRes?.data?.message || 'Upload gagal');
                                                }
                                            }
                                            setEditorOpen(null);
                                            setPendingFile(null);

                                            router.reload({
                                                only: ['sections'],
                                                onSuccess: () => {
                                                    const notification = document.createElement('div');
                                                    notification.className =
                                                        'fixed top-20 right-4 z-[99999] rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-2xl';
                                                    notification.innerHTML = `
                                                        <div class="flex items-center gap-3">
                                                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                            </svg>
                                                            <div>
                                                                <div class="font-bold">Changes Saved!</div>
                                                                <div class="text-sm opacity-90">All updates saved with backup</div>
                                                            </div>
                                                        </div>
                                                    `;
                                                    document.body.appendChild(notification);
                                                    setTimeout(() => notification.remove(), 3000);
                                                },
                                            });
                                        } catch (err: unknown) {
                                            const ax =
                                                err && typeof err === 'object' && 'response' in err
                                                    ? (err as {
                                                          response?: { data?: { message?: string; errors?: Record<string, string[]> } };
                                                          message?: string;
                                                      })
                                                    : null;
                                            const data = ax?.response?.data;
                                            let msg = data?.message || ax?.message || (err instanceof Error ? err.message : 'Gagal menyimpan');
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
                                    className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-60"
                                >
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    )}

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

                    {/* Hidden Image Input */}
                    {editMode && (
                        <input
                            id={hiddenImageInputId}
                            type="file"
                            accept="image/jpeg,image/png"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file || !imageTargetKey) return;

                                markDirty();

                                const previewUrl = URL.createObjectURL(file);

                                setPendingImageUploads((prev) => {
                                    const newMap = new Map(prev);
                                    newMap.set(imageTargetKey, file);
                                    return newMap;
                                });

                                setImagePreviewUrls((prev) => {
                                    const newMap = new Map(prev);
                                    const oldUrl = prev.get(imageTargetKey);
                                    if (oldUrl) URL.revokeObjectURL(oldUrl);
                                    newMap.set(imageTargetKey, previewUrl);
                                    return newMap;
                                });

                                const match = imageTargetKey.match(/home\.hero\.(\d+)\.image/);
                                if (match) {
                                    const slideId = parseInt(match[1]);
                                    setHeroSlides((prevSlides) =>
                                        prevSlides.map((slide) => (slide.id === slideId ? { ...slide, image: previewUrl } : slide)),
                                    );
                                }

                                setImageTargetKey(null);
                                (e.target as HTMLInputElement).value = '';
                            }}
                        />
                    )}

                    {/* Footer */}
                    <footer className="relative border-t border-white/5 bg-black py-16">
                        <div className="mx-auto max-w-7xl px-4">
                            <div className="grid gap-12 md:grid-cols-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
                                    <div className="space-y-2 text-white/60">
                                        <p>Email: hello@cahaya-anbiya.com</p>
                                        <p>WhatsApp: +62 812-3456-7890</p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    <h3 className="mb-4 text-lg font-semibold text-white">Follow Us</h3>
                                    <div className="flex gap-6">
                                        {['Instagram', 'TikTok', 'YouTube'].map((social) => (
                                            <motion.a
                                                key={social}
                                                href="#"
                                                className="text-white/60 transition-colors hover:text-amber-400"
                                                whileHover={{ y: -2 }}
                                            >
                                                {social}
                                            </motion.a>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                            <div className="mt-12 border-t border-white/5 pt-8 text-center text-sm text-white/40">
                                © 2025 PT Cahaya Anbiya Wisata. All rights reserved.
                            </div>
                        </div>
                    </footer>
                </div>
            </PublicLayout>
        </ErrorBoundary>
    );
}
