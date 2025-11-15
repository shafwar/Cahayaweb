import { useEditMode } from '@/components/cms';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRightLeft,
    Briefcase,
    Building2,
    ChevronDown,
    History,
    Home,
    Info,
    LogIn,
    LogOut,
    MapPin,
    Menu,
    MessageCircle,
    Minus,
    Package,
    Phone,
    Plus,
    RotateCcw,
    Save,
    Search,
    Sparkles,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { B2C_NAVIGATION_ITEMS } from './header/constants';

// Global Header Component untuk Cahaya Anbiya
interface GlobalHeaderProps {
    variant?: 'b2c' | 'b2b';
    forceLightTheme?: boolean;
    className?: string;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ variant = 'b2c', forceLightTheme = false, className = '' }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // User & admin context
    const page = usePage();
    const user = (page.props as any)?.auth?.user;
    let isAdmin = false;
    try {
        // prefer context when provider exists
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const ctx = useEditMode();
        isAdmin = ctx.isAdmin;
    } catch {
        isAdmin = Boolean((user as any)?.is_admin);
    }
    const editCtx = (() => {
        try {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return useEditMode();
        } catch {
            return { editMode: false, setEditMode: () => {} } as any;
        }
    })();

    // Get navigation items - menggunakan constants
    const navigationItems = variant === 'b2c' ? B2C_NAVIGATION_ITEMS : [];

    const logout = () => {
        const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        router.post(
            '/logout',
            {},
            {
                headers: token ? { 'X-CSRF-TOKEN': token } : undefined,
                preserveScroll: false,
                onSuccess: () => router.visit('/'),
            },
        );
    };

    // Icon mapping
    const iconMap: { [key: string]: React.ComponentType<{ className?: string; size?: number }> } = {
        Home: Home,
        Info: Info,
        MapPin: MapPin,
        Box: Package,
        Sparkles: Sparkles,
        Phone: Phone,
    };

    // Search functionality
    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        } else {
            setSearchQuery('');
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
                setExpandedMobileItems([]);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Body Scroll Lock
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

    // Click Outside Handler untuk mobile menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                const hamburgerButton = (event.target as Element).closest('[aria-label*="menu"]');
                if (!hamburgerButton) {
                    setIsMobileMenuOpen(false);
                    setExpandedMobileItems([]);
                }
            }
        }
        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
                setExpandedMobileItems([]);
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isMobileMenuOpen]);

    const toggleMobileItem = (itemName: string) => {
        setExpandedMobileItems((prev) => (prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName]));
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setExpandedMobileItems([]);
    };

    // Handle mode switch (B2C <-> B2B)
    const handleModeSwitch = () => {
        const target = variant === 'b2b' ? '/home' : '/b2b';
        router.visit(target);
    };

    return (
        <>
            {/* Desktop Header - Black Background */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`sticky top-0 z-[9999] bg-black ${className}`}
                style={{
                    height: '80px',
                    willChange: 'transform, opacity',
                    pointerEvents: 'auto',
                }}
            >
                <div className="mx-auto h-full max-w-7xl px-3 sm:px-4 lg:px-6">
                    <div className="flex h-full items-center justify-between gap-2 lg:gap-3 xl:gap-4">
                        {/* Logo Section - Left */}
                        <Link
                            href={variant === 'b2c' ? '/home' : '/b2b'}
                            className="group flex flex-shrink-0 items-center"
                            aria-label="Cahaya Anbiya Home"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex items-center space-x-2.5 sm:space-x-3"
                            >
                                {/* Logo Image */}
                                <div className="relative flex-shrink-0">
                                    <img
                                        src="/cahayanbiyalogo.png"
                                        alt="Cahaya Anbiya Logo"
                                        className="h-8 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-9 lg:h-10"
                                    />
                                </div>

                                {/* Company Text - White */}
                                <div className="hidden sm:block">
                                    <div className="text-xs leading-tight font-bold text-white transition-all duration-700 sm:text-sm lg:text-base">
                                        CAHAYA ANBIYA
                                    </div>
                                    <div className="mt-0.5 text-[10px] leading-tight font-medium text-white/80 transition-all duration-700 sm:text-xs">
                                        WISATA INDONESIA
                                    </div>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation - Center */}
                        <motion.nav
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="hidden flex-1 items-center justify-center space-x-0.5 lg:flex lg:space-x-1 xl:space-x-1.5"
                        >
                            {variant === 'b2b' ? (
                                <>
                                    <Link
                                        href="/b2b"
                                        className="group relative flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
                                    >
                                        <Building2 className="h-5 w-5 text-white" />
                                        <span className="whitespace-nowrap">Agency</span>
                                    </Link>
                                    <button
                                        onClick={() => window.dispatchEvent(new Event('open-b2b-packages'))}
                                        className="group relative flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
                                    >
                                        <Briefcase className="h-5 w-5 text-white" />
                                        <span className="whitespace-nowrap">Packages</span>
                                    </button>
                                    <a
                                        href="https://wa.me/6281234567890"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group relative flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
                                    >
                                        <MessageCircle className="h-5 w-5 text-white" />
                                        <span className="whitespace-nowrap">WhatsApp</span>
                                    </a>
                                </>
                            ) : (
                                <>
                                    {navigationItems.map((item, index) => {
                                        const IconComponent = item.icon ? iconMap[item.icon] : null;

                                        return (
                                <motion.div
                                                key={item.label}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                                    className="relative"
                                >
                                                {/* Desktop Navigation - Always use Link (no dropdown) */}
                                    <Link
                                        href={item.href}
                                                    className="group relative flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white/10 hover:text-white lg:px-3 lg:text-sm"
                                                >
                                                    {IconComponent && <IconComponent className="h-3.5 w-3.5 flex-shrink-0 lg:h-4 lg:w-4" />}
                                                    <span className="whitespace-nowrap">{item.label}</span>
                                    </Link>
                                </motion.div>
                                        );
                                    })}
                                </>
                            )}
                        </motion.nav>

                        {/* Right Section - Buttons */}
                        <div 
                            className="relative z-[10000] flex flex-shrink-0 items-center space-x-2 lg:space-x-2.5"
                            style={{ pointerEvents: 'auto' }}
                        >
                            {/* Edit toggle for admins */}
                            {user && isAdmin && (
                                <>
                                {/* Restore Center Button - Comprehensive control */}
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.25 }}
                                    onClick={() => router.visit('/admin/restore-center')}
                                    className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-1.5 text-sm font-semibold text-white ring-1 ring-purple-300 transition-all hover:from-purple-600 hover:to-pink-600 hover:scale-105 md:flex"
                                    title="Restore Center - Control all website changes"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    <span className="hidden lg:inline">Restore</span>
                                </motion.button>

                                {/* Smart Edit/Save Button - Transforms based on state! */}
                                <AnimatePresence mode="wait">
                                    {editCtx.dirty ? (
                                        // SAVE MODE - When has unsaved changes
                                        <motion.button
                                            key="save-mode"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                
                                                // Confirmation dialog
                                                const confirmed = window.confirm(
                                                    '💾 Save All Changes?\n\n' +
                                                    'This will save all your modifications (text and images) to the database.\n\n' +
                                                    'Are you sure you want to save these changes?'
                                                );
                                                
                                                if (!confirmed) {
                                                    console.log('❌ Save cancelled by user');
                                                    return;
                                                }
                                                
                                                console.log('💾 Saving all changes...');
                                                
                                                // Dispatch global save event
                                                window.dispatchEvent(new CustomEvent('cms:flush-save'));
                                                
                                                // Clear dirty flag
                                                editCtx.clearDirty();
                                                
                                                // Reload to get fresh data
                                                router.reload({
                                                    only: ['sections'],
                                                    onSuccess: () => {
                                                        // Show success notification (mobile responsive)
                                                        const notification = document.createElement('div');
                                                        notification.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[99999] rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 text-white shadow-2xl max-w-[90vw] sm:left-auto sm:right-4 sm:translate-x-0 sm:px-6 sm:py-4 sm:max-w-md';
                                                        notification.innerHTML = `
                                                            <div class="flex items-center gap-2 sm:gap-3">
                                                                <svg class="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                                <div class="flex-1">
                                                                    <div class="text-sm font-bold sm:text-base">✅ Berhasil Disimpan!</div>
                                                                    <div class="text-xs opacity-90 sm:text-sm">Semua perubahan sudah tersimpan</div>
                                                                </div>
                                                            </div>
                                                        `;
                                                        document.body.appendChild(notification);
                                                        setTimeout(() => {
                                                            notification.remove();
                                                        }, 3000);
                                                    }
                                                });
                                            }}
                                            className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg ring-2 ring-amber-300 transition-all hover:from-amber-400 hover:to-orange-400 hover:scale-110 active:scale-95 md:flex animate-pulse"
                                            title="Save all changes - Has unsaved work!"
                                        >
                                            <Save className="h-4 w-4" />
                                            <span>Save</span>
                                        </motion.button>
                                    ) : editCtx.editMode ? (
                                        // EDITING MODE - No changes yet
                                        <motion.button
                                            key="editing-mode"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={() => editCtx.setEditMode(false)}
                                            className="hidden items-center gap-1.5 rounded-full bg-blue-500 text-white px-2.5 py-1.5 text-sm font-semibold ring-1 ring-blue-300 transition-all hover:bg-blue-600 hover:scale-105 md:flex"
                                            title="Exit editing mode (no changes to save)"
                                        >
                                            <Minus className="h-4 w-4" />
                                            <span className="hidden lg:inline">Editing</span>
                                        </motion.button>
                                    ) : (
                                        // NORMAL MODE - Not editing
                                        <motion.button
                                            key="edit-mode"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={() => editCtx.setEditMode(true)}
                                            className="hidden items-center gap-1.5 rounded-full bg-gray-900 text-white px-2.5 py-1.5 text-sm font-semibold ring-1 ring-white/10 transition-all hover:bg-gray-800 hover:scale-105 md:flex"
                                            title="Start editing content"
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span className="hidden lg:inline">Edit</span>
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                                </>
                            )}

                            {/* Switch Button */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.5 }}
                                onClick={handleModeSwitch}
                                className={`hidden rounded-full px-2.5 py-1.5 text-sm font-semibold md:flex ${
                                    variant === 'b2b'
                                        ? 'border border-amber-600/40 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10'
                                        : 'border border-gray-400 bg-[#2C2C2C] text-white hover:bg-[#3A3A3A]'
                                }`}
                            >
                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                    {variant === 'b2b' ? (
                                        <>
                                            <span className="hidden lg:inline">B2B</span>
                                            <ArrowRightLeft className="h-4 w-4" />
                                            <span className="hidden lg:inline">B2C</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="hidden lg:inline">B2C</span>
                                            <ArrowRightLeft className="h-4 w-4" />
                                            <span className="hidden lg:inline">B2B</span>
                                        </>
                                    )}
                                </span>
                            </motion.button>

                            {/* Login/Logout Button - ALWAYS VISIBLE */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                                onClick={() => {
                                    if (user) {
                                        logout();
                                    } else {
                                        const loginHref = variant === 'b2b' ? '/login?mode=b2b&redirect=/b2b' : '/login?mode=b2c&redirect=/home';
                                        router.visit(loginHref);
                                    }
                                }}
                                className={`hidden rounded-full px-2.5 py-1.5 text-sm font-semibold md:flex ${
                                    user
                                        ? 'border border-red-500/60 text-red-300 hover:bg-red-500/10'
                                        : variant === 'b2b'
                                          ? 'border border-orange-500/60 text-orange-300 hover:bg-orange-500/10'
                                          : 'border border-orange-600 bg-[#8B4513] text-white hover:bg-[#A0522D]'
                                }`}
                                title={user ? 'Logout from your account' : 'Login to your account'}
                            >
                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                    {user ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                                    <span>{user ? 'Logout' : 'Login'}</span>
                                </span>
                            </motion.button>

                            {/* Mobile Menu Button */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-white transition-all duration-300 hover:bg-gray-700 focus:ring-2 focus:ring-gray-400/50 focus:outline-none sm:h-10 sm:w-10 lg:hidden"
                                aria-label="Open menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <motion.div animate={{ rotate: isMobileMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                    <Menu className="h-5 w-5" />
                                </motion.div>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu - Black Background */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[9999] lg:hidden"
                        ref={mobileMenuRef}
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={closeMobileMenu}
                        />

                        {/* Mobile Menu Panel - Black Background */}
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
                            className="absolute top-0 right-0 h-screen w-80 bg-black shadow-2xl sm:w-96"
                            style={{
                                height: '100dvh',
                                maxHeight: '100dvh',
                            }}
                        >
                            <div className="flex h-full flex-col">
                                {/* Mobile Header */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center justify-between border-b border-gray-800 p-5 sm:p-6"
                                >
                                    <div className="flex items-center space-x-4 sm:space-x-5">
                                        <div className="relative flex-shrink-0">
                                            <img src="/cahayanbiyalogo.png" alt="Cahaya Anbiya Logo" className="h-9 w-auto sm:h-10" />
                                        </div>
                                        <div>
                                            <div className="text-base leading-tight font-bold text-white sm:text-lg">CAHAYA ANBIYA</div>
                                            <div className="mt-0.5 text-xs leading-tight font-medium text-white/80 sm:mt-1 sm:text-sm">
                                                TRAVEL AGENCY
                                            </div>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={closeMobileMenu}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-white transition-all duration-300 hover:bg-gray-700 focus:ring-2 focus:ring-gray-400/50 focus:outline-none sm:h-10 sm:w-10"
                                        aria-label="Close menu"
                                    >
                                        <X className="h-5 w-5" />
                                    </motion.button>
                                </motion.div>

                                {/* B2C -> B2B Button - Mobile */}
                                <div className="border-b border-gray-800 px-5 py-4 sm:px-6 sm:py-5">
                                    <button
                                        onClick={() => {
                                            handleModeSwitch();
                                            closeMobileMenu();
                                        }}
                                        className={`w-full rounded-lg px-5 py-3 text-sm font-medium transition-all duration-300 ${
                                            variant === 'b2b'
                                                ? 'border border-amber-600/40 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10'
                                                : 'border border-gray-400 bg-[#2C2C2C] text-white hover:bg-[#3A3A3A]'
                                        }`}
                                    >
                                        {variant === 'b2b' ? 'B2B → B2C' : 'B2C → B2B'}
                                    </button>
                                </div>

                                {/* Mobile Search - Golden Border (Integrated Design) */}
                                <div className="border-b border-gray-800 px-5 py-5 sm:px-6 sm:py-6">
                                    <form onSubmit={handleSearchSubmit} className="relative">
                                        {/* Integrated Search Container - Single Unit */}
                                        <div className="relative flex items-center overflow-hidden rounded-lg border-2 border-[#FFD700] bg-black">
                                            {/* Search Icon - Left */}
                                            <div className="flex items-center justify-center pr-2 pl-4">
                                                <Search className="h-4 w-4 flex-shrink-0 text-white" />
                                            </div>

                                            {/* Input Field - Middle */}
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search destinations.."
                                                className="flex-1 border-none bg-black py-3 text-sm text-white placeholder-gray-400 focus:outline-none"
                                                autoComplete="off"
                                                autoCorrect="off"
                                                autoCapitalize="off"
                                                spellCheck="false"
                                            />

                                            {/* Search Button - Right (Seamlessly Integrated) */}
                                        <button
                                            type="submit"
                                                className="flex h-full flex-shrink-0 items-center justify-center bg-[#F5A623] px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#FFB340] focus:outline-none"
                                            >
                                                Search
                                        </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Mobile Navigation */}
                                <nav className="flex-1 overflow-y-auto py-5 sm:py-6">
                                    <div className="space-y-2 px-5 sm:px-6">
                                        {variant === 'b2b' ? (
                                            <>
                                                <Link
                                                    href="/b2b"
                                                    className="group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-900 sm:px-5 sm:py-4"
                                                    onClick={closeMobileMenu}
                                                >
                                                    <Building2 className="h-5 w-5 text-white" />
                                                    <span className="whitespace-nowrap">Agency</span>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        window.dispatchEvent(new Event('open-b2b-packages'));
                                                        closeMobileMenu();
                                                    }}
                                                    className="group flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-medium text-white transition-all duration-300 hover:bg-gray-900 sm:px-5 sm:py-4"
                                                >
                                                    <Briefcase className="h-5 w-5 text-white" />
                                                    <span className="whitespace-nowrap">Packages</span>
                                                </button>
                                                <a
                                                    href="https://wa.me/6281234567890"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-900 sm:px-5 sm:py-4"
                                                    onClick={closeMobileMenu}
                                                >
                                                    <MessageCircle className="h-5 w-5 text-white" />
                                                    <span className="whitespace-nowrap">WhatsApp</span>
                                                </a>
                                            </>
                                        ) : (
                                            navigationItems.map((item, index) => {
                                                const IconComponent = item.icon ? iconMap[item.icon] : null;
                                                const isExpanded = expandedMobileItems.includes(item.label);

                                                return (
                                            <motion.div
                                                        key={item.label}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 + 0.2 }}
                                            >
                                                        {item.hasDropdown ? (
                                                            <div>
                                                                <button
                                                                    onClick={() => toggleMobileItem(item.label)}
                                                                    className="group flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-medium text-white transition-all duration-300 hover:bg-gray-900 sm:px-5 sm:py-4"
                                                                >
                                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                                        {IconComponent && <IconComponent className="h-5 w-5 flex-shrink-0" />}
                                                                        <span className="whitespace-nowrap">{item.label}</span>
                                                                    </div>
                                                                    <ChevronDown
                                                                        className={`h-4 w-4 transition-transform duration-300 ${
                                                                            isExpanded ? 'rotate-180' : ''
                                                                        }`}
                                                                    />
                                                                </button>
                                                                {isExpanded && (
                                                                    <div className="mt-2 ml-10 space-y-1.5 sm:ml-12">
                                                                        {item.label === 'Destinations' && (
                                                                            <>
                                                                                <Link
                                                                                    href="/destinations"
                                                                                    onClick={closeMobileMenu}
                                                                                    className="block rounded-lg px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-gray-900 hover:text-white"
                                                                                >
                                                                                    All Destinations
                                                                                </Link>
                                                                                <Link
                                                                                    href="/destinations?filter=popular"
                                                                                    onClick={closeMobileMenu}
                                                                                    className="block rounded-lg px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-gray-900 hover:text-white"
                                                                                >
                                                                                    Popular
                                                                                </Link>
                                                                            </>
                                                                        )}
                                                                        {item.label === 'Packages' && (
                                                                            <>
                                                                                <Link
                                                                                    href="/packages"
                                                                                    onClick={closeMobileMenu}
                                                                                    className="block rounded-lg px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-gray-900 hover:text-white"
                                                                                >
                                                                                    All Packages
                                                                                </Link>
                                                                                <Link
                                                                                    href="/packages?filter=special"
                                                                                    onClick={closeMobileMenu}
                                                                                    className="block rounded-lg px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-gray-900 hover:text-white"
                                                                                >
                                                                                    Special Offers
                                                                                </Link>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                    <Link
                                                        href={item.href}
                                                                className="group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-900 sm:px-5 sm:py-4"
                                                        onClick={closeMobileMenu}
                                                    >
                                                                {IconComponent && <IconComponent className="h-5 w-5 flex-shrink-0" />}
                                                                <span className="whitespace-nowrap">{item.label}</span>
                                                    </Link>
                                                        )}
                                            </motion.div>
                                                );
                                            })
                                        )}
                                    </div>
                                </nav>

                                {/* Admin CMS Controls - Mobile */}
                                {user && isAdmin && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="border-t border-gray-800/50 bg-gradient-to-b from-gray-900/50 to-transparent"
                                    >
                                        <div className="px-5 py-4 sm:px-6">
                                            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400/80">
                                                <div className="h-1 w-1 rounded-full bg-amber-400"></div>
                                                <span>Admin CMS</span>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                {/* Restore Center Button - Mobile */}
                                                <button
                                                    onClick={() => {
                                                        router.visit('/admin/restore-center');
                                                        closeMobileMenu();
                                                    }}
                                                    className="group flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 px-4 py-3.5 text-left text-sm font-medium text-purple-300 transition-all duration-300 hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-400/50 active:scale-[0.98]"
                                                >
                                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                                                        <RotateCcw className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold">Restore Center</div>
                                                        <div className="text-xs text-purple-300/70">Manage all changes</div>
                                                    </div>
                                                </button>

                                                {/* Edit/Save Button - Mobile - Transforms based on state */}
                                                <AnimatePresence mode="wait">
                                                    {editCtx.dirty ? (
                                                        // SAVE MODE - Has unsaved changes
                                                        <motion.button
                                                            key="save-mode-mobile"
                                                            initial={{ scale: 0.95, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0.95, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                
                                                                // Confirmation dialog
                                                                const confirmed = window.confirm(
                                                                    '💾 Save All Changes?\n\n' +
                                                                    'This will save all your modifications (text and images) to the database.\n\n' +
                                                                    'Are you sure you want to save these changes?'
                                                                );
                                                                
                                                                if (!confirmed) {
                                                                    console.log('❌ Save cancelled by user');
                                                                    return;
                                                                }
                                                                
                                                                console.log('💾 Saving all changes...');
                                                                
                                                                // Dispatch global save event
                                                                window.dispatchEvent(new CustomEvent('cms:flush-save'));
                                                                
                                                                // Clear dirty flag
                                                                editCtx.clearDirty();
                                                                
                                                                // Reload to get fresh data
                                                                router.reload({
                                                                    only: ['sections'],
                                                                    onSuccess: () => {
                                                                        // Show success notification (mobile responsive)
                                                                        const notification = document.createElement('div');
                                                                        notification.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[99999] rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 text-white shadow-2xl max-w-[90vw] sm:left-auto sm:right-4 sm:translate-x-0 sm:px-6 sm:py-4 sm:max-w-md';
                                                                        notification.innerHTML = `
                                                                            <div class="flex items-center gap-2 sm:gap-3">
                                                                                <svg class="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                                                </svg>
                                                                                <div class="flex-1">
                                                                                    <div class="text-sm font-bold sm:text-base">✅ Berhasil Disimpan!</div>
                                                                                    <div class="text-xs opacity-90 sm:text-sm">Semua perubahan sudah tersimpan</div>
                                                                                </div>
                                                                            </div>
                                                                        `;
                                                                        document.body.appendChild(notification);
                                                                        setTimeout(() => {
                                                                            notification.remove();
                                                                        }, 3000);
                                                                        
                                                                        // Close mobile menu after save
                                                                        closeMobileMenu();
                                                                    }
                                                                });
                                                            }}
                                                            className="group flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3.5 text-left text-sm font-bold text-white shadow-lg transition-all duration-300 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] animate-pulse"
                                                        >
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 shadow-lg ring-2 ring-white/30">
                                                                <Save className="h-4 w-4 text-white" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-bold">Save Changes</div>
                                                                <div className="text-xs text-white/80">You have unsaved work!</div>
                                                            </div>
                                                        </motion.button>
                                                    ) : editCtx.editMode ? (
                                                        // EDITING MODE - No changes yet
                                                        <motion.button
                                                            key="editing-mode-mobile"
                                                            initial={{ scale: 0.95, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0.95, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            onClick={() => {
                                                                editCtx.setEditMode(false);
                                                                closeMobileMenu();
                                                            }}
                                                            className="group flex w-full items-center gap-3 rounded-xl bg-blue-500/10 border border-blue-500/30 px-4 py-3.5 text-left text-sm font-medium text-blue-300 transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-400/50 active:scale-[0.98]"
                                                        >
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500 shadow-lg">
                                                                <Minus className="h-4 w-4 text-white" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-semibold">Editing Mode ON</div>
                                                                <div className="text-xs text-blue-300/70">Tap to exit</div>
                                                            </div>
                                                        </motion.button>
                                                    ) : (
                                                        // NORMAL MODE - Not editing
                                                        <motion.button
                                                            key="edit-mode-mobile"
                                                            initial={{ scale: 0.95, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0.95, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            onClick={() => {
                                                                editCtx.setEditMode(true);
                                                                closeMobileMenu();
                                                            }}
                                                            className="group flex w-full items-center gap-3 rounded-xl bg-gray-800/50 border border-gray-700/50 px-4 py-3.5 text-left text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800 hover:border-gray-600 active:scale-[0.98]"
                                                        >
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-700 shadow-lg">
                                                                <Plus className="h-4 w-4 text-white" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-semibold">Start Editing</div>
                                                                <div className="text-xs text-gray-400">Modify content</div>
                                                            </div>
                                                        </motion.button>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Mobile Footer */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-auto border-t border-gray-800 p-5 sm:p-6"
                                >
                                    {/* Login Button - Mobile */}
                                    <button
                                        onClick={() => {
                                            if (user) {
                                                logout();
                                            } else {
                                                const loginHref =
                                                    variant === 'b2b' ? '/login?mode=b2b&redirect=/b2b' : '/login?mode=b2c&redirect=/home';
                                                router.visit(loginHref);
                                            }
                                            closeMobileMenu();
                                        }}
                                        className={`mb-5 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-medium transition-all duration-300 focus:ring-2 focus:outline-none ${
                                            user
                                                ? 'border border-red-500/60 text-red-300 hover:bg-red-500/10 focus:ring-red-600/50'
                                                : 'border border-orange-600 bg-[#8B4513] text-white hover:bg-[#A0522D] focus:ring-orange-600/50'
                                        }`}
                                    >
                                        {user ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                                        {user ? 'Logout' : 'Login'}
                                    </button>

                                    {/* Copyright */}
                                    <div className="border-t border-gray-800 pt-4">
                                        <p className="text-left text-xs leading-relaxed text-gray-400">
                                            Cahaya Anbiya Travel © 2024 All Rights Reserved
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
};

export default GlobalHeader;
