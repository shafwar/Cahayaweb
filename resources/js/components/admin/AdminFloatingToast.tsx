import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useEffect } from 'react';

export type AdminToastPayload = {
    type: 'success' | 'error' | 'info';
    message: string;
};

type Props = {
    toast: AdminToastPayload | null;
    onDismiss: () => void;
    /** Auto-hide duration in ms */
    durationMs?: number;
};

export default function AdminFloatingToast({ toast, onDismiss, durationMs = 4800 }: Props) {
    useEffect(() => {
        if (!toast) {
            return;
        }
        const id = window.setTimeout(onDismiss, durationMs);
        return () => window.clearTimeout(id);
    }, [toast, durationMs, onDismiss]);

    return (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[10050] flex justify-center px-4 sm:top-6">
            <AnimatePresence mode="wait">
                {toast ? (
                    <motion.div
                        key={toast.message}
                        role="status"
                        initial={{ opacity: 0, y: -16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className={`pointer-events-auto flex max-w-[min(100%,28rem)] items-start gap-3 rounded-2xl border-2 px-4 py-3 shadow-xl shadow-slate-900/15 sm:max-w-lg ${
                            toast.type === 'success'
                                ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-white'
                                : toast.type === 'error'
                                  ? 'border-red-200 bg-gradient-to-br from-red-50 via-white to-white'
                                  : 'border-blue-200 bg-gradient-to-br from-blue-50 via-white to-white'
                        }`}
                    >
                        <span className="mt-0.5 shrink-0 rounded-full bg-white/90 p-1 shadow-sm ring-1 ring-black/5" aria-hidden>
                            {toast.type === 'error' ? (
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            ) : toast.type === 'info' ? (
                                <Info className="h-6 w-6 text-blue-600" />
                            ) : (
                                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                            )}
                        </span>
                        <div className="min-w-0 flex-1">
                            {toast.type === 'success' ? (
                                <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">Berhasil</p>
                            ) : toast.type === 'error' ? (
                                <p className="text-xs font-bold uppercase tracking-wide text-red-800">Gagal</p>
                            ) : null}
                            <p className="mt-0.5 text-sm leading-snug text-slate-800">{toast.message}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onDismiss}
                            className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        >
                            Tutup
                        </button>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
