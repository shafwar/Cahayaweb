import AppLogoIcon from '@/components/app-logo-icon';
import { adminAmbient, adminMuted, adminPageBg } from '@/lib/admin-portal-theme';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    /** @deprecated All auth screens use the same light brand shell; value is ignored. */
    variant?: 'default' | 'admin';
}

/**
 * Cahaya Anbiya auth — single light palette (krem + navy + oranye) for /login,
 * /register, /forgot-password, etc. Avoids dark + blue primary from the old default branch.
 */
export default function AuthSimpleLayout({
    children,
    title,
    description,
    variant: _variant,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className={`${adminPageBg} relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10`}>
            <div className={adminAmbient} aria-hidden />
            <div className="relative z-10 w-full max-w-sm text-slate-800">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-orange-100">
                                <AppLogoIcon className="size-12 h-auto w-auto" />
                            </div>
                            <span className="bg-gradient-to-r from-amber-600 via-[#1e3a5f] to-[#ff5200] bg-clip-text font-semibold text-transparent">
                                Cahaya Anbiya
                            </span>
                            <span className="sr-only">{title}</span>
                        </Link>
                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-semibold tracking-tight text-[#1e3a5f]">{title}</h1>
                            <p className={`text-center text-sm ${adminMuted}`}>{description}</p>
                        </div>
                    </div>
                    <div className="[&_input]:border-slate-200 [&_input]:bg-white [&_input]:text-slate-900 [&_label]:text-slate-700">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
