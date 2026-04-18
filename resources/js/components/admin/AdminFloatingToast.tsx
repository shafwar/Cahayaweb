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
                        className="pointer-events-auto flex max-w-[min(100%,28rem)] items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg shadow-slate-900/10 sm:max-w-lg"
                        style={{
                            background:
                                toast.type === 'error'
                                    ? 'linear-gradient(135deg, #fef2f2 0%, #fff 45%)'
                                    : toast.type === 'info'
                                      ? 'linear-gradient(135deg, #eff6ff 0%, #fff 45%)'
                                      : 'linear-gradient(135deg, #fffbeb 0%, #fff 45%)',
                            borderColor:
                                toast.type === 'error' ? '#fecaca' : toast.type === 'info' ? '#bfdbfe' : '#fde68a',
                        }}
                    >
                        <span className="mt-0.5 shrink-0" aria-hidden>
                            {toast.type === 'error' ? (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            ) : toast.type === 'info' ? (
                                <Info className="h-5 w-5 text-blue-600" />
                            ) : (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            )}
                        </span>
                        <p className="min-w-0 flex-1 text-sm leading-snug text-slate-800">{toast.message}</p>
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
