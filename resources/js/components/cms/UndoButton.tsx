import axios from 'axios';
import { router } from '@inertiajs/react';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useEditMode } from './EditModeProvider';

/**
 * Simple Undo Button - Restore to previous version with ONE CLICK
 * No modal, no complexity - just click and it reverts!
 */
export default function UndoButton({ sectionKey }: { sectionKey: string }) {
    const { isAdmin, editMode } = useEditMode();
    const [isUndoing, setIsUndoing] = useState(false);

    if (!isAdmin || !editMode) {
        return null;
    }

    const handleUndo = async () => {
        setIsUndoing(true);
        console.log('🔄 Starting undo for:', sectionKey);

        try {
            // Get latest revision
            const response = await axios.get('/admin/revisions', {
                params: { key: sectionKey, limit: 1 },
            });

            const revisions = response.data.revisions || [];
            console.log('📦 Found revisions:', revisions.length);

            if (revisions.length === 0) {
                // No revisions found - offer to reset to original/default
                const resetToDefault = window.confirm(
                    '⚠️ Tidak ada versi sebelumnya yang tersimpan.\n\n' +
                    '💡 Apakah Anda ingin RESET ke gambar ORIGINAL (default)?\n\n' +
                    'Ini akan menghapus gambar yang di-upload dan kembali ke gambar bawaan.'
                );

                if (!resetToDefault) {
                    console.log('❌ Reset to default cancelled');
                    setIsUndoing(false);
                    return;
                }

                // Reset to default by deleting the section
                console.log('🔄 Resetting to default...');
                await axios.post('/admin/reset-to-default', {
                    key: sectionKey,
                });

                console.log('✅ Reset successful!');
                
                // Show success notification
                const notification = document.createElement('div');
                notification.className = 'fixed top-20 right-4 z-[99999] rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-2xl';
                notification.innerHTML = `
                    <div class="flex items-center gap-3">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <div>
                            <div class="font-bold">✅ Reset ke Original!</div>
                            <div class="text-sm opacity-90">Memuat gambar original...</div>
                        </div>
                    </div>
                `;
                document.body.appendChild(notification);

                // Force hard reload
                setTimeout(() => {
                    window.location.href = window.location.href.split('?')[0] + '?t=' + Date.now();
                }, 800);
                
                return;
            }

            // Has revisions - normal undo flow
            const confirmed = window.confirm(
                '🔄 Kembalikan ke versi sebelumnya?\n\n' +
                'Gambar/text akan dikembalikan ke versi yang terakhir disimpan sebelumnya.'
            );

            if (!confirmed) {
                console.log('❌ Undo cancelled');
                setIsUndoing(false);
                return;
            }

            const latestRevision = revisions[0];
            console.log('🔄 Restoring to revision:', latestRevision.id);

            // Restore to latest revision
            await axios.post('/admin/restore-revision', {
                key: sectionKey,
                revision_id: latestRevision.id,
            });

            console.log('✅ Restore successful!');
            console.log('💾 Database updated, forcing hard reload...');

            // Show immediate feedback
            const notification = document.createElement('div');
            notification.className = 'fixed top-20 right-4 z-[99999] rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-2xl';
            notification.innerHTML = `
                <div class="flex items-center gap-3">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div>
                        <div class="font-bold">✅ Dikembalikan!</div>
                        <div class="text-sm opacity-90">Memuat gambar dari database...</div>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);

            // Force hard reload to clear cache and show restored image
            setTimeout(() => {
                console.log('🔄 Hard reloading page to clear cache...');
                // Force reload from server, bypass cache
                window.location.href = window.location.href.split('?')[0] + '?t=' + Date.now();
            }, 800);

        } catch (error) {
            console.error('❌ Undo failed:', error);
            alert('❌ Gagal undo: ' + ((error as any).response?.data?.message || (error as any).message));
            setIsUndoing(false);
        }
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log('🔄 Undo button clicked for:', sectionKey);
                handleUndo();
            }}
            disabled={isUndoing}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-white shadow-lg transition-all hover:bg-purple-600 hover:scale-110 active:scale-95 disabled:cursor-wait disabled:opacity-50"
            title="Undo - Kembalikan ke versi sebelumnya"
            type="button"
        >
            {isUndoing ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <RotateCcw className="h-4 w-4" />
            )}
        </button>
    );
}

