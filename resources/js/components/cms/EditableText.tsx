import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditMode } from './EditModeProvider';

// Helper to save and restore cursor position
function saveCursorPosition(element: HTMLElement): { start: number; end: number } | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    
    const start = preCaretRange.toString().length;
    const end = start + range.toString().length;
    
    return { start, end };
}

function restoreCursorPosition(element: HTMLElement, position: { start: number; end: number } | null) {
    if (!position) return;
    
    const selection = window.getSelection();
    if (!selection) return;
    
    try {
        const textNode = element.childNodes[0] || element;
        const range = document.createRange();
        
        const start = Math.min(position.start, (textNode.textContent || '').length);
        const end = Math.min(position.end, (textNode.textContent || '').length);
        
        if (textNode.nodeType === Node.TEXT_NODE) {
            range.setStart(textNode, start);
            range.setEnd(textNode, end);
        } else {
            range.selectNodeContents(element);
            range.collapse(false);
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
    } catch (error) {
        // Silently fail if cursor restoration fails
        console.debug('Could not restore cursor position:', error);
    }
}

export default function EditableText({
    sectionKey,
    value,
    tag: Tag = 'div',
    className,
}: {
    sectionKey: string;
    value: string | undefined;
    tag?: keyof JSX.IntrinsicElements;
    className?: string;
}) {
    const { isAdmin, editMode, markDirty, clearDirty } = useEditMode();
    const { props } = usePage<{ sections?: Record<string, { content?: string; image?: string }> }>();
    
    // Prioritize data from database, fallback to default value
    const dbContent = props.sections?.[sectionKey]?.content;
    const initialValue = dbContent ?? value ?? '';
    
    const [text, setText] = useState(initialValue);
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const cursorPositionRef = useRef<{ start: number; end: number } | null>(null);

    // Sync with database when props change
    useEffect(() => {
        const newValue = dbContent ?? value ?? '';
        if (newValue !== text && !hasChanges) {
            // Only update if not currently editing
            setText(newValue);
        }
    }, [dbContent, value]);

    // Restore cursor position after state update
    useEffect(() => {
        if (ref.current && cursorPositionRef.current && document.activeElement === ref.current) {
            restoreCursorPosition(ref.current, cursorPositionRef.current);
        }
    }, [text]);

    const performSave = useCallback(
        async (contentToSave: string) => {
            if (!hasChanges) return; // Don't save if no changes
            
            setIsSaving(true);
            try {
                await axios.post('/admin/update-section', { key: sectionKey, content: contentToSave });
                setSaved(true);
                setHasChanges(false);
                setTimeout(() => setSaved(false), 2000);
                
                // Reload Inertia to fetch fresh data from server
                router.reload({ only: ['sections'] });
            } catch (error) {
                console.error('Failed to save text:', error);
            } finally {
                setIsSaving(false);
            }
        },
        [sectionKey, hasChanges],
    );

    // Handle save on blur (when user clicks away) - ONLY SAVE METHOD NOW
    const handleBlur = useCallback(() => {
        if (hasChanges && !isSaving) {
            console.log('💾 Saving on blur for:', sectionKey);
            performSave(text);
        }
    }, [hasChanges, isSaving, text, performSave, sectionKey]);

    // Listen for global save event from header Save button
    useEffect(() => {
        const handleGlobalSave = () => {
            if (hasChanges && !isSaving) {
                console.log('💾 Global save triggered for:', sectionKey);
                performSave(text);
            }
        };

        window.addEventListener('cms:flush-save', handleGlobalSave);
        return () => window.removeEventListener('cms:flush-save', handleGlobalSave);
    }, [hasChanges, isSaving, text, performSave, sectionKey]);

    return (
        <div className={editMode && isAdmin ? 'group relative' : undefined}>
            <div className="relative">
                <Tag
                ref={ref as any}
                contentEditable={isAdmin && editMode}
                suppressContentEditableWarning
                onInput={(e: any) => {
                    // Save cursor position BEFORE updating state
                    if (ref.current) {
                        cursorPositionRef.current = saveCursorPosition(ref.current);
                    }
                    
                    const next = e.currentTarget.innerText;
                    
                    // Update text state (cursor will be restored by useEffect)
                    setText(next);
                    
                    // Mark as having changes
                    if (next !== initialValue) {
                        setHasChanges(true);
                        markDirty();
                    } else {
                        setHasChanges(false);
                    }
                }}
                onBlur={handleBlur}
                onKeyDown={(e: any) => {
                    // Save on Ctrl/Cmd + S
                    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                        e.preventDefault();
                        if (hasChanges) {
                            performSave(text);
                        }
                    }
                }}
                className={`${className ?? ''} ${
                    isAdmin && editMode 
                        ? `rounded-sm ring-2 outline-none transition-all ${
                            hasChanges 
                                ? 'ring-amber-500/80 hover:ring-amber-500 shadow-lg shadow-amber-500/20' 
                                : 'ring-blue-400/40 hover:ring-blue-400/60'
                          }` 
                        : ''
                }`}
            >
                {text}
                </Tag>
                
                {/* Status Indicators */}
                {isAdmin && editMode && (
                    <div className="pointer-events-none absolute -top-8 left-0 flex flex-col gap-1">
                        {/* Unsaved Changes Indicator */}
                        <AnimatePresence>
                            {hasChanges && !isSaving && !saved && (
                                <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    className="w-max rounded-md bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg ring-1 ring-amber-300/50"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <span className="flex h-1.5 w-1.5">
                                            <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-white opacity-75"></span>
                                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white"></span>
                                        </span>
                                        Unsaved — click Save atau klik di luar
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Saving Indicator */}
                        <AnimatePresence>
                            {isSaving && (
                                <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    className="w-max rounded-md bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg ring-1 ring-blue-300/50"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Saved Confirmation */}
                        <AnimatePresence>
                            {saved && (
                                <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    className="w-max rounded-md bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg ring-1 ring-emerald-300/50"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Tersimpan ✓
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
