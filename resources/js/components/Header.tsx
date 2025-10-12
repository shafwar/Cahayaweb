import { Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface HeaderProps {
    sticky?: boolean;
    transparent?: boolean;
}

export default function Header({ sticky = false, transparent = false }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const aboutDropdownRef = useRef<HTMLDivElement>(null);

    // Handle scroll effect for transparent/sticky behavior
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
        };

        if (transparent || sticky) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [transparent, sticky]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
            if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
                setAboutDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                const hamburgerButton = (event.target as Element).closest('[aria-label*="menu"]');
                if (!hamburgerButton) {
                    setMobileMenuOpen(false);
                }
            }
        }
        if (dropdownOpen || aboutDropdownOpen || mobileMenuOpen || searchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen, aboutDropdownOpen, mobileMenuOpen, searchOpen]);

    // Close search on Escape and handle Enter
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSearchOpen(false);
            if (e.key === 'Enter' && searchOpen) {
                e.preventDefault();
                if (searchQuery.trim() !== '') {
                    router.get('/search', { q: searchQuery.trim() }, { preserveScroll: true });
                    setSearchOpen(false);
                }
            }
        };
        if (searchOpen) {
            window.addEventListener('keydown', onKey);
        }
        return () => window.removeEventListener('keydown', onKey);
    }, [searchOpen, searchQuery]);

    // Close mobile menu when window resizes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
                // Ensure any page-level scroll lock is removed when switching to desktop
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
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
        } else {
            document.body.classList.remove('mobile-menu-open');
        }
    }, [mobileMenuOpen]);

    // Calculate opacity based on scroll position for smooth transition
    const getBackgroundOpacity = () => {
        if (!transparent) return 1;
        if (mobileMenuOpen) return 1;
        const maxScroll = 100;
        const opacity = Math.min(scrollY / maxScroll, 1);
        return opacity;
    };

    const backgroundOpacity = getBackgroundOpacity();
    const shadowOpacity = Math.min(scrollY / 50, 1);
    const blurIntensity = Math.min(scrollY / 80, 1);
    const textOpacity = transparent && !mobileMenuOpen ? Math.max(0.8, 1 - backgroundOpacity * 0.2) : 1;

    // Determine header classes and styles
    const getHeaderClasses = () => {
        const baseClasses = 'flex items-center h-16 sm:h-18 lg:h-20 w-full px-3 sm:px-4 md:px-6 lg:px-8 z-50';

        if (sticky && transparent) {
            return `${baseClasses} fixed top-0 left-0 right-0 transition-all duration-300 ease-out`;
        } else if (sticky) {
            return `${baseClasses} fixed top-0 left-0 right-0 bg-gradient-to-b from-primary via-primary to-black shadow-lg backdrop-blur-md transition-all duration-500 ease-out`;
        } else {
            return `${baseClasses} bg-gradient-to-b from-primary via-primary to-black shadow-lg backdrop-blur-md relative`;
        }
    };

    const getHeaderStyle = () => {
        if (!transparent || mobileMenuOpen) {
            return {
                background: 'linear-gradient(to bottom, rgb(88, 28, 135), rgb(107, 33, 168), rgb(126, 34, 206))',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            };
        }

        return {
            background: `linear-gradient(to bottom,
        rgba(88, 28, 135, ${backgroundOpacity * 0.95}),
        rgba(107, 33, 168, ${backgroundOpacity * 0.95}),
        rgba(126, 34, 206, ${backgroundOpacity * 0.95}))`,
            boxShadow: shadowOpacity > 0 ? `0 10px 25px rgba(0, 0, 0, ${shadowOpacity * 0.15})` : 'none',
            backdropFilter: blurIntensity > 0 ? `blur(${blurIntensity * 12}px)` : 'none',
            WebkitBackdropFilter: blurIntensity > 0 ? `blur(${blurIntensity * 12}px)` : 'none',
        };
    };

    // Logo logic
    const getLogoSrc = () => {
        return '/cahayanbiyalogo.png';
    };

    const getLogoFilter = () => {
        if (!transparent || mobileMenuOpen) return 'none';
        return scrollY < 50 ? 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.3))' : 'none';
    };

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

    const handleLogoClick = (e: React.MouseEvent) => {
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
    };

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
        <header className={getHeaderClasses()} style={getHeaderStyle()}>
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
                        style={{ filter: getLogoFilter() }}
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
                                        setAboutDropdownOpen(true);
                                    }}
                                    onMouseLeave={() => {
                                        setAboutDropdownOpen(false);
                                    }}
                                >
                                    <a
                                        href={item.href}
                                        className="flex items-center gap-1 px-2 py-2 transition-all duration-300 ease-out hover:scale-105 hover:text-secondary lg:px-3"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {item.label}
                                        <svg
                                            className={`h-3 w-3 transform transition-transform duration-300 ease-out ${aboutDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="currentColor"
                                            viewBox="0 0 12 12"
                                        >
                                            <path d="M6 8L2 4h8l-4 4z" />
                                        </svg>
                                    </a>
                                    {/* Desktop Dropdown Menu */}
                                    <div
                                        className={`absolute top-full left-0 z-50 mt-1 w-64 transform rounded-lg border border-secondary/30 bg-white/95 text-primary shadow-2xl backdrop-blur-sm transition-all duration-300 ease-out xl:w-72 ${
                                            aboutDropdownOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                                        }`}
                                        onMouseEnter={() => setAboutDropdownOpen(true)}
                                        onMouseLeave={() => setAboutDropdownOpen(false)}
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
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    style={{ opacity: textOpacity }}
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen ? (
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
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        aria-haspopup="listbox"
                        aria-expanded={dropdownOpen}
                    >
                        {getCurrentLanguageCode()}
                        <svg
                            width="12"
                            height="12"
                            fill="none"
                            className={`ml-1 transform transition-transform duration-300 ease-out ${dropdownOpen ? 'rotate-180' : ''}`}
                        >
                            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    {dropdownOpen && (
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
                            searchOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
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
                        mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Drawer */}
                <div
                    ref={mobileMenuRef}
                    className={`fixed top-16 right-0 bottom-0 z-50 w-80 overflow-y-auto bg-gradient-to-b from-primary via-primary to-black shadow-2xl transition-transform duration-300 ease-out sm:top-18 sm:w-96 lg:top-20 lg:hidden ${
                        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
