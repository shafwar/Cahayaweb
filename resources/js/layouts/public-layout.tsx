import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Home, Info, MapPin, Newspaper, Phone, Sparkles } from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

// Google Fonts import untuk Playfair Display
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

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
                style={{
                    backgroundColor: `rgba(20, 0, 25, ${bgOpacity.get()})`,
                    backdropFilter: `saturate(160%) blur(${blur.get()}px)`,
                }}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <motion.div className="mx-auto flex max-w-7xl items-center justify-between px-3 md:px-6" style={{ height: headerHeight }}>
                    {/* Clean and Elegant Logo Design */}
                    <motion.div style={{ scale }} className="mr-4 -ml-2 shrink-0 pr-4 md:mr-8 md:-ml-4">
                        <Link href={route('b2c.home')} className="group relative inline-block">
                            <div className="flex items-center">
                                {/* Cahaya Anbiya Logo */}
                                <img src="/cahayanbiyalogo.png" alt="Cahaya Anbiya Logo" className="h-14 w-auto sm:h-16 md:h-18 lg:h-20" />
                            </div>

                            {/* Subtle hover underline */}
                            <motion.div
                                className="absolute -bottom-1 left-0 h-0.5 bg-accent"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            />
                        </Link>
                    </motion.div>

                    {/* Enhanced Navigation with Beautiful Design */}
                    <motion.nav className="hidden shrink-0 items-center text-[15px] md:flex" style={{ gap }}>
                        <NavLink icon={Home} href={route('b2c.home')}>
                            Home
                        </NavLink>
                        <NavLink icon={Info} href={route('b2c.about')}>
                            About
                        </NavLink>
                        <NavLink icon={MapPin} href={route('b2c.destinations')}>
                            Destinations
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

                        {/* Elegant Separator */}
                        <div className="mx-2 h-6 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

                        {/* Enhanced Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('home')}
                                className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:shadow-lg"
                            >
                                <span className="relative z-10">B2B/B2C</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </Link>
                            <Link
                                href={route('login')}
                                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-accent to-accent/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-accent/90 hover:to-accent hover:shadow-xl"
                            >
                                <span className="relative z-10">Login</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </Link>
                        </div>
                    </motion.nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen((s) => !s)}
                        className="relative rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/10 md:hidden"
                        aria-label="Toggle mobile menu"
                    >
                        <div className="flex items-center gap-2">
                            <span>{mobileOpen ? 'Close' : 'Menu'}</span>
                            <motion.div animate={{ rotate: mobileOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="h-4 w-4">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </motion.div>
                        </div>
                    </button>
                </motion.div>

                {/* Enhanced Mobile Navigation */}
                <motion.div
                    initial={false}
                    animate={{
                        height: mobileOpen ? 'auto' : 0,
                        opacity: mobileOpen ? 1 : 0,
                        y: mobileOpen ? 0 : -10,
                    }}
                    transition={{
                        duration: 0.3,
                        ease: [0.25, 0.25, 0, 1],
                    }}
                    className="overflow-hidden border-t border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl md:hidden"
                >
                    <div className="mx-auto max-w-6xl px-4 py-6">
                        {/* Navigation Links */}
                        <div className="grid gap-1">
                            {[
                                { href: route('b2c.home'), label: 'Home', icon: Home },
                                { href: route('b2c.about'), label: 'About', icon: Info },
                                { href: route('b2c.destinations'), label: 'Destinations', icon: MapPin },

                                { href: route('b2c.highlights'), label: 'Highlights', icon: Sparkles },
                                { href: route('b2c.blog'), label: 'Blog', icon: Newspaper },
                                { href: route('b2c.contact'), label: 'Contact', icon: Phone },
                            ].map((item) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Link
                                        href={item.href}
                                        className="group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-white/10 hover:shadow-lg"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <item.icon className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100" />
                                        <span>{item.label}</span>
                                        <motion.div
                                            className="ml-auto h-1 w-1 rounded-full bg-accent opacity-0 transition-opacity"
                                            initial={{ scale: 0 }}
                                            whileHover={{ scale: 1, opacity: 1 }}
                                        />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Separator */}
                        <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        {/* Action Buttons */}
                        <div className="grid gap-3">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                                <Link
                                    href={route('home')}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-base font-medium text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:shadow-lg"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <span>Switch to B2B/B2C</span>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                        />
                                    </svg>
                                </Link>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
                                <Link
                                    href={route('login')}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent/80 px-4 py-3 text-base font-semibold text-accent-foreground shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-accent/90 hover:to-accent/70 hover:shadow-xl"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <span>Login to Account</span>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                        />
                                    </svg>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.header>
            <BreadcrumbBar />
            <main className="flex-1">{children}</main>
        </div>
    );
}

function NavLink({ href, children, icon: Icon }: { href: string; children: ReactNode; icon?: React.ComponentType<{ className?: string }> }) {
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
    const location =
        (page.props as { ziggy?: { location?: string } })?.ziggy?.location || (typeof window !== 'undefined' ? window.location.href : '');
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
