import { AnimatePresence, motion } from 'framer-motion';
import { Edit3, X } from 'lucide-react';
import { useEditMode } from './EditModeProvider';

export default function EditToggleButton() {
    const { isAdmin, editMode, setEditMode, dirty } = useEditMode();
    if (!isAdmin) return null;

    return (
        <AnimatePresence>
            <motion.button
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                onClick={() => setEditMode(!editMode)}
                className={`fixed bottom-4 left-4 z-[9999] flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-lg ring-1 transition-all sm:bottom-6 sm:left-6 sm:px-4 sm:text-sm ${
                    editMode 
                        ? dirty
                            ? 'bg-amber-500 text-white ring-amber-300 animate-pulse' // Has changes
                            : 'bg-blue-500 text-white ring-blue-300' // Editing, no changes
                        : 'bg-gray-900 text-white ring-white/10 hover:bg-gray-800'
                }`}
                title={editMode ? (dirty ? 'Has unsaved changes!' : 'Exit edit mode') : 'Enter edit mode'}
            >
                {editMode ? <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                <span className="hidden sm:inline">
                    {editMode ? (dirty ? 'Has Changes' : 'Edit Mode: ON') : 'Edit Mode: OFF'}
                </span>
                <span className="inline sm:hidden">
                    {editMode ? (dirty ? 'Save!' : 'ON') : 'OFF'}
                </span>
            </motion.button>
        </AnimatePresence>
    );
}
