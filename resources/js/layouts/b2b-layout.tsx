import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeftRight, Briefcase, Building2, Home, MessageCircle } from 'lucide-react';
import { type ReactNode, useMemo } from 'react';

export default function B2BLayout({ children }: { children: ReactNode }) {
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 200], [0.0, 0.9]);
    const blur = useTransform(scrollY, [0, 200], [0, 8]);
    const headerHeight = useTransform(scrollY, [0, 120], [80, 60]);

    return (
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
            <motion.header
                className="sticky top-0 z-40"
                style={{ backgroundColor: `rgba(20, 0, 25, ${bgOpacity.get()})`, backdropFilter: `saturate(160%) blur(${blur.get()}px)` }}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <motion.div className="mx-auto flex max-w-7xl items-center justify-between px-3 md:px-6" style={{ height: headerHeight }}>
                    <div className="mr-6 text-xl font-semibold tracking-tight whitespace-nowrap md:text-2xl">
                        <span className="text-accent">Cahaya</span> <span className="text-primary">Anbiya</span>
                        <span className="ml-2 text-sm font-normal text-muted-foreground">/ B2B</span>
                    </div>
                    <nav className="hidden items-center gap-6 text-[15px] md:flex">
                        <B2BLink href={route('b2b.index')} icon={Building2}>
                            Agency
                        </B2BLink>
                        <B2BLink href={route('b2b.index') + '#packages'} icon={Briefcase}>
                            Packages
                        </B2BLink>
                        <B2BLink href="https://wa.me/6281234567890" icon={MessageCircle} target="_blank">
                            WhatsApp
                        </B2BLink>
                        <div className="mx-0.5 hidden h-6 w-px bg-border/70 md:block" />
                        <Link href={route('b2c.home')} className="rounded-md border px-4 py-2 text-base">
                            <span className="inline-flex items-center gap-2">
                                <Home className="h-[18px] w-[18px]" /> B2C Site
                            </span>
                        </Link>
                        <Link href={route('home')} className="rounded-md bg-primary px-4 py-2 text-base text-primary-foreground">
                            <span className="inline-flex items-center gap-2">
                                <ArrowLeftRight className="h-[18px] w-[18px]" /> Switch
                            </span>
                        </Link>
                    </nav>
                </motion.div>
                <B2BBreadcrumbBar />
            </motion.header>
            <main className="flex-1">{children}</main>
        </div>
    );
}

function B2BLink({
    href,
    children,
    icon: Icon,
    target,
}: {
    href: string;
    children: ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
    target?: string;
}) {
    return (
        <motion.a href={href} target={target} className="relative font-medium tracking-wide transition-colors hover:text-accent">
            <span className="inline-flex items-center gap-1.5">
                {Icon ? <Icon className="h-[18px] w-[18px] opacity-80" /> : null}
                {children}
            </span>
        </motion.a>
    );
}

function B2BBreadcrumbBar() {
    const page = usePage();
    const location = (page.props as Record<string, unknown>).ziggy?.location || (typeof window !== 'undefined' ? window.location.href : '');
    const path = useMemo(() => {
        try {
            const url = new URL(location);
            return url.pathname;
        } catch {
            return '/';
        }
    }, [location]);
    if (path === '/b2b') return null;
    const parts = path.split('/').filter(Boolean);
    const crumbs = parts.map((p, i) => ({
        href: '/' + parts.slice(0, i + 1).join('/'),
        title: p.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
    }));
    return (
        <div className="border-b/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <div className="mx-auto flex h-10 max-w-7xl items-center gap-2 px-4 text-xs text-muted-foreground md:text-sm">
                <Link href={route('b2b.index')} className="hover:text-accent">
                    B2B
                </Link>
                {crumbs.map((c, i) => (
                    <div key={c.href} className="inline-flex items-center gap-2">
                        <span>›</span>
                        {i < crumbs.length - 1 ? (
                            <Link href={c.href} className="hover:text-accent">
                                {c.title}
                            </Link>
                        ) : (
                            <span className="text-foreground">{c.title}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
