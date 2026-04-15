import { type ReactNode } from 'react';
import { adminGlassPanel, adminMuted, adminSectionDesc, adminSectionTitle } from '@/lib/admin-portal-theme';

type Props = {
    title: string;
    description?: string;
    icon?: ReactNode;
    children: ReactNode;
};

export function AdminFormSection({ title, description, icon, children }: Props) {
    return (
        <section className={`${adminGlassPanel} overflow-hidden`}>
            <div className="border-b border-[#2d4a6f]/30 bg-gradient-to-r from-[#1e3a5f]/40 via-transparent to-[#ff5200]/5 px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                    {icon ? <div className="mt-0.5 text-[#fec901]">{icon}</div> : null}
                    <div>
                        <h2 className={adminSectionTitle}>{title}</h2>
                        {description ? <p className={adminSectionDesc}>{description}</p> : null}
                    </div>
                </div>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
        </section>
    );
}

export function AdminFieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1.5 text-xs font-medium text-red-300">{message}</p>;
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
        <div className="space-y-1">
            <label className="block text-sm font-medium text-[#e2e8f0]">{label}</label>
            {children}
            {hint ? <p className={`text-xs ${adminMuted}`}>{hint}</p> : null}
            <AdminFieldError message={error} />
        </div>
    );
}
