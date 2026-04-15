import AppLogoIcon from '@/components/app-logo-icon';
import { adminAmbient, adminGlassPanel, adminMuted, adminPageBg } from '@/lib/admin-portal-theme';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'admin';
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
    variant = 'default',
}: PropsWithChildren<AuthLayoutProps>) {
    if (variant === 'admin') {
        return (
            <div className={`${adminPageBg} flex min-h-svh flex-col items-center justify-center p-6 md:p-10`}>
                <div className={adminAmbient} aria-hidden />
                <div className="relative z-10 w-full max-w-sm">
                    <div className={`${adminGlassPanel} p-8 shadow-md shadow-slate-200/50`}>
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
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-12 h-auto w-auto" />
                            </div>
                            <span className="font-semibold text-primary">Cahaya Anbiya</span>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
