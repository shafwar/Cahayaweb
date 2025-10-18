import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, LogIn, Menu, MessageCircle, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// B2B Navigation Items
const b2bNavigationItems = [
    {
        name: 'Agency',
        href: '/b2b',
        icon: Building2,
        hasDropdown: false,
    },
    {
        name: 'Packages',
        href: '#',
        icon: Briefcase,
        hasDropdown: true,
    },
    {
        name: 'WhatsApp',
        href: 'https://wa.me/6281234567890',
        icon: MessageCircle,
        hasDropdown: false,
        target: '_blank',
    },
];

export default function B2BHeader() {
    const page = usePage();

    // ADVANCED STATE MANAGEMENT - Inspired by Kristalin
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);

    // B2B-STYLE MOBILE STATE MANAGEMENT
    const [mobilePackagesDropdownOpen, setMobilePackagesDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const [lastScrollY, setLastScrollY] = useState(0);

    // B2B/B2C SWITCH STATE MANAGEMENT
    const [currentMode, setCurrentMode] = useState<'b2c' | 'b2b'>('b2b');

    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // CIDATA-STYLE TRUE SCROLL FOLLOWING - Header moves with scroll
    useEffect(() => {
        const handleScroll = () => {
            // Header follows scroll naturally - not sticky
            setIsScrolled(window.scrollY > 100);
        };

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // OPTIMIZED scroll detection - SMOOTH & PERFORMANT
    useEffect(() => {
        let ticking = false;
        let scrollTimeout: NodeJS.Timeout;

        const updateScrollState = () => {
            const currentScrollY = window.scrollY;

            // Simplified scroll detection with higher threshold to prevent micro-movements
            if (Math.abs(currentScrollY - lastScrollY) > 10) {
                const direction = currentScrollY > lastScrollY ? 'down' : 'up';

                setIsScrolled(currentScrollY > 20);

                if (direction !== scrollDirection) {
                    setScrollDirection(direction);
                    setIsScrolling(true);

                    // Auto-hide mobile menu when scrolling down
                    if (direction === 'down' && currentScrollY > 100 && isMobileMenuOpen) {
                        setIsMobileMenuOpen(false);
                    }
                }

                setLastScrollY(currentScrollY);

                // Debounce scrolling state
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    setIsScrolling(false);
                }, 100);
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
    }, [scrollDirection, lastScrollY, isMobileMenuOpen]);

    // ENHANCED SCROLL LOCK
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

    // AUTO-CLOSE ON RESIZE
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
                setMobilePackagesDropdownOpen(false);
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
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
            {/* STICKY B2B HEADER - Stays on top when scrolling */}
            <header
                className="fixed left-0 right-0 top-0 z-50 w-full border-b border-yellow-400/15 bg-black/98 shadow-lg backdrop-blur-xl transition-all duration-300"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    zIndex: 50,
                    backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.98)' : 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'saturate(180%) blur(12px)',
                    WebkitBackdropFilter: 'saturate(180%) blur(12px)',
                    boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(0, 0, 0, 0.3)',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
                    transform: isScrolled ? 'translateY(0)' : 'translateY(0)',
                }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between sm:h-20">
                        {/* NATURAL Logo - B2B Version */}
                        <div className="flex items-center">
                            <Link href={route('b2b.index')} className="group relative inline-block">
                                <div className="flex items-center justify-center">
                                    <img src="/cahayanbiyalogo.png" alt="Cahaya Anbiya B2B Logo" className="h-10 w-auto object-contain sm:h-12" />
                                    <span className="ml-2 text-sm font-semibold text-white">/ B2B</span>
                                </div>
                                <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-yellow-500 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        </div>

                        {/* OPTIMIZED Desktop Navigation - B2B Content */}
                        <nav className="hidden items-center space-x-1 lg:flex">
                            {b2bNavigationItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    {item.target ? (
                                        <a
                                            href={item.href}
                                            target={item.target}
                                            rel="noopener noreferrer"
                                            className="group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:text-yellow-400"
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:text-yellow-400"
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                        </Link>
                                    )}

                                    {/* Dropdown for Packages */}
                                    {item.hasDropdown && activeDropdown === item.name && (
                                        <div className="absolute top-full left-0 z-50 mt-2 w-48 rounded-lg bg-black/90 py-2 shadow-xl backdrop-blur-sm transition-all duration-300">
                                            <Link
                                                href="#umrah-packages"
                                                className="block px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                            >
                                                Umrah Packages
                                            </Link>
                                            <Link
                                                href="#hajj-packages"
                                                className="block px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                            >
                                                Hajj Packages
                                            </Link>
                                            <Link
                                                href="#corporate-packages"
                                                className="block px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                            >
                                                Corporate Packages
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Separator */}
                            <div className="mx-3 h-6 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

                            {/* Enhanced Action Buttons - B2B Version */}
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
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/10 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                </Link>
                            </div>
                        </nav>

                        {/* ENHANCED Mobile Menu Button - Clean & Responsive */}
                        <button
                            onClick={() => {
                                console.log('Mobile menu button clicked!', isMobileMenuOpen);
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                            }}
                            className={`mobile-menu-button rounded-xl p-3 transition-all duration-300 lg:hidden ${'bg-white/10 text-white hover:bg-white/20'}`}
                            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
                        >
                            <div className={`transition-all duration-300 ${isMobileMenuOpen ? 'rotate-90 scale-110' : 'rotate-0 scale-100'}`}>
                                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* ENHANCED MOBILE SIDEBAR - B2B Content */}
            <AnimatePresence mode="wait">
                {isMobileMenuOpen && (
                    <div className="mobile-menu-container fixed inset-0 z-[9999] lg:hidden" ref={mobileMenuRef}>
                        {/* CONSISTENT BACKDROP - Same as header desktop */}
                        <div
                            className="mobile-menu-backdrop absolute inset-0 backdrop-blur-sm transition-opacity duration-300"
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

                        {/* ENHANCED DRAWER CONTAINER - Better spacing and complete layout */}
                        <div className="mobile-drawer absolute top-0 right-0 bottom-0 z-[10000] flex w-80 flex-col shadow-2xl transition-transform duration-300 ease-out sm:w-96"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.98)',
                                backdropFilter: 'saturate(180%) blur(12px)',
                                WebkitBackdropFilter: 'saturate(180%) blur(12px)',
                                borderLeft: '1px solid rgba(212, 175, 55, 0.15)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                                overscrollBehavior: 'contain',
                                WebkitOverflowScrolling: 'touch',
                            }}
                        >
                            {/* ENHANCED MENU HEADER - Better spacing */}
                            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                                <div className="flex items-center">
                                    <img src="/cahayanbiyalogo.png" alt="Cahaya Anbiya B2B Logo" className="h-10 object-contain" />
                                    <span className="ml-2 text-sm font-semibold text-white">/ B2B</span>
                                </div>
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

                            {/* ENHANCED B2B/B2C SWITCH BUTTON - Better spacing */}
                            <div className="flex items-center justify-center px-5 pb-4">
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

                            {/* Visual Separator */}
                            <div className="mx-5 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>

                            {/* ENHANCED SEARCH BAR - Better spacing */}
                            <div className="px-5 pb-5">
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
                                            placeholder="Search B2B packages..."
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

                            {/* Visual Separator */}
                            <div className="mx-5 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>

                            {/* ENHANCED NAVIGATION - Better spacing and layout */}
                            <nav className="flex-1 overflow-y-auto px-5 pb-4">
                                <div className="space-y-2">
                                    {b2bNavigationItems.map((item, index) => (
                                        <div key={index} className="mb-3">
                                            {item.hasDropdown ? (
                                                <div>
                                                    <button
                                                        className="group flex w-full items-center justify-between rounded-lg px-4 py-4 text-left transition-all duration-300 hover:bg-yellow-500/10"
                                                        onClick={() => {
                                                            setMobilePackagesDropdownOpen(!mobilePackagesDropdownOpen);
                                                        }}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="mr-3 h-2 w-2 rounded-full bg-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                            <item.icon className="mr-2 h-4 w-4" />
                                                            <span className="font-medium text-white">{item.name}</span>
                                                        </div>
                                                        <svg
                                                            className={`h-5 w-5 transition-transform duration-300 ${
                                                                mobilePackagesDropdownOpen ? 'rotate-180' : ''
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
                                                            mobilePackagesDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                        }`}
                                                    >
                                                        <Link
                                                            href="#umrah-packages"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block rounded-lg px-4 py-3 text-sm text-gray-300 transition-colors duration-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                                                        >
                                                            Umrah Packages
                                                        </Link>
                                                        <Link
                                                            href="#hajj-packages"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block rounded-lg px-4 py-3 text-sm text-gray-300 transition-colors duration-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                                                        >
                                                            Hajj Packages
                                                        </Link>
                                                        <Link
                                                            href="#corporate-packages"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block rounded-lg px-4 py-3 text-sm text-gray-300 transition-colors duration-300 hover:bg-yellow-500/10 hover:text-yellow-400"
                                                        >
                                                            Corporate Packages
                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : item.target ? (
                                                <a
                                                    href={item.href}
                                                    target={item.target}
                                                    rel="noopener noreferrer"
                                                    className="group flex w-full items-center rounded-lg px-4 py-4 transition-all duration-300 hover:bg-yellow-500/10"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                    <item.icon className="mr-2 h-4 w-4" />
                                                    <span className="font-medium text-white">{item.name}</span>
                                                </a>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="group flex w-full items-center rounded-lg px-4 py-4 transition-all duration-300 hover:bg-yellow-500/10"
                                                >
                                                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                    <item.icon className="mr-2 h-4 w-4" />
                                                    <span className="font-medium text-white">{item.name}</span>
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </nav>

                            {/* Visual Separator */}
                            <div className="mx-5 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>

                            {/* ENHANCED LOGIN FEATURE - Better spacing */}
                            <div className="px-5 pb-5">
                                <Link
                                    href={route('login')}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-4 text-sm font-semibold text-white transition-all duration-300 hover:from-yellow-400 hover:to-yellow-500"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Login
                                </Link>
                            </div>

                            {/* ENHANCED FOOTER - Complete layout without gap */}
                            <div className="mt-auto border-t border-yellow-500/20 p-5">
                                <div className="space-y-3">
                                    {/* Additional B2B Features */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-yellow-500/10 p-3 text-center">
                                            <div className="text-xs font-semibold text-yellow-400">15+ Years</div>
                                            <div className="text-xs text-gray-300">Experience</div>
                                        </div>
                                        <div className="rounded-lg bg-yellow-500/10 p-3 text-center">
                                            <div className="text-xs font-semibold text-yellow-400">98%</div>
                                            <div className="text-xs text-gray-300">Satisfaction</div>
                                        </div>
                                    </div>

                                    {/* Copyright */}
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-xs text-gray-400">Cahaya Anbiya B2B</span>
                                        <span className="text-xs text-gray-400">© 2024 All Rights Reserved</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

