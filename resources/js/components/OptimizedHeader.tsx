import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Home, Info, LogIn, MapPin, Menu, Newspaper, Package, Phone, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface NavigationItem {
    name: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    hasDropdown?: boolean;
    dropdownItems?: Array<{
        name: string;
        href: string;
        description?: string;
    }>;
}

const navigationItems: NavigationItem[] = [
    {
        name: 'Home',
        href: route('b2c.home'),
        icon: Home,
    },
    {
        name: 'About',
        href: route('b2c.about'),
        icon: Info,
        hasDropdown: true,
        dropdownItems: [
            { name: 'Our Story', href: route('b2c.about'), description: 'Learn about our journey' },
            { name: 'Vision & Mission', href: route('b2c.about'), description: 'Our goals and values' },
            { name: 'Team', href: route('b2c.about'), description: 'Meet our team' },
        ],
    },
    {
        name: 'Destinations',
        href: route('b2c.destinations'),
        icon: MapPin,
    },
    {
        name: 'Packages',
        href: route('b2c.packages'),
        icon: Package,
    },
    {
        name: 'Highlights',
        href: route('b2c.highlights'),
        icon: Sparkles,
    },
    {
        name: 'Blog',
        href: route('b2c.blog'),
        icon: Newspaper,
    },
    {
        name: 'Contact',
        href: route('b2c.contact'),
        icon: Phone,
    },
];

export default function OptimizedHeader() {
    const page = usePage();
    const { scrollY } = useScroll();

    // Enhanced scroll-based transforms
    const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.95]);
    const blur = useTransform(scrollY, [0, 100], [0, 12]);
    const scale = useTransform(scrollY, [0, 100], [1, 0.95]);
    const headerHeight = useTransform(scrollY, [0, 100], [80, 64]);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const [lastScrollY, setLastScrollY] = useState(0);

    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Enhanced scroll detection with direction
    useEffect(() => {
        let ticking = false;

        const updateScrollState = () => {
            const currentScrollY = window.scrollY;
            const direction = currentScrollY > lastScrollY ? 'down' : 'up';

            setIsScrolled(currentScrollY > 100);

            if (direction !== scrollDirection && Math.abs(currentScrollY - lastScrollY) > 10) {
                setScrollDirection(direction);
                setIsScrolling(true);

                // Auto-hide header when scrolling down fast
                if (direction === 'down' && currentScrollY > 200 && isMobileMenuOpen) {
                    setIsMobileMenuOpen(false);
                }
            }

            setLastScrollY(currentScrollY);

            // Reset scrolling state
            setTimeout(() => setIsScrolling(false), 150);
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollState);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollDirection, lastScrollY, isMobileMenuOpen]);

    // Enhanced body scroll lock with proper cleanup
    useEffect(() => {
        if (isMobileMenuOpen) {
            const scrollY = window.scrollY;
            const originalOverflow = document.body.style.overflow;
            const originalPosition = document.body.style.position;

            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.classList.add('mobile-menu-open');

            return () => {
                document.body.style.position = originalPosition;
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = originalOverflow;
                document.body.classList.remove('mobile-menu-open');
                window.scrollTo(0, scrollY);
            };
        }
    }, [isMobileMenuOpen]);

    // Click outside to close with enhanced detection
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                const hamburgerButton = (event.target as Element).closest('[aria-label*="menu"]');
                if (!hamburgerButton) {
                    setIsMobileMenuOpen(false);
                }
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    // ESC key to close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMobileMenuOpen(false);
                setActiveDropdown(null);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => document.removeEventListener('keydown', handleEscape);
    }, [isMobileMenuOpen]);

    // Route change handler
    useEffect(() => {
        const handleRouteChange = () => {
            setIsMobileMenuOpen(false);
            setActiveDropdown(null);
            setExpandedMobileItems([]);
        };

        window.addEventListener('hashchange', handleRouteChange);
        return () => window.removeEventListener('hashchange', handleRouteChange);
    }, []);

    const toggleMobileItem = useCallback((itemName: string) => {
        setExpandedMobileItems((prev) => (prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName]));
    }, []);

    const shouldUseLightTheme = isScrolled;

    return (
        <>
            {/* Enhanced Dynamic Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
                className={`fixed top-0 right-0 left-0 z-[9999] transition-all duration-700 ${
                    shouldUseLightTheme
                        ? 'border-b border-secondary/20 bg-white/95 shadow-xl backdrop-blur-xl'
                        : 'bg-gradient-to-r from-black/90 via-black/80 to-black/90'
                }`}
                style={{
                    backgroundColor: shouldUseLightTheme ? `rgba(255, 255, 255, ${bgOpacity.get()})` : `rgba(0, 0, 0, ${bgOpacity.get()})`,
                    backdropFilter: `saturate(180%) blur(${blur.get()}px)`,
                    boxShadow: shouldUseLightTheme ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
            >
                <motion.div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ height: headerHeight }}>
                    <div className="flex h-full items-center justify-between">
                        {/* Enhanced Logo - Clean & Proportional */}
                        <motion.div style={{ scale }} className="flex items-center">
                            <Link href={route('b2c.home')} className="group relative inline-block">
                                <div className="flex items-center justify-center">
                                    <img
                                        src="/cahayanbiyalogo.png"
                                        alt="Cahaya Anbiya Logo"
                                        className="h-12 w-auto transition-all duration-300 group-hover:scale-105 sm:h-14 md:h-16 lg:h-18"
                                    />
                                </div>

                                {/* Subtle hover glow effect */}
                                <motion.div
                                    className={`absolute inset-0 rounded-full opacity-0 blur-sm transition-opacity duration-300 ${
                                        shouldUseLightTheme ? 'bg-secondary/20' : 'bg-accent/20'
                                    }`}
                                    whileHover={{ opacity: 1 }}
                                />
                            </Link>
                        </motion.div>

                        {/* Enhanced Desktop Navigation */}
                        <nav className="hidden items-center space-x-1 lg:flex">
                            {navigationItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={item.href}
                                        className={`group flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-300 ${
                                            shouldUseLightTheme
                                                ? 'text-gray-700 hover:bg-secondary/10 hover:text-secondary'
                                                : 'text-white hover:bg-white/10 hover:text-accent'
                                        }`}
                                    >
                                        {item.icon && <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />}
                                        <span>{item.name}</span>
                                        {item.hasDropdown && (
                                            <motion.div animate={{ rotate: activeDropdown === item.name ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                                <ChevronDown className="h-4 w-4" />
                                            </motion.div>
                                        )}
                                    </Link>

                                    {/* Enhanced Dropdown */}
                                    {item.hasDropdown && (
                                        <AnimatePresence>
                                            {activeDropdown === item.name && (
                                                <motion.div
                                                    ref={dropdownRef}
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 mt-2 min-w-[240px] overflow-hidden rounded-2xl border border-secondary/20 bg-white/95 shadow-2xl backdrop-blur-xl"
                                                >
                                                    <div className="py-2">
                                                        {item.dropdownItems?.map((subItem, index) => (
                                                            <motion.div
                                                                key={subItem.name}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.05 }}
                                                            >
                                                                <Link
                                                                    href={subItem.href}
                                                                    className="block px-4 py-3 text-sm text-gray-700 transition-all duration-200 hover:bg-secondary/10 hover:text-secondary"
                                                                >
                                                                    <div className="font-medium">{subItem.name}</div>
                                                                    {subItem.description && (
                                                                        <div className="mt-0.5 text-xs text-gray-500">{subItem.description}</div>
                                                                    )}
                                                                </Link>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>
                            ))}

                            {/* Separator */}
                            <div className="mx-3 h-6 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

                            {/* Enhanced Action Buttons */}
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route('home')}
                                    className={`group relative overflow-hidden rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                        shouldUseLightTheme
                                            ? 'border-secondary/30 bg-secondary/5 text-black hover:border-secondary/50 hover:bg-secondary/10'
                                            : 'border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10'
                                    }`}
                                >
                                    <span className="relative z-10">B2B/B2C</span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '100%' }}
                                        transition={{ duration: 0.6 }}
                                    />
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-accent to-accent/90 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-accent/90 hover:to-accent hover:shadow-xl"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <LogIn className="h-4 w-4" />
                                        Login
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '100%' }}
                                        transition={{ duration: 0.6 }}
                                    />
                                </Link>
                            </div>
                        </nav>

                        {/* Enhanced Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={`rounded-xl p-3 transition-all duration-300 lg:hidden ${
                                shouldUseLightTheme ? 'bg-secondary/10 text-black hover:bg-secondary/20' : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                            aria-label="Open mobile menu"
                        >
                            <motion.div
                                animate={{
                                    rotate: isMobileMenuOpen ? 90 : 0,
                                    scale: isMobileMenuOpen ? 1.1 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <Menu className="h-5 w-5" />
                            </motion.div>
                        </button>
                    </div>
                </motion.div>
            </motion.header>

            {/* Enhanced Mobile Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[9999] lg:hidden" ref={mobileMenuRef}>
                        {/* Enhanced Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Enhanced Sidebar Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 200,
                                mass: 0.8,
                            }}
                            className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-white via-white to-gray-50 shadow-2xl"
                            style={{ height: '100dvh' }}
                        >
                            <div className="flex h-full flex-col">
                                {/* Enhanced Header - Clean Logo Only */}
                                <div className="flex items-center justify-between border-b bg-gradient-to-r from-secondary/10 to-accent/10 p-6">
                                    <div className="flex items-center space-x-3">
                                        <img src="/cahayanbiyalogo.png" alt="Cahaya Anbiya Logo" className="h-12 w-auto" />
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="rounded-xl bg-white/80 p-2 transition-colors hover:bg-white"
                                        aria-label="Close mobile menu"
                                    >
                                        <X className="h-5 w-5 text-gray-700" />
                                    </button>
                                </div>

                                {/* Enhanced Navigation */}
                                <nav className="flex-1 overflow-y-auto px-4 py-6">
                                    <div className="space-y-2">
                                        {navigationItems.map((item, index) => (
                                            <motion.div
                                                key={item.name}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div>
                                                    <Link
                                                        href={item.href}
                                                        className="group flex items-center justify-between rounded-xl px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-secondary/10 hover:text-secondary"
                                                        onClick={() => !item.hasDropdown && setIsMobileMenuOpen(false)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {item.icon && (
                                                                <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                                                            )}
                                                            <span className="font-medium">{item.name}</span>
                                                        </div>
                                                        {item.hasDropdown && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    toggleMobileItem(item.name);
                                                                }}
                                                                className="p-1"
                                                            >
                                                                <motion.div
                                                                    animate={{
                                                                        rotate: expandedMobileItems.includes(item.name) ? 180 : 0,
                                                                    }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <ChevronDown className="h-4 w-4" />
                                                                </motion.div>
                                                            </button>
                                                        )}
                                                    </Link>

                                                    {/* Enhanced Dropdown Items */}
                                                    {item.hasDropdown && (
                                                        <AnimatePresence>
                                                            {expandedMobileItems.includes(item.name) && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="mt-1 ml-4 space-y-1 border-l-2 border-secondary/30 pl-4">
                                                                        {item.dropdownItems?.map((subItem, subIndex) => (
                                                                            <motion.div
                                                                                key={subItem.name}
                                                                                initial={{ opacity: 0, x: -10 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                transition={{ delay: subIndex * 0.1 }}
                                                                            >
                                                                                <Link
                                                                                    href={subItem.href}
                                                                                    className="block rounded-lg px-4 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-secondary/10 hover:text-secondary"
                                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                                >
                                                                                    <div className="font-medium">{subItem.name}</div>
                                                                                    {subItem.description && (
                                                                                        <div className="mt-0.5 text-xs text-gray-500">
                                                                                            {subItem.description}
                                                                                        </div>
                                                                                    )}
                                                                                </Link>
                                                                            </motion.div>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </nav>

                                {/* Enhanced Footer CTA */}
                                <div className="border-t bg-gradient-to-r from-secondary/10 to-accent/10 p-6">
                                    <div className="space-y-3">
                                        <Link
                                            href={route('home')}
                                            className="block w-full rounded-xl bg-secondary/20 py-3 text-center font-medium text-secondary transition-colors hover:bg-secondary/30"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Switch to B2B/B2C
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="block w-full rounded-xl bg-gradient-to-r from-accent to-accent/90 py-3 text-center font-semibold text-white shadow-lg transition-all duration-300 hover:from-accent/90 hover:to-accent"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Login to Account
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
