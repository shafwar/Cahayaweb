import { Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface HeaderProps {
    sticky?: boolean;
    transparent?: boolean;
}

// Optimized scroll state management
interface ScrollState {
    scrollY: number;
    isScrolling: boolean;
    direction: 'up' | 'down';
    velocity: number;
}

// Enhanced header state interface
interface HeaderState {
    headerState.mobileMenuOpen: boolean;
    headerState.searchOpen: boolean;
    searchQuery: string;
    isSearching: boolean;
    headerState.dropdownOpen: boolean;
    headerState.aboutDropdownOpen: boolean;
    isVisible: boolean;
    lastScrollY: number;
}

export default function Header({ sticky = false, transparent = false }: HeaderProps) {
    // Optimized state management
    const [headerState, setHeaderState] = useState<HeaderState>({
        headerState.mobileMenuOpen: false,
        headerState.searchOpen: false,
        searchQuery: '',
        isSearching: false,
        headerState.dropdownOpen: false,
        headerState.aboutDropdownOpen: false,
        isVisible: true,
        lastScrollY: 0,
    });

    const [scrollState, setScrollState] = useState<ScrollState>({
        scrollY: 0,
        isScrolling: false,
        direction: 'down',
        velocity: 0,
    });

    // Refs for DOM manipulation
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const aboutDropdownRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();
    const animationFrameRef = useRef<number>();

    // Optimized scroll handler with throttling and direction detection
    const handleScroll = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const deltaY = currentScrollY - scrollState.scrollY;
            const velocity = Math.abs(deltaY);
            const direction = deltaY > 0 ? 'down' : 'up';

            setScrollState(prev => ({
                scrollY: currentScrollY,
                isScrolling: true,
                direction,
                velocity,
            }));

            // Auto-hide header on scroll down, show on scroll up (only for sticky mode)
            if (sticky && currentScrollY > 100) {
                setHeaderState(prev => ({
                    ...prev,
                    isVisible: direction === 'up' || currentScrollY < prev.lastScrollY,
                    lastScrollY: currentScrollY,
                }));
            }

            // Clear scroll timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Set scrolling to false after scroll ends
            scrollTimeoutRef.current = setTimeout(() => {
                setScrollState(prev => ({ ...prev, isScrolling: false }));
            }, 150);
        });
    }, [scrollState.scrollY, sticky]);

    // Enhanced scroll effect with proper cleanup
    useEffect(() => {
        if (transparent || sticky) {
            window.addEventListener('scroll', handleScroll, { passive: true });

            return () => {
                window.removeEventListener('scroll', handleScroll);
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            };
        }
    }, [handleScroll, transparent, sticky]);

    // Optimized outside click handler
    const handleClickOutside = useCallback((event: MouseEvent) => {
        const target = event.target as Node;

        // Check dropdown refs
        if (dropdownRef.current && !dropdownRef.current.contains(target)) {
            setHeaderState(prev => ({ ...prev, headerState.dropdownOpen: false }));
        }
        if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(target)) {
            setHeaderState(prev => ({ ...prev, headerState.aboutDropdownOpen: false }));
        }
        if (searchRef.current && !searchRef.current.contains(target)) {
            setHeaderState(prev => ({ ...prev, headerState.searchOpen: false }));
        }
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
            const hamburgerButton = (target as Element).closest('[aria-label*="menu"]');
            if (!hamburgerButton) {
                setHeaderState(prev => ({ ...prev, headerState.mobileMenuOpen: false }));
            }
        }
    }, []);

    // Enhanced outside click effect
    useEffect(() => {
        const hasOpenElements = headerState.headerState.dropdownOpen ||
                               headerState.headerState.aboutDropdownOpen ||
                               headerState.headerState.mobileMenuOpen ||
                               headerState.headerState.searchOpen;

        if (hasOpenElements) {
            document.addEventListener('mousedown', handleClickOutside, { passive: true });
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [headerState.headerState.dropdownOpen, headerState.headerState.aboutDropdownOpen, headerState.headerState.mobileMenuOpen, headerState.headerState.searchOpen, handleClickOutside]);

    // Optimized keyboard handler
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setHeaderState(prev => ({
                ...prev,
                headerState.searchOpen: false,
                headerState.dropdownOpen: false,
                headerState.aboutDropdownOpen: false,
                headerState.mobileMenuOpen: false
            }));
        }
        if (e.key === 'Enter' && headerState.headerState.searchOpen) {
            e.preventDefault();
            if (headerState.searchQuery.trim() !== '') {
                router.get('/search', { q: headerState.searchQuery.trim() }, { preserveScroll: true });
                setHeaderState(prev => ({ ...prev, headerState.searchOpen: false }));
            }
        }
    }, [headerState.headerState.searchOpen, headerState.searchQuery]);

    // Enhanced keyboard effect
    useEffect(() => {
        if (headerState.headerState.searchOpen || headerState.headerState.dropdownOpen || headerState.headerState.aboutDropdownOpen || headerState.headerState.mobileMenuOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [headerState.headerState.searchOpen, headerState.headerState.dropdownOpen, headerState.headerState.aboutDropdownOpen, headerState.headerState.mobileMenuOpen, handleKeyDown]);

    // Optimized resize handler
    const handleResize = useCallback(() => {
        if (window.innerWidth >= 1024) {
            setHeaderState(prev => ({ ...prev, headerState.mobileMenuOpen: false }));
            // Clean up any scroll lock
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.body.classList.remove('mobile-menu-open');
        }
    }, []);

    // Enhanced resize effect
    useEffect(() => {
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    // Optimized body scroll lock with proper cleanup
    useEffect(() => {
        if (headerState.headerState.mobileMenuOpen) {
            const scrollY = window.scrollY;
            const originalOverflow = document.body.style.overflow;
            const originalPosition = document.body.style.position;

            // Apply scroll lock
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.classList.add('mobile-menu-open');

            return () => {
                // Restore original styles
                document.body.style.position = originalPosition;
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = originalOverflow;
                document.body.classList.remove('mobile-menu-open');
                window.scrollTo(0, scrollY);
            };
        } else {
            document.body.classList.remove('mobile-menu-open');
        }
    }, [headerState.headerState.mobileMenuOpen]);

    // Memoized calculations for better performance
    const { backgroundOpacity, shadowOpacity, blurIntensity, textOpacity } = useMemo(() => {
        const bgOpacity = !transparent ? 1 :
                         headerState.headerState.mobileMenuOpen ? 1 :
                         Math.min(scrollState.scrollY / 100, 1);

        const shOpacity = Math.min(scrollState.scrollY / 50, 1);
        const blurInt = Math.min(scrollState.scrollY / 80, 1);
        const txtOpacity = transparent && !headerState.headerState.mobileMenuOpen ?
                          Math.max(0.8, 1 - bgOpacity * 0.2) : 1;

        return {
            backgroundOpacity: bgOpacity,
            shadowOpacity: shOpacity,
            blurIntensity: blurInt,
            textOpacity: txtOpacity,
        };
    }, [transparent, headerState.headerState.mobileMenuOpen, scrollState.scrollY]);

    // Memoized header classes with optimized z-index and visibility
    const headerClasses = useMemo(() => {
        const baseClasses = 'flex items-center h-16 sm:h-18 lg:h-20 w-full px-3 sm:px-4 md:px-6 lg:px-8';

        // Enhanced z-index to avoid conflicts with other components
        const zIndex = 'z-[60]';

        // Visibility classes for auto-hide behavior
        const visibilityClasses = sticky && !headerState.isVisible ?
            'transform -translate-y-full' :
            'transform translate-y-0';

        // Transition classes
        const transitionClasses = 'transition-all duration-300 ease-out';

        if (sticky && transparent) {
            return `${baseClasses} ${zIndex} fixed top-0 left-0 right-0 ${visibilityClasses} ${transitionClasses}`;
        } else if (sticky) {
            return `${baseClasses} ${zIndex} fixed top-0 left-0 right-0 bg-gradient-to-b from-primary via-primary to-black shadow-lg backdrop-blur-md ${visibilityClasses} ${transitionClasses}`;
        } else {
            return `${baseClasses} ${zIndex} bg-gradient-to-b from-primary via-primary to-black shadow-lg backdrop-blur-md relative`;
        }
    }, [sticky, transparent, headerState.isVisible]);

    // Memoized header styles for better performance
    const headerStyles = useMemo(() => {
        if (!transparent || headerState.headerState.mobileMenuOpen) {
            return {
                background: 'linear-gradient(to bottom, rgb(0, 0, 0), rgb(0, 0, 0), rgb(0, 0, 0))',
                boxShadow: '0 10px 25px rgba(212, 175, 55, 0.15)',
            };
        }

        return {
            background: `linear-gradient(to bottom,
        rgba(0, 0, 0, ${backgroundOpacity * 0.95}),
        rgba(0, 0, 0, ${backgroundOpacity * 0.95}),
        rgba(0, 0, 0, ${backgroundOpacity * 0.95}))`,
            boxShadow: shadowOpacity > 0 ? `0 10px 25px rgba(212, 175, 55, ${shadowOpacity * 0.15})` : 'none',
            backdropFilter: blurIntensity > 0 ? `blur(${blurIntensity * 12}px)` : 'none',
            WebkitBackdropFilter: blurIntensity > 0 ? `blur(${blurIntensity * 12}px)` : 'none',
        };
    }, [transparent, headerState.headerState.mobileMenuOpen, backgroundOpacity, shadowOpacity, blurIntensity]);

    // Logo logic
    const getLogoSrc = () => {
        return '/cahayanbiyalogo.png';
    };

    // Memoized logo filter
    const logoFilter = useMemo(() => {
        if (!transparent || headerState.headerState.mobileMenuOpen) return 'none';
        return scrollState.scrollY < 50 ? 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.3))' : 'none';
    }, [transparent, headerState.headerState.mobileMenuOpen, scrollState.scrollY]);

    // Check if current page is B2B or B2C to determine logo link
    const getLogoLink = () => {
        const currentPath = window.location.pathname;

        // Check if we're in B2B or B2C pages
        if (
            currentPath.startsWith('/b2b') ||
            currentPath.startsWith('/home') ||
            currentPath.startsWith('/about') ||
            currentPath.startsWith('/destinations') ||
            currentPath.startsWith('/packages') ||
            currentPath.startsWith('/highlights') ||
            currentPath.startsWith('/blog') ||
            currentPath.startsWith('/contact')
        ) {
            return '/'; // Return to select mode
        }

        return '/'; // Default to home
    };

    // Optimized handler functions
    const handleLogoClick = useCallback((e: React.MouseEvent) => {
        const currentPath = window.location.pathname;

        // If we're in B2B or B2C pages, navigate to select mode
        if (
            currentPath.startsWith('/b2b') ||
            currentPath.startsWith('/home') ||
            currentPath.startsWith('/about') ||
            currentPath.startsWith('/destinations') ||
            currentPath.startsWith('/packages') ||
            currentPath.startsWith('/highlights') ||
            currentPath.startsWith('/blog') ||
            currentPath.startsWith('/contact')
        ) {
            e.preventDefault();
            router.visit('/');
        }
    }, []);

    const handleSearch = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (headerState.searchQuery.trim() === '') return;

        setHeaderState(prev => ({ ...prev, isSearching: true }));
        try {
            await router.get('/search', { q: headerState.searchQuery.trim() }, { preserveScroll: true });
        } finally {
            setHeaderState(prev => ({ ...prev, isSearching: false, headerState.searchOpen: false }));
        }
    }, [headerState.searchQuery]);

    const toggleMobileMenu = useCallback(() => {
        setHeaderState(prev => ({ ...prev, headerState.mobileMenuOpen: !prev.headerState.mobileMenuOpen }));
    }, []);

    const toggleSearch = useCallback(() => {
        setHeaderState(prev => ({ ...prev, headerState.searchOpen: !prev.headerState.searchOpen }));
    }, []);

    const toggleDropdown = useCallback(() => {
        setHeaderState(prev => ({ ...prev, headerState.dropdownOpen: !prev.headerState.dropdownOpen }));
    }, []);

    const toggleAboutDropdown = useCallback(() => {
        setHeaderState(prev => ({ ...prev, headerState.aboutDropdownOpen: !prev.headerState.aboutDropdownOpen }));
    }, []);

    // Navigation items for Cahayaweb with dropdown support
    const navigationItems = [
        { label: 'Home', href: '/' },
        {
            label: 'About Us',
            href: '#',
            hasDropdown: true,
            dropdownItems: [
                { label: 'About Cahaya Anbiya', href: '/about' },
                { label: 'Vision & Mission', href: '/vision-mission' },
                { label: 'Company Overview', href: '/company-overview' },
                { label: 'Our Team', href: '/team' },
                { label: 'News & Updates', href: '/news' },
            ],
        },
        { label: 'Destinations', href: '/destinations' },
        { label: 'Packages', href: '/packages' },
        { label: 'Highlights', href: '/highlights' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
    ];

    // Language switcher function (placeholder - you can implement your own)
    const switchLanguage = (lang: string) => {
        console.log(`Switching to ${lang}`);
        // Implement your language switching logic here
    };

    const getCurrentLanguageCode = () => {
        return 'EN'; // Default language code
    };

    return (
        <header ref={headerRef} className={headerClasses} style={headerStyles}>
            {/* Logo Section */}
            <div className="flex items-center pr-2 pl-2 sm:pr-4 sm:pl-3 lg:pr-6 lg:pl-4">
                <a
                    href={getLogoLink()}
                    className="flex items-center transition-all duration-300 hover:scale-105"
                    aria-label="Cahaya Anbiya Wisata Logo"
                    onClick={handleLogoClick}
                >
                    <img
                        src={getLogoSrc()}
                        alt="Cahaya Anbiya Wisata Logo"
                        className="h-12 w-auto object-contain transition-all duration-700 ease-out sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22"
                        style={{ filter: logoFilter }}
                    />
                </a>
            </div>

            {/* Desktop Navigation Menu */}
            <nav className="hidden flex-1 justify-center lg:flex lg:px-2 xl:px-4">
                <ul
                    className="flex items-center gap-1 text-xs font-semibold tracking-wide text-white uppercase transition-all duration-300 ease-out lg:gap-2 lg:text-xs xl:gap-3 xl:text-sm 2xl:gap-4"
                    style={{ opacity: textOpacity }}
                >
                    {navigationItems.map((item, index) => (
                        <li key={index} className={item.hasDropdown ? 'group relative' : ''}>
                            {item.hasDropdown ? (
                                <div
                                    className="relative"
                                    ref={aboutDropdownRef}
                                    onMouseEnter={() => {
                                        setHeaderState(prev => ({ ...prev, headerState.aboutDropdownOpen: true }));
                                    }}
                                    onMouseLeave={() => {
                                        setHeaderState(prev => ({ ...prev, headerState.aboutDropdownOpen: false }));
                                    }}
                                >
                                    <a
                                        href={item.href}
                                        className="flex items-center gap-1 px-2 py-2 transition-all duration-300 ease-out hover:scale-105 hover:text-secondary lg:px-3"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {item.label}
                                        <svg
                                            className={`h-3 w-3 transform transition-transform duration-300 ease-out ${headerState.aboutDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="currentColor"
                                            viewBox="0 0 12 12"
                                        >
                                            <path d="M6 8L2 4h8l-4 4z" />
                                        </svg>
                                    </a>
                                    {/* Desktop Dropdown Menu */}
                                    <div
                                        className={`absolute top-full left-0 z-[70] mt-1 w-64 transform rounded-lg border border-secondary/30 bg-white/95 text-primary shadow-2xl backdrop-blur-sm transition-all duration-300 ease-out xl:w-72 ${
                                            headerState.headerState.aboutDropdownOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                                        }`}
                                        onMouseEnter={() => setHeaderState(prev => ({ ...prev, headerState.aboutDropdownOpen: true }))}
                                        onMouseLeave={() => setHeaderState(prev => ({ ...prev, headerState.aboutDropdownOpen: false }))}
                                    >
                                        <div className="px-4 py-4">
                                            <div className="space-y-1">
                                                {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                                                    <a
                                                        key={dropdownIndex}
                                                        href={dropdownItem.href}
                                                        className="hover:bg-opacity-10 block rounded px-3 py-2.5 text-xs transition-all duration-300 ease-out hover:translate-x-1 hover:scale-105 hover:bg-secondary/10 hover:text-secondary"
                                                    >
                                                        {dropdownItem.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="px-2 py-2 transition-all duration-300 ease-out hover:scale-105 hover:text-secondary lg:px-3"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Navigation Toggle */}
            <div className="flex flex-1 items-center justify-end gap-2 lg:hidden">
                <button
                    className="p-2 text-white transition-all duration-300 ease-out hover:text-secondary"
                    onClick={() => setMobileMenuOpen(!headerState.mobileMenuOpen)}
                    aria-label={headerState.mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    style={{ opacity: textOpacity }}
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {headerState.mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Right Side Features - Desktop Only */}
            <div
                className="hidden h-full items-center gap-1 text-xs font-semibold tracking-wide text-white uppercase transition-all duration-300 ease-out lg:flex xl:gap-2 xl:text-sm"
                style={{ opacity: textOpacity }}
            >
                {/* Language Switcher */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex h-10 min-w-[44px] items-center justify-center px-2 py-1 text-xs font-semibold tracking-wide text-white uppercase transition-all duration-300 ease-out hover:text-secondary focus:outline-none xl:text-sm"
                        onClick={() => setDropdownOpen(!headerState.dropdownOpen)}
                        aria-haspopup="listbox"
                        aria-expanded={headerState.dropdownOpen}
                    >
                        {getCurrentLanguageCode()}
                        <svg
                            width="12"
                            height="12"
                            fill="none"
                            className={`ml-1 transform transition-transform duration-300 ease-out ${headerState.dropdownOpen ? 'rotate-180' : ''}`}
                        >
                            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    {headerState.dropdownOpen && (
                        <div
                            className="animate-fadeIn absolute right-0 z-50 mt-2 w-24 transform rounded border border-gray-200 bg-white shadow-lg transition-all duration-300 ease-out"
                            role="listbox"
                        >
                            <button
                                className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-800 uppercase transition-all duration-300 ease-out hover:scale-105 hover:bg-secondary/10"
                                onClick={() => {
                                    switchLanguage('id');
                                    setDropdownOpen(false);
                                }}
                                role="option"
                            >
                                ID
                            </button>
                            <button
                                className="block w-full px-4 py-2 text-left text-sm font-semibold text-secondary uppercase transition-all duration-300 ease-out hover:scale-105 hover:bg-secondary/10"
                                onClick={() => {
                                    switchLanguage('en');
                                    setDropdownOpen(false);
                                }}
                                role="option"
                            >
                                EN
                            </button>
                            <button
                                className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-800 uppercase transition-all duration-300 ease-out hover:scale-105 hover:bg-secondary/10"
                                onClick={() => {
                                    switchLanguage('zh');
                                    setDropdownOpen(false);
                                }}
                                role="option"
                            >
                                ZH
                            </button>
                        </div>
                    )}
                </div>

                {/* Search Icon + Dropdown */}
                <div className="relative" ref={searchRef}>
                    <button
                        type="button"
                        onClick={() => setSearchOpen((o) => !o)}
                        className="flex h-10 items-center justify-center px-2 py-1 text-xs font-semibold tracking-wide text-white uppercase transition-all duration-300 ease-out hover:scale-105 hover:text-secondary focus:outline-none xl:text-sm"
                        aria-label="Search"
                    >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>

                    {/* Dropdown search bar */}
                    <div
                        className={`absolute top-full right-0 mt-2 w-[320px] max-w-[80vw] transform transition-all duration-300 ${
                            headerState.searchOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                        }`}
                    >
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery.trim() !== '') {
                                    setIsSearching(true);
                                    router.get('/search', { q: searchQuery.trim() }, { preserveScroll: true });
                                    setTimeout(() => setIsSearching(false), 1000);
                                    setSearchOpen(false);
                                }
                            }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-secondary to-secondary/80 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30" />
                            <div className="relative flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-4 py-2 shadow-xl transition-all duration-300 focus-within:scale-[1.02] focus-within:border-yellow-400 hover:border-secondary/50">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className={`transition-all duration-300 ${
                                        isSearching ? 'animate-spin text-secondary' : 'text-gray-400 group-focus-within:text-secondary'
                                    }`}
                                >
                                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full border-none bg-white text-gray-800 outline-none placeholder:text-gray-400"
                                />
                                <button
                                    type="submit"
                                    className="relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-secondary to-secondary/90 px-5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-secondary/90 hover:to-secondary/80 hover:shadow-lg"
                                >
                                    <span className="absolute inset-0 -translate-x-full -skew-x-12 bg-white transition-transform duration-700 group-hover:translate-x-full" />
                                    <span className="relative">Search</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Right Drawer */}
            <>
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
                        headerState.mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Drawer */}
                <div
                    ref={mobileMenuRef}
                    className={`fixed top-16 right-0 bottom-0 z-50 w-80 overflow-y-auto bg-gradient-to-b from-primary via-primary to-black shadow-2xl transition-transform duration-300 ease-out sm:top-18 sm:w-96 lg:top-20 lg:hidden ${
                        headerState.mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    style={{
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {/* Drawer header logo */}
                    <div className="flex items-center justify-center px-4 pt-6 pb-2">
                        <a href={getLogoLink()} className="flex items-center transition-all duration-300 hover:scale-105" onClick={handleLogoClick}>
                            <img src="/cahayanbiyalogo.png" alt="Cahaya Anbiya Wisata Logo" className="h-14 object-contain" />
                        </a>
                    </div>

                    <div className="min-h-full space-y-4 px-4 py-4">
                        {/* Mobile Language Switcher */}
                        <div className="flex items-center justify-between border-b border-secondary/30 pb-4">
                            <span className="text-sm font-semibold text-white">Language:</span>
                            <div className="flex gap-2">
                                <button
                                    className="hover:bg-opacity-10 rounded px-3 py-1 text-sm font-semibold text-white transition-all duration-300 hover:bg-white"
                                    onClick={() => switchLanguage('id')}
                                >
                                    ID
                                </button>
                                <button
                                    className="rounded bg-secondary px-3 py-1 text-sm font-semibold text-white transition-all duration-300"
                                    onClick={() => switchLanguage('en')}
                                >
                                    EN
                                </button>
                                <button
                                    className="hover:bg-opacity-10 rounded px-3 py-1 text-sm font-semibold text-white transition-all duration-300 hover:bg-white"
                                    onClick={() => switchLanguage('zh')}
                                >
                                    ZH
                                </button>
                            </div>
                        </div>

                        {/* Mobile Search */}
                        <div className="pt-3">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (searchQuery.trim() !== '') {
                                        router.get('/search', { q: searchQuery.trim() }, { preserveScroll: true });
                                        setMobileMenuOpen(false);
                                    }
                                }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary to-secondary/80 opacity-15 blur-[6px] transition-opacity duration-300 group-hover:opacity-25" />
                                <div className="relative flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm transition-all duration-300 focus-within:border-yellow-400 hover:border-secondary/50">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                        <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="min-w-0 flex-1 border-none bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
                                    />
                                    <button
                                        type="submit"
                                        className="relative inline-flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-secondary to-secondary/90 px-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-secondary/90 hover:to-secondary/80 hover:shadow-lg min-[380px]:px-5"
                                    >
                                        <span className="absolute inset-0 -translate-x-full -skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-0 min-[380px]:mr-2">
                                            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                        <span className="hidden min-[380px]:inline">Search</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Mobile Navigation Items */}
                        {navigationItems.map((item, index) => (
                            <div key={index} className="border-b border-secondary/30 pb-4 last:border-b-0">
                                {item.hasDropdown ? (
                                    <div>
                                        <button className="w-full py-2 text-left text-base font-semibold text-white transition-all duration-300 hover:text-secondary">
                                            {item.label}
                                        </button>
                                        <div className="mt-2 space-y-2 pl-4">
                                            {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                                                <a
                                                    key={dropdownIndex}
                                                    href={dropdownItem.href}
                                                    className="block py-1 text-sm text-gray-300 transition-all duration-300 hover:text-secondary/80"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {dropdownItem.label}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="block py-2 text-base font-semibold text-white transition-all duration-300 hover:text-secondary"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </>
        </header>
    );
}
