import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Home, Info, LogIn, MapPin, Menu, Package, Phone, Sparkles, X } from 'lucide-react';
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
        name: 'About Us',
        href: route('b2c.about'),
        icon: Info,
        hasDropdown: false,
    },
    {
        name: 'Destinations',
        href: route('b2c.destinations'),
        icon: MapPin,
        hasDropdown: true,
        dropdownItems: [
            { name: 'Saudi Arabia', href: route('b2c.destinations'), description: 'Holy Land destinations' },
            { name: 'Turkey', href: route('b2c.destinations'), description: 'Historical and cultural sites' },
            { name: 'Jordan', href: route('b2c.destinations'), description: 'Ancient wonders' },
            { name: 'Egypt', href: route('b2c.destinations'), description: 'Pyramids and more' },
        ],
    },
    {
        name: 'Packages',
        href: route('b2c.packages'),
        icon: Package,
        hasDropdown: true,
        dropdownItems: [
            { name: 'Umrah Packages', href: route('b2c.packages'), description: 'Complete Umrah journeys' },
            { name: 'Hajj Packages', href: route('b2c.packages'), description: 'Full Hajj experiences' },
            { name: 'Custom Tours', href: route('b2c.packages'), description: 'Tailored travel plans' },
        ],
    },
    {
        name: 'Highlights',
        href: route('b2c.highlights'),
        icon: Sparkles,
    },
    {
        name: 'Contact',
        href: route('b2c.contact'),
        icon: Phone,
    },
];

export default function OptimizedHeader() {
    const page = usePage();

    // ADVANCED STATE MANAGEMENT - Inspired by Kristalin
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);

    // KRISTALIN-STYLE MOBILE STATE MANAGEMENT
    const [mobilePackagesDropdownOpen, setMobilePackagesDropdownOpen] = useState(false);
    const [mobileDestinationsDropdownOpen, setMobileDestinationsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const [lastScrollY, setLastScrollY] = useState(0);

    // B2B/B2C SWITCH STATE MANAGEMENT
    const [currentMode, setCurrentMode] = useState<'b2c' | 'b2b'>('b2c');

    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // CIDATA-STYLE SMOOTH SCROLL FOLLOWING HEADER
    useEffect(() => {
        let ticking = false;
        let scrollTimeout: NodeJS.Timeout;
        let lastScrollTop = 0;

        const updateScrollState = () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - lastScrollTop);

            // Smooth scroll following - header moves naturally with page content
            if (scrollDelta > 1) {
                const direction = currentScrollY > lastScrollTop ? 'down' : 'up';

                // Header follows scroll smoothly - no abrupt changes
                setIsScrolled(currentScrollY > 30);
                setScrollDirection(direction);
                setIsScrolling(true);

                // Auto-hide mobile menu when scrolling down
                if (direction === 'down' && currentScrollY > 100 && isMobileMenuOpen) {
                    setIsMobileMenuOpen(false);
                }

                lastScrollTop = currentScrollY;
                setLastScrollY(currentScrollY);

                // Smooth debounce for natural feel
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    setIsScrolling(false);
                }, 120);
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollState);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });

        return () => {
            window.removeEventListener('scroll', requestTick);
            clearTimeout(scrollTimeout);
        };
    }, [isMobileMenuOpen]);

    // KRISTALIN-STYLE SOPHISTICATED SCROLL LOCK
    useEffect(() => {
        if (isMobileMenuOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.classList.add('mobile-menu-open');

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
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

    // KRISTALIN-STYLE AUTO-CLOSE ON RESIZE
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
                setMobileAboutDropdownOpen(false);
                setMobilePackagesDropdownOpen(false);
                setMobileDestinationsDropdownOpen(false);
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                document.body.classList.remove('mobile-menu-open');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        };

        return () => {
            handleRouteChange();
        };
    }, [page.url]);

    const toggleMobileItem = useCallback((itemName: string) => {
        setExpandedMobileItems((prev) => (prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName]));
    }, []);

    // Detect current mode based on URL
    useEffect(() => {
        const path = window.location.pathname;
        if (path.includes('/b2b')) {
            setCurrentMode('b2b');
        } else {
            setCurrentMode('b2c');
        }
    }, [page.url]);

    // B2B/B2C SWITCH FUNCTIONALITY
    const handleModeSwitch = useCallback(() => {
        const newMode = currentMode === 'b2c' ? 'b2b' : 'b2c';
        setCurrentMode(newMode);

        // Close mobile menu after switch
        setIsMobileMenuOpen(false);

        // Navigate to appropriate route
        if (newMode === 'b2b') {
            window.location.href = route('b2b.index');
        } else {
            window.location.href = route('b2c.home');
        }
    }, [currentMode]);

    // Consistent black theme - NO COLOR CHANGES
    const headerTheme = {
        background: 'rgba(0, 0, 0, 0.95)',
        textColor: 'text-white',
        hoverColor: 'hover:text-secondary',
        borderColor: 'border-secondary/20',
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        enhancedBackground: 'rgba(0, 0, 0, 0.98)',
        enhancedShadow: 'rgba(0, 0, 0, 0.6)',
    };

    return (
        <>
            {/* CIDATA-STYLE NATURAL SCROLL FOLLOWING HEADER */}
            <header
                className={`header-consistent relative z-[100] transition-all duration-300 ${isScrolled ? 'scrolled' : ''}`}
                style={{
                    backgroundColor: headerTheme.enhancedBackground,
                    backdropFilter: 'saturate(180%) blur(12px)',
                    WebkitBackdropFilter: 'saturate(180%) blur(12px)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
                }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between sm:h-20">
                        {/* NATURAL Logo - No motion transforms */}
                        <div className="flex items-center">
                            <Link href={route('b2c.home')} className="group relative inline-block">
                                <div className="flex items-center justify-center">
                                    <img
                                        src="/cahayanbiyalogo.png"
                                        alt="Cahaya Anbiya Logo"
                                        className="h-12 w-auto transition-all duration-300 group-hover:scale-105 sm:h-14"
                                    />
                                </div>

                                {/* Subtle hover glow effect */}
                                <div className="absolute inset-0 rounded-full bg-secondary/20 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
                            </Link>
                        </div>

                        {/* OPTIMIZED Desktop Navigation - Responsive & Smooth */}
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
                                            headerTheme.textColor + ' ' + headerTheme.hoverColor + ' hover:bg-white/10'
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

                                    {/* Enhanced Dropdown Menu */}
                                    {item.hasDropdown && (
                                        <AnimatePresence>
                                            {activeDropdown === item.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2, ease: [0.25, 0.25, 0, 1] }}
                                                    className="absolute top-full left-0 z-50 mt-2 w-64 rounded-xl border border-white/10 bg-black/95 p-2 shadow-2xl backdrop-blur-xl"
                                                >
                                                    {item.dropdownItems?.map((dropdownItem) => (
                                                        <Link
                                                            key={dropdownItem.name}
                                                            href={dropdownItem.href}
                                                            className="group block rounded-lg px-3 py-2 text-sm text-white transition-all duration-200 hover:bg-white/10 hover:text-secondary"
                                                        >
                                                            <div className="font-medium">{dropdownItem.name}</div>
                                                            {dropdownItem.description && (
                                                                <div className="text-xs text-gray-400 group-hover:text-gray-300">
                                                                    {dropdownItem.description}
                                                                </div>
                                                            )}
                                                        </Link>
                                                    ))}
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
                                <button
                                    onClick={handleModeSwitch}
                                    className={`group relative overflow-hidden rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                        currentMode === 'b2c'
                                            ? 'border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10'
                                            : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:border-yellow-500/50 hover:bg-yellow-500/20'
                                    }`}
                                >
                                    <span className="relative z-10">{currentMode === 'b2c' ? 'B2C → B2B' : 'B2B → B2C'}</span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '100%' }}
                                        transition={{ duration: 0.6 }}
                                    />
                                </button>
                                <Link
                                    href={route('login')}
                                    className={`group relative overflow-hidden rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 ${'border-secondary bg-secondary/10 text-secondary hover:border-secondary/80 hover:bg-secondary/20'}`}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <LogIn className="h-4 w-4" />
                                        Login
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/10 to-transparent"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '100%' }}
                                        transition={{ duration: 0.6 }}
                                    />
                                </Link>
                            </div>
                        </nav>

                        {/* NATURAL Mobile Menu Button - No motion transforms */}
                        <button
                            onClick={() => {
                                console.log('Mobile menu button clicked!', isMobileMenuOpen);
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                            }}
                            className={`mobile-menu-button rounded-xl p-3 transition-all duration-300 lg:hidden ${'bg-white/10 text-white hover:bg-white/20'}`}
                            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
                        >
                            <div className={`transition-all duration-300 ${isMobileMenuOpen ? 'scale-110 rotate-90' : 'scale-100 rotate-0'}`}>
                                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* ENHANCED MOBILE SIDEBAR - RESPONSIVE & FUNCTIONAL */}
            <AnimatePresence mode="wait">
                {isMobileMenuOpen && (
                    <div className="mobile-menu-container fixed inset-0 z-[9999] lg:hidden" ref={mobileMenuRef}>
                        {/* CONSISTENT BACKDROP - Same as header desktop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mobile-menu-backdrop absolute inset-0 backdrop-blur-sm"
                            onClick={() => {
                                console.log('Backdrop clicked, closing menu');
                                setIsMobileMenuOpen(false);
                            }}
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                backdropFilter: 'saturate(180%) blur(12px)',
                                WebkitBackdropFilter: 'saturate(180%) blur(12px)',
                            }}
                        />

                        {/* CONSISTENT DRAWER CONTAINER - Same theme as header desktop */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="mobile-drawer absolute top-0 right-0 bottom-0 z-[10000] w-80 overflow-y-auto shadow-2xl sm:w-96"
                            style={{
                                backgroundColor: headerTheme.enhancedBackground,
                                backdropFilter: 'saturate(180%) blur(12px)',
                                WebkitBackdropFilter: 'saturate(180%) blur(12px)',
                                borderLeft: '1px solid rgba(212, 175, 55, 0.15)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                                overscrollBehavior: 'contain',
                                WebkitOverflowScrolling: 'touch',
                            }}
                        >
                            {/* CONSISTENT MENU HEADER - Same theme as header desktop */}
                            <div className="flex items-center justify-between px-4 pt-4 pb-2">
                                <img src="/cahayanbiyalogo.png" alt="Cahaya Anbiya Logo" className="h-10 object-contain" />
                                <button
                                    className="p-2 text-white transition-all duration-300 ease-out hover:text-yellow-400"
                                    onClick={() => {
                                        console.log('Close button clicked');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    aria-label="Close menu"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* B2B/B2C SWITCH BUTTON - Same functionality as header desktop */}
                            <div className="flex items-center justify-center px-4 pb-4">
                                <button
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                                        currentMode === 'b2c'
                                            ? 'bg-white/10 text-white hover:bg-white/20 hover:text-yellow-400'
                                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 hover:text-yellow-300'
                                    }`}
                                    onClick={handleModeSwitch}
                                >
                                    {currentMode === 'b2c' ? 'B2C → B2B' : 'B2B → B2C'}
                                </button>
                            </div>

                            {/* CONSISTENT SEARCH BAR - Same theme as header desktop */}
                            <div className="px-4 pb-4">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (searchQuery.trim() !== '') {
                                            // Handle search
                                            setIsMobileMenuOpen(false);
                                        }
                                    }}
                                >
                                    <div className="relative flex items-center gap-2 rounded-xl border-2 border-yellow-500/30 bg-black/20 px-3 py-2">
                                        <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                        <input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search destinations..."
                                            className="min-w-0 flex-1 border-none bg-transparent text-base text-white placeholder-gray-400 outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 py-1 text-sm font-semibold text-white transition-all duration-300 hover:from-yellow-400 hover:to-yellow-500"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* CONSISTENT NAVIGATION - Same theme as header desktop */}
                            <nav className="flex-1 overflow-y-auto px-4 pb-4">
                                <div className="space-y-1">
                                    {navigationItems.map((item, index) => (
                                        <div key={index} className="mb-2">
                                            {item.hasDropdown ? (
                                                <div>
                                                    <button
                                                        className="group flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-all duration-300 hover:bg-yellow-500/10"
                                                        onClick={() => {
                                                            if (item.name === 'Packages') {
                                                                setMobilePackagesDropdownOpen(!mobilePackagesDropdownOpen);
                                                            } else if (item.name === 'Destinations') {
                                                                setMobileDestinationsDropdownOpen(!mobileDestinationsDropdownOpen);
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="mr-3 h-2 w-2 rounded-full bg-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                            <span className="font-medium text-white">{item.name}</span>
                                                        </div>
                                                        <svg
                                                            className={`h-5 w-5 transition-transform duration-300 ${
                                                                (item.name === 'Packages' && mobilePackagesDropdownOpen) ||
                                                                (item.name === 'Destinations' && mobileDestinationsDropdownOpen)
                                                                    ? 'rotate-180'
                                                                    : ''
                                                            }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                    <div
                                                        className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                                                            (item.name === 'Packages' && mobilePackagesDropdownOpen) ||
                                                            (item.name === 'Destinations' && mobileDestinationsDropdownOpen)
                                                                ? 'max-h-96 opacity-100'
                                                                : 'max-h-0 opacity-0'
                                                        }`}
                                                    >
                                                        {item.name === 'Packages' && (
                                                            <>
                                                                <Link
                                                                    href={route('b2c.packages')}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="block rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors duration-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                                                                >
                                                                    Umrah Packages
                                                                </Link>
                                                                <Link
                                                                    href={route('b2c.packages')}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="block rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors duration-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                                                                >
                                                                    Hajj Packages
                                                                </Link>
                                                                <Link
                                                                    href={route('b2c.packages')}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="block rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors duration-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                                                                >
                                                                    Custom Tours
                                                                </Link>
                                                            </>
                                                        )}
                                                        {item.name === 'Destinations' && (
                                                            <>
                                                                <Link
                                                                    href={route('b2c.destinations')}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="block rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors duration-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                                                                >
                                                                    Saudi Arabia
                                                                </Link>
                                                                <Link
                                                                    href={route('b2c.destinations')}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="block rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors duration-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                                                                >
                                                                    Turkey
                                                                </Link>
                                                                <Link
                                                                    href={route('b2c.destinations')}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="block rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors duration-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                                                                >
                                                                    Jordan
                                                                </Link>
                                                                <Link
                                                                    href={route('b2c.destinations')}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="block rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors duration-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                                                                >
                                                                    Egypt
                                                                </Link>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="group flex w-full items-center rounded-lg px-4 py-3 transition-all duration-300 hover:bg-yellow-500/10"
                                                >
                                                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                    <span className="font-medium text-white">{item.name}</span>
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </nav>

                            {/* LOGIN FEATURE - Same as header desktop */}
                            <div className="px-4 pb-4">
                                <Link
                                    href={route('login')}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:from-yellow-400 hover:to-yellow-500"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Login
                                </Link>
                            </div>

                            {/* CONSISTENT FOOTER - Same theme as header desktop */}
                            <div className="border-t border-yellow-500/20 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Cahaya Anbiya Travel</span>
                                    <span className="text-xs text-gray-400">© 2024 All Rights Reserved</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
