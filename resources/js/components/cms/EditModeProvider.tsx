import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type EditModeContextType = {
    isAdmin: boolean;
    editMode: boolean;
    setEditMode: (v: boolean) => void;
    markDirty: () => void;
    dirty: boolean;
    clearDirty: () => void;
};

const EditModeContext = createContext<EditModeContextType | null>(null);

export function useEditMode() {
    const ctx = useContext(EditModeContext);
    if (!ctx) throw new Error('useEditMode must be used within EditModeProvider');
    return ctx;
}

interface PageProps {
    auth?: {
        user?: {
            is_admin?: boolean;
        };
    };
}

export default function EditModeProvider({ children }: { children: React.ReactNode }) {
    const page = usePage();
    const user = (page.props as PageProps)?.auth?.user;
    const isAdmin = Boolean(user?.is_admin);

    const [editMode, setEditMode] = useState(false);
    const [dirty, setDirty] = useState(false);

    const markDirty = useCallback(() => setDirty(true), []);
    const clearDirty = useCallback(() => setDirty(false), []);

    useEffect(() => {
        if (!isAdmin) setEditMode(false);
    }, [isAdmin]);

    const value = useMemo(
        () => ({ isAdmin, editMode, setEditMode, dirty, markDirty, clearDirty }),
        [isAdmin, editMode, dirty, markDirty, clearDirty],
    );

    // Expose edit mode globally for non-provider components (e.g., pages rendered outside provider scope at render time)
    useEffect(() => {
        const root = document.documentElement;
        if (editMode) {
            root.classList.add('cms-edit');
        } else {
            root.classList.remove('cms-edit');
        }
        window.dispatchEvent(new CustomEvent('cms:mode', { detail: { editMode } }));
    }, [editMode]);
    
    // Listen for global dirty state events (for components that can't use the hook)
    useEffect(() => {
        const handleMarkDirty = () => {
            console.log('📢 Global event: cms:mark-dirty received');
            markDirty();
        };
        
        const handleClearDirty = () => {
            console.log('📢 Global event: cms:clear-dirty received');
            clearDirty();
        };
        
        window.addEventListener('cms:mark-dirty', handleMarkDirty);
        window.addEventListener('cms:clear-dirty', handleClearDirty);
        
        return () => {
            window.removeEventListener('cms:mark-dirty', handleMarkDirty);
            window.removeEventListener('cms:clear-dirty', handleClearDirty);
        };
    }, [markDirty, clearDirty]);

    return (
        <EditModeContext.Provider value={value}>
            {children}
            <AnimatePresence>
                {isAdmin && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none fixed inset-x-0 top-0 z-[9998]"
                    >
                        {editMode && (
                            <div className="mx-auto mt-2 w-fit rounded-full bg-blue-500/10 px-4 py-1 text-xs text-blue-300 ring-1 ring-blue-500/40">
                                Edit Mode Active
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Publish Changes floating button */}
            <AnimatePresence>
                {isAdmin && editMode && dirty && (
                    <motion.button
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        onClick={() => {
                            // currently client-side only; server-side publishes are triggered by individual autosaves
                            clearDirty();
                        }}
                        className="fixed right-6 bottom-6 z-[9999] rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-black shadow-lg ring-1 ring-amber-300/60 hover:bg-amber-400"
                    >
                        Publish Changes
                    </motion.button>
                )}
            </AnimatePresence>
        </EditModeContext.Provider>
    );
}
