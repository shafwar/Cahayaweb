import AppLogoIcon from '@/components/app-logo-icon';
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
            <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#0a1628] p-6 md:p-10">
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,82,0,0.14),transparent_55%),radial-gradient(ellipse_at_80%_100%,rgba(254,201,1,0.1),transparent_45%)]"
                    aria-hidden
                />
                <div className="relative z-10 w-full max-w-sm">
                    <div className="dark rounded-2xl border border-[#2d4a6f]/45 bg-[#0d1422]/92 p-8 shadow-2xl shadow-black/40 backdrop-blur-md">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                                    <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-[#ff5200]/25">
                                        <AppLogoIcon className="size-12 h-auto w-auto" />
                                    </div>
                                    <span className="bg-gradient-to-r from-[#fec901] via-white to-[#ff6b35] bg-clip-text font-semibold text-transparent">
                                        Cahaya Anbiya
                                    </span>
                                    <span className="sr-only">{title}</span>
                                </Link>
                                <div className="space-y-2 text-center">
                                    <h1 className="text-xl font-semibold text-white">{title}</h1>
                                    <p className="text-center text-sm text-[#94a3b8]">{description}</p>
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
