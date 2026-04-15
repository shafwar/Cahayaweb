import { type ReactNode } from 'react';
import { adminGlassPanel, adminMuted, adminSectionDesc, adminSectionHeader, adminSectionTitle, adminFieldLabel } from '@/lib/admin-portal-theme';

type Props = {
    title: string;
    description?: string;
    icon?: ReactNode;
    children: ReactNode;
};

export function AdminFormSection({ title, description, icon, children }: Props) {
    return (
        <section className={`${adminGlassPanel} overflow-hidden`}>
            <div className={adminSectionHeader}>
                <div className="flex items-start gap-3">
                    {icon ? <div className="mt-0.5 text-orange-600">{icon}</div> : null}
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
        <div className="space-y-1.5">
            <label className={adminFieldLabel}>{label}</label>
            {children}
            {hint ? <p className={`text-xs ${adminMuted}`}>{hint}</p> : null}
            <AdminFieldError message={error} />
        </div>
    );
}
