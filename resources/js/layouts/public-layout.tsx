import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Home as HomeIcon, Info, MapPin, Newspaper, Package, Phone, Sparkles } from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 200], [0.0, 0.9]);
    const blur = useTransform(scrollY, [0, 200], [0, 8]);
    const scale = useTransform(scrollY, [0, 120], [1, 0.96]);
    const gap = useTransform(scrollY, [0, 120], [32, 22]);
    const headerHeight = useTransform(scrollY, [0, 120], [80, 60]);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onRoute = () => setMobileOpen(false);
        window.addEventListener('hashchange', onRoute);
        return () => window.removeEventListener('hashchange', onRoute);
    }, []);

    return (
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
            <motion.header
                className="border-b/50 sticky top-0 z-40"
                style={{ backgroundColor: `rgba(20, 0, 25, ${bgOpacity.get()})`, backdropFilter: `saturate(160%) blur(${blur.get()}px)` }}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <motion.div className="mx-auto flex max-w-7xl items-center justify-between px-3 md:px-6" style={{ height: headerHeight }}>
                    <motion.div style={{ scale }} className="mr-4 shrink-0 pr-4 md:mr-8">
                        <Link href={route('b2c.home')} className="text-xl leading-none font-semibold tracking-tight whitespace-nowrap md:text-2xl">
                            <span className="text-accent">Cahaya</span> <span className="text-primary">Anbiya</span>
                        </Link>
                    </motion.div>
                    <motion.nav className="hidden shrink-0 items-center text-[15px] md:flex" style={{ gap }}>
                        <NavLink icon={HomeIcon} href={route('b2c.home')}>
                            Home
                        </NavLink>
                        <NavLink icon={Info} href={route('b2c.about')}>
                            About
                        </NavLink>
                        <NavLink icon={MapPin} href={route('b2c.destinations')}>
                            Destinations
                        </NavLink>
                        <NavLink icon={Package} href={route('b2c.packages')}>
                            Packages
                        </NavLink>
                        <NavLink icon={Sparkles} href={route('b2c.highlights')}>
                            Highlights
                        </NavLink>
                        <NavLink icon={Newspaper} href={route('b2c.blog')}>
                            Blog
                        </NavLink>
                        <NavLink icon={Phone} href={route('b2c.contact')}>
                            Contact
                        </NavLink>
                        <div className="mx-0.5 hidden h-6 w-px bg-border/70 md:block" />
                        <div className="flex items-center gap-2">
                            <Link href={route('home')} className="rounded-md border px-4 py-2 text-base">
                                B2B/B2C
                            </Link>
                            <Link
                                href={route('login')}
                                className="rounded-md bg-primary px-4 py-2 text-base text-primary-foreground shadow-sm hover:brightness-110"
                            >
                                Login
                            </Link>
                        </div>
                    </motion.nav>
                    <button onClick={() => setMobileOpen((s) => !s)} className="rounded-md border px-3 py-1.5 text-sm md:hidden">
                        Menu
                    </button>
                </motion.div>
                <motion.div
                    initial={false}
                    animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
                    className="overflow-hidden border-t md:hidden"
                >
                    <div className="mx-auto grid max-w-6xl gap-2 px-4 py-3 text-base">
                        <NavLink href={route('b2c.home')}>Home</NavLink>
                        <NavLink href={route('b2c.about')}>About</NavLink>
                        <NavLink href={route('b2c.destinations')}>Destinations</NavLink>
                        <NavLink href={route('b2c.packages')}>Packages</NavLink>
                        <NavLink href={route('b2c.highlights')}>Highlights</NavLink>
                        <NavLink href={route('b2c.blog')}>Blog</NavLink>
                        <NavLink href={route('b2c.contact')}>Contact</NavLink>
                        <Link href={route('home')} className="rounded-md border px-4 py-2">
                            B2B/B2C
                        </Link>
                        <Link href={route('login')} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
                            Login
                        </Link>
                    </div>
                </motion.div>
            </motion.header>
            <BreadcrumbBar />
            <main className="flex-1">{children}</main>
        </div>
    );
}

function NavLink({ href, children, icon: Icon }: { href: string; children: ReactNode; icon?: any }) {
    return (
        <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            <Link href={href} className="relative font-medium tracking-wide transition-colors hover:text-accent">
                <span className="inline-flex items-center gap-1.5">
                    {Icon ? <Icon className="h-[18px] w-[18px] opacity-80" /> : null}
                    {children}
                </span>
                <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 h-[2px] w-full bg-accent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </Link>
        </motion.div>
    );
}

function BreadcrumbBar() {
    const page = usePage();
    const location = (page.props as any).ziggy?.location || (typeof window !== 'undefined' ? window.location.href : '');
    const path = useMemo(() => {
        try {
            const url = new URL(location);
            return url.pathname;
        } catch {
            return '/';
        }
    }, [location]);

    if (path === '/' || path === '/home') return null;

    const parts = path.split('/').filter(Boolean);
    const crumbs = parts.map((p, i) => ({
        href: '/' + parts.slice(0, i + 1).join('/'),
        title: p.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
    }));

    return (
        <div className="border-b/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <div className="mx-auto flex h-10 max-w-6xl items-center gap-2 px-4 text-xs text-muted-foreground md:text-sm">
                <Link href={route('b2c.home')} className="hover:text-accent">
                    Home
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
