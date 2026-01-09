import axios from 'axios';
import { useEffect } from 'react';
import { useEditMode } from './EditModeProvider';

/**
 * Quick Undo with Keyboard Shortcut
 * Press Ctrl+Z (or Cmd+Z) to undo last change
 */
export default function QuickUndo() {
    const { isAdmin, editMode } = useEditMode();

    useEffect(() => {
        if (!isAdmin || !editMode) return;

        const handleKeyPress = async (e: KeyboardEvent) => {
            // Ctrl+Z or Cmd+Z
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                console.log('⌨️  Keyboard shortcut: Ctrl+Z pressed');
                await performQuickUndo();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isAdmin, editMode]);

    return null; // No UI, just keyboard listener
}

async function performQuickUndo() {
    try {
        // Find the most recently updated section
        console.log('🔍 Finding most recent change...');
        
        const response = await axios.get('/admin/revisions', {
            params: { key: 'home.hero.1.image', limit: 1 }
        });

        const revisions = response.data.revisions || [];
        
        if (revisions.length === 0) {
            alert('❌ Tidak ada perubahan untuk di-undo');
            return;
        }

        const latestRevision = revisions[0];
        console.log('🔄 Undoing to revision:', latestRevision.id);

        // Restore
        await axios.post('/admin/restore-revision', {
            key: 'home.hero.1.image',
            revision_id: latestRevision.id,
        });

        console.log('✅ Undo successful!');

        // Show notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999999] rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-6 text-white shadow-2xl text-center';
        notification.innerHTML = `
            <div class="text-2xl font-bold mb-2">🔄 Undo Successful!</div>
            <div class="text-sm">Reloading to show restored image...</div>
            <div class="mt-3 text-xs opacity-75">Please wait...</div>
        `;
        document.body.appendChild(notification);

        // Force complete refresh with cache clear
        setTimeout(() => {
            // Clear all possible caches
            sessionStorage.clear();
            localStorage.clear();
            
            // Force reload with timestamp
            const baseUrl = window.location.href.split('?')[0];
            window.location.replace(baseUrl + '?refresh=' + Date.now());
        }, 1500);

    } catch (error) {
        console.error('❌ Quick undo failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert('Undo failed: ' + errorMessage);
    }
}

