import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { router, usePage } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';
import { useEditMode } from './EditModeProvider';
import { getR2Url } from '@/utils/imageHelper';

export default function EditableImage({
    sectionKey,
    src,
    alt,
    className,
    imgClassName,
}: {
    sectionKey: string;
    src: string | undefined;
    alt: string;
    className?: string;
    imgClassName?: string;
}) {
    const { isAdmin, editMode, markDirty } = useEditMode();
    const { props } = usePage<{
        sections?: Record<string, { content?: string; image?: string }>;
        cmsMediaGuide?: { images?: { short?: string } };
    }>();
    const guide = props.cmsMediaGuide?.images ?? {};
    
    // Prioritize data from database, fallback to default src
    const dbImage = props.sections?.[sectionKey]?.image;
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [saved, setSaved] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Convert all sources to R2 URLs
    const getR2Src = (path: string | undefined): string => {
        if (!path) return '';
        // If already a full URL (from DB), return as is
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        // Convert local path to R2 URL
        return getR2Url(path);
    };

    const currentSrc = preview ?? (dbImage ? getR2Src(dbImage) : (src ? getR2Src(src) : ''));

    const onDrop = useCallback(
        async (file: File) => {
            const tempPreview = URL.createObjectURL(file);
            setPreview(tempPreview);
            markDirty();

            const form = new FormData();
            form.append('key', sectionKey);
            form.append('image', file);
            
            try {
                await axios.post('/admin/upload-image', form, {
                    headers: { Accept: 'application/json' },
                });
                
                setSaved(true);
                setTimeout(() => setSaved(false), 900);
                
                // Clean up temporary object URL
                URL.revokeObjectURL(tempPreview);
                
                // Clear preview state BEFORE reload to force fetch from DB
                setPreview(undefined);
                
                // Reload Inertia to fetch fresh data from server
                // This ensures frontend displays updated image immediately
                router.reload({ 
                    only: ['sections'],
                    onSuccess: () => {
                        console.log('✅ Image reloaded from database:', sectionKey);
                    }
                });
            } catch (error: unknown) {
                console.error('Failed to upload image:', error);
                const ax = error && typeof error === 'object' && 'response' in error ? (error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }) : null;
                const data = ax?.response?.data;
                let msg = data?.message || (error instanceof Error ? error.message : 'Failed to upload image');
                if (data?.errors && typeof data.errors === 'object') {
                    const flat = Object.values(data.errors).flat().filter(Boolean);
                    if (flat.length) msg = flat.join('. ');
                }
                alert(msg);
                URL.revokeObjectURL(tempPreview);
                setPreview(undefined);
            }
        },
        [sectionKey, markDirty],
    );

    const onFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) onDrop(file);
        },
        [onDrop],
    );

    return (
        <div
            className={`group relative ${className ?? ''}`}
            onDragOver={(e) => (editMode && isAdmin ? (e.preventDefault(), (e.dataTransfer.dropEffect = 'copy')) : undefined)}
            onDrop={(e) => {
                if (!(editMode && isAdmin)) return;
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) onDrop(f);
            }}
        >
            <img 
                src={currentSrc} 
                alt={alt} 
                className={imgClassName}
                onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                        // Try alternative R2 path variations
                        const currentUrl = target.src;
                        let altPath = currentUrl;
                        if (currentUrl.includes('/public/images/')) {
                            altPath = currentUrl.replace('/public/images/', '/images/');
                        } else if (currentUrl.includes('/public/')) {
                            altPath = currentUrl.replace('/public/', '/');
                        } else if (currentUrl.includes('/images/')) {
                            altPath = currentUrl.replace('/images/', '/public/images/');
                        } else {
                            const fileName = currentUrl.split('/').pop() || src || '';
                            altPath = `https://assets.cahayaanbiya.com/public/images/${fileName}`;
                        }
                        console.log('[EditableImage] Trying alternative R2 path:', altPath);
                        target.src = altPath;
                    }
                }}
            />

            <AnimatePresence>
                {isAdmin && editMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[9999] flex flex-col items-center justify-center gap-3 rounded-md bg-black/70 backdrop-blur-md"
                        onClick={() => inputRef.current?.click()}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-blue-400/50 bg-black/90 p-6 shadow-2xl backdrop-blur-sm">
                            <span className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-lg">
                                Drag & Drop image or Click to replace
                            </span>
                            {guide.short && (
                                <span className="rounded-lg border-2 border-amber-400 bg-gradient-to-r from-amber-900 to-orange-900 px-5 py-2.5 text-xs font-bold text-amber-50 shadow-lg">
                                    {guide.short}
                                </span>
                            )}
                        </div>
                        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFileChange} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {saved && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute -bottom-6 left-0 z-50 rounded bg-black/80 px-2 py-1 text-xs text-emerald-300"
                    >
                        Image saved ✓
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
