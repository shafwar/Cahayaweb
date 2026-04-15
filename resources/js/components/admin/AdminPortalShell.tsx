import { type ReactNode } from 'react';
import { adminAmbient, adminContent, adminPageBg } from '@/lib/admin-portal-theme';

type Props = {
    children: ReactNode;
    /** e.g. max-w-5xl */
    className?: string;
};

export default function AdminPortalShell({ children, className = 'mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8' }: Props) {
    return (
        <div className={adminPageBg}>
            <div className={adminAmbient} aria-hidden />
            <div className={`${adminContent} ${className}`}>{children}</div>
        </div>
    );
}
