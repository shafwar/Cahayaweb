import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { router, usePage } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';
import { useEditMode } from './EditModeProvider';

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
    const { props } = usePage<{ sections?: Record<string, { content?: string; image?: string }> }>();
    
    // Prioritize data from database, fallback to default src
    const dbImage = props.sections?.[sectionKey]?.image;
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [saved, setSaved] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentSrc = preview ?? dbImage ?? src ?? '';

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
                    headers: { 'Content-Type': 'multipart/form-data' } 
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
            } catch (error) {
                console.error('Failed to upload image:', error);
                // Revert preview on error
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
            <img src={currentSrc} alt={alt} className={imgClassName} />

            <AnimatePresence>
                {isAdmin && editMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 grid place-items-center rounded-md bg-black/30 ring-2 ring-blue-400/50"
                        onClick={() => inputRef.current?.click()}
                    >
                        <span className="rounded bg-white/90 px-3 py-1 text-xs font-medium text-gray-800">Drag & Drop image or Click to replace</span>
                        <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={onFileChange} />
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
