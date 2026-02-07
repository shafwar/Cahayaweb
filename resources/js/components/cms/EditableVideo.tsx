import { getVideoUrl } from '@/utils/imageHelper';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditMode } from './EditModeProvider';

const CMS_UPLOAD_VIDEO_EVENT = 'cms:upload-video';
export function triggerVideoUpload(sectionKey: string) {
    window.dispatchEvent(new CustomEvent(CMS_UPLOAD_VIDEO_EVENT, { detail: { sectionKey } }));
}

type PageProps = {
    sections?: Record<string, { content?: string; image?: string; video?: string }>;
    cmsMediaGuide?: {
        videos?: { short?: string; description?: string; max_file_size_mb?: number };
    };
};

export default function EditableVideo({
    sectionKey,
    src,
    fallbackSrc,
    className,
    videoClassName,
    inlineTrigger,
}: {
    sectionKey: string;
    src?: string;
    fallbackSrc?: string;
    className?: string;
    videoClassName?: string;
    /** When true, only show guide overlay; trigger is rendered elsewhere via dispatchEvent */
    inlineTrigger?: boolean;
}) {
    const { isAdmin, editMode, markDirty } = useEditMode();
    const { props } = usePage<PageProps>();
    const guide = props.cmsMediaGuide?.videos ?? {};

    const dbVideo = props.sections?.[sectionKey]?.video;
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [saved, setSaved] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const getVideoSrc = (path: string | undefined): string => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return getVideoUrl(path);
    };

    const currentSrc = preview ?? (dbVideo ? getVideoSrc(dbVideo) : src ? getVideoSrc(src) : getVideoUrl(fallbackSrc || 'b2cherosectionvideo.mp4'));

    const onDrop = useCallback(
        async (file: File) => {
            const tempPreview = URL.createObjectURL(file);
            setPreview(tempPreview);
            markDirty();

            const form = new FormData();
            form.append('key', sectionKey);
            form.append('video', file);

            try {
                await axios.post('/admin/upload-video', form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                setSaved(true);
                setTimeout(() => setSaved(false), 900);
                URL.revokeObjectURL(tempPreview);
                setPreview(undefined);

                router.reload({
                    only: ['sections'],
                    onSuccess: () => console.log('✅ Video reloaded:', sectionKey),
                });
            } catch (error) {
                console.error('Failed to upload video:', error);
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

    useEffect(() => {
        if (!inlineTrigger || !isAdmin || !editMode) return;
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as { sectionKey?: string };
            if (detail?.sectionKey === sectionKey) {
                inputRef.current?.click();
            }
        };
        window.addEventListener(CMS_UPLOAD_VIDEO_EVENT, handler);
        return () => window.removeEventListener(CMS_UPLOAD_VIDEO_EVENT, handler);
    }, [inlineTrigger, isAdmin, editMode, sectionKey]);

    return (
        <div
            className={`group relative ${className ?? ''}`}
            onDragOver={(e) => (editMode && isAdmin ? (e.preventDefault(), (e.dataTransfer.dropEffect = 'copy')) : undefined)}
            onDrop={(e) => {
                if (!(editMode && isAdmin)) return;
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f && (f.type === 'video/mp4' || f.type === 'video/webm')) onDrop(f);
            }}
        >
            <video
                src={currentSrc}
                className={videoClassName}
                muted
                loop
                playsInline
                autoPlay
                onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src && !target.src.includes(fallbackSrc || 'b2cherosectionvideo')) {
                        target.src = getVideoUrl(fallbackSrc || 'b2cherosectionvideo.mp4');
                        target.load();
                    }
                }}
            />

            <AnimatePresence>
                {isAdmin && editMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute inset-0 z-[9999] flex flex-col items-center ${inlineTrigger ? 'pointer-events-none' : 'bg-black/75 backdrop-blur-md'}`}
                        onClick={inlineTrigger ? undefined : () => inputRef.current?.click()}
                        style={{ pointerEvents: inlineTrigger ? 'none' : 'auto' }}
                    >
                        {guide.short && (
                            <div className="w-full pt-6 pb-2">
                                <span className="mx-4 inline-block rounded-lg border-2 border-amber-400 bg-gradient-to-r from-amber-900 to-orange-900 px-5 py-2.5 text-xs font-bold text-amber-50 shadow-xl">
                                    {guide.short}
                                </span>
                            </div>
                        )}
                        {!inlineTrigger && (
                            <div className="flex flex-1 flex-col items-center justify-center">
                                <span className="rounded-xl border-2 border-blue-400/70 bg-black/95 px-5 py-2.5 text-sm font-bold text-white shadow-xl ring-2 ring-blue-400/30 backdrop-blur-sm">
                                    Drag & Drop video or Click to replace
                                </span>
                            </div>
                        )}
                        <input ref={inputRef} type="file" accept="video/mp4,video/webm" className="hidden" onChange={onFileChange} />
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
                        Video saved ✓
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
