import { type ReactNode } from 'react';
import { adminGlassPanel, adminMuted, adminSectionDesc, adminSectionTitle, adminFieldLabel } from '@/lib/admin-portal-theme';

type Props = {
    id?: string;
    /** Nomor langkah (1, 2, …) untuk hierarki visual */
    step?: number;
    title: string;
    description?: string;
    icon?: ReactNode;
    children: ReactNode;
};

export function AdminFormSection({ id, step, title, description, icon, children }: Props) {
    return (
        <section id={id} className={`${adminGlassPanel} scroll-mt-28 overflow-hidden`}>
            <div className="border-b border-slate-100 bg-gradient-to-br from-white via-white to-slate-50/40 px-6 py-5 sm:px-8 sm:py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-4">
                        {typeof step === 'number' ? (
                            <span
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-xs font-bold text-white shadow-md shadow-orange-200/70"
                                aria-hidden
                            >
                                {step}
                            </span>
                        ) : null}
                        {icon ? (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                                {icon}
                            </div>
                        ) : null}
                        <div className="min-w-0 pt-0.5">
                            <h2 className={adminSectionTitle}>{title}</h2>
                            {description ? <p className={adminSectionDesc}>{description}</p> : null}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white px-6 py-6 sm:px-8 sm:py-8">{children}</div>
        </section>
    );
}

export function AdminFieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

export function AdminField({
    label,
    hint,
    children,
    error,
}: {
    label: string;
    hint?: string;
    children: ReactNode;
    error?: string;
}) {
    return (
        <div className="space-y-2">
            <label className={adminFieldLabel}>{label}</label>
            {children}
            {hint ? <p className={`text-xs leading-relaxed ${adminMuted}`}>{hint}</p> : null}
            <AdminFieldError message={error} />
        </div>
    );
}
