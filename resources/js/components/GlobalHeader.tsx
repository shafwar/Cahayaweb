import { useEditMode } from '@/components/cms';
import { logout } from '@/utils/logout';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRightLeft,
    Briefcase,
    Building2,
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

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ variant = 'b2c', className = '' }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [, setExpandedMobileItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // User & admin context
    const page = usePage();
    interface PageProps {
        auth?: {
            user?: {
                id: number;
                name: string;
                email: string;
                is_admin?: boolean;
            };
        };
    }
    const user = (page.props as PageProps)?.auth?.user;
    let isAdmin = false;
    try {
        // prefer context when provider exists
         
        const ctx = useEditMode();
        isAdmin = ctx.isAdmin;
    } catch {
        isAdmin = Boolean(user?.is_admin);
    }
    interface EditContext {
        editMode: boolean;
        setEditMode: (value: boolean) => void;
        dirty?: boolean;
        clearDirty?: () => void;
    }
    const editCtx = (() => {
        try {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return useEditMode();
        } catch {
            return { editMode: false, setEditMode: () => {} } as EditContext;
        }
    })();

    // Get navigation items
    const navigationItems = variant === 'b2c' ? B2C_NAVIGATION_ITEMS : [];

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

    // Click Outside Handler
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


    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setExpandedMobileItems([]);
    };

    // Handle mode switch
    const handleModeSwitch = () => {
        const target = variant === 'b2b' ? '/home' : '/b2b';
        router.visit(target);
    };

    return (
        <>
            {/* Desktop Header - Black with subtle border */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`sticky top-0 z-[9999] ${className}`}
                style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.95) 100%)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: isScrolled ? '1px solid rgba(254, 201, 1, 0.1)' : '1px solid transparent',
                    transition: 'border-color 0.3s ease',
                }}
            >
                <div className="mx-auto h-20 max-w-7xl px-4 lg:px-6">
                    <div className="flex h-full items-center justify-between gap-4">
                        {/* Logo Section */}
                        <Link
                            href={variant === 'b2c' ? '/home' : '/b2b'}
                            className="group flex flex-shrink-0 items-center gap-3"
                            aria-label="Cahaya Anbiya Home"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-3"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl transition-all duration-500 group-hover:from-amber-500/30 group-hover:to-orange-500/30" />
                                    <img
                                        src="/cahayanbiyalogo.png"
                                        alt="Cahaya Anbiya Logo"
                                        className="relative h-10 w-auto transition-transform duration-300 group-hover:rotate-3 lg:h-11"
                                    />
                                </div>

                                <div className="hidden sm:block">
                                    <div className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-sm font-bold leading-tight text-transparent lg:text-base">
                                        CAHAYA ANBIYA
                                    </div>
                                    <div className="mt-0.5 text-xs font-medium leading-tight text-white/70">
                                        WISATA INDONESIA
                                    </div>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
                            {variant === 'b2b' ? (
                                <>
                                    <Link
                                        href="/b2b"
                                        className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/5 hover:text-white"
                                    >
                                        <Building2 className="h-4 w-4" />
                                        <span>Agency</span>
                                    </Link>
                                    <button
                                        onClick={() => window.dispatchEvent(new Event('open-b2b-packages'))}
                                        className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/5 hover:text-white"
                                    >
                                        <Briefcase className="h-4 w-4" />
                                        <span>Packages</span>
                                    </button>
                                    <a
                                        href="https://wa.me/6281234567890"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/5 hover:text-white"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        <span>WhatsApp</span>
                                    </a>
                                </>
                            ) : (
                                navigationItems.map((item, index) => {
                                    const IconComponent = item.icon ? iconMap[item.icon] : null;
                                    return (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.4 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/5 hover:text-white"
                                            >
                                                {IconComponent && <IconComponent className="h-4 w-4" />}
                                                <span>{item.label}</span>
                                            </Link>
                                        </motion.div>
                                    );
                                })
                            )}
                        </nav>

                        {/* Right Section */}
                        <div className="flex flex-shrink-0 items-center gap-2">
                            {/* Admin Controls */}
                            {user && isAdmin && (
                                <>
                                    {/* Restore Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.visit('/admin/restore-center')}
                                        className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 px-3 py-2 text-sm font-semibold text-purple-300 transition-all hover:from-purple-500/20 hover:to-pink-500/20 md:flex"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        <span className="hidden lg:inline">Restore</span>
                                    </motion.button>

                                    {/* Edit/Save Toggle */}
                                    <AnimatePresence mode="wait">
                                        {editCtx.dirty ? (
                                            <motion.button
                                                key="save"
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0.8 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const confirmed = window.confirm('💾 Save all changes?');
                                                    if (!confirmed) return;
                                                    window.dispatchEvent(new CustomEvent('cms:flush-save'));
                                                    editCtx.clearDirty();
                                                    router.reload({ only: ['sections'] });
                                                }}
                                                className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-sm font-bold text-white shadow-lg ring-2 ring-amber-400/50 transition-all hover:from-amber-400 hover:to-orange-400 md:flex animate-pulse"
                                            >
                                                <Save className="h-4 w-4" />
                                                <span>Save</span>
                                            </motion.button>
                                        ) : editCtx.editMode ? (
                                            <motion.button
                                                key="editing"
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0.8 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => editCtx.setEditMode(false)}
                                                className="hidden items-center gap-2 rounded-xl bg-blue-500/10 border border-blue-500/30 px-3 py-2 text-sm font-semibold text-blue-300 transition-all hover:bg-blue-500/20 md:flex"
                                            >
                                                <Minus className="h-4 w-4" />
                                                <span className="hidden lg:inline">Editing</span>
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                key="edit"
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0.8 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => editCtx.setEditMode(true)}
                                                className="hidden items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10 md:flex"
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span className="hidden lg:inline">Edit</span>
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}

                            {/* Mode Switch */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleModeSwitch}
                                className={`hidden rounded-xl px-3 py-2 text-sm font-semibold md:flex ${
                                    variant === 'b2b'
                                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="hidden lg:inline">{variant === 'b2b' ? 'B2B' : 'B2C'}</span>
                                    <ArrowRightLeft className="h-4 w-4" />
                                    <span className="hidden lg:inline">{variant === 'b2b' ? 'B2C' : 'B2B'}</span>
                                </span>
                            </motion.button>

                            {/* Login/Logout */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (user) {
                                        logout();
                                    } else {
                                        const loginHref = variant === 'b2b' ? '/login?mode=b2b&redirect=/b2b' : '/login?mode=b2c&redirect=/home';
                                        router.visit(loginHref);
                                    }
                                }}
                                className={`hidden rounded-xl px-3 py-2 text-sm font-semibold md:flex ${
                                    user
                                        ? 'bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 border-none text-white hover:from-amber-400 hover:to-orange-400'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    {user ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                                    <span>{user ? 'Logout' : 'Login'}</span>
                                </span>
                            </motion.button>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition-all hover:bg-white/10 focus:outline-none lg:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="h-5 w-5" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[99999] lg:hidden"
                        ref={mobileMenuRef}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={closeMobileMenu}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 right-0 h-full w-80 bg-gradient-to-b from-black to-slate-950 shadow-2xl sm:w-96"
                        >
                            <div className="flex h-full flex-col">
                                {/* Mobile Header */}
                                <div className="flex items-center justify-between border-b border-white/5 p-5">
                                    <div className="flex items-center gap-3">
                                        <img src="/cahayanbiyalogo.png" alt="Logo" className="h-10 w-auto" />
                                        <div>
                                            <div className="bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-base font-bold text-transparent">
                                                CAHAYA ANBIYA
                                            </div>
                                            <div className="text-xs text-white/60">TRAVEL AGENCY</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeMobileMenu}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Mode Switch */}
                                <div className="border-b border-white/5 p-5">
                                    <button
                                        onClick={() => {
                                            handleModeSwitch();
                                            closeMobileMenu();
                                        }}
                                        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                            variant === 'b2b'
                                                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                                                : 'bg-white/5 border border-white/10 text-white'
                                        }`}
                                    >
                                        {variant === 'b2b' ? 'Switch to B2C' : 'Switch to B2B'}
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="border-b border-white/5 p-5">
                                    <form onSubmit={handleSearchSubmit} className="flex overflow-hidden rounded-xl border-2 border-amber-500">
                                        <div className="flex items-center bg-black px-3">
                                            <Search className="h-4 w-4 text-white/60" />
                                        </div>
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search destinations..."
                                            className="flex-1 border-none bg-black py-3 px-3 text-sm text-white placeholder-white/40 focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 text-sm font-bold text-white hover:from-amber-400 hover:to-orange-400"
                                        >
                                            Search
                                        </button>
                                    </form>
                                </div>

                                {/* Navigation */}
                                <nav className="flex-1 overflow-y-auto p-5">
                                    <div className="space-y-2">
                                        {(variant === 'b2b' ? [] : navigationItems).map((item) => {
                                            const IconComponent = item.icon ? iconMap[item.icon] : null;
                                            return (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={closeMobileMenu}
                                                    className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/5"
                                                >
                                                    {IconComponent && <IconComponent className="h-5 w-5" />}
                                                    <span>{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </nav>

                                {/* Admin Section */}
                                {user && isAdmin && (
                                    <div className="border-t border-white/5 bg-gradient-to-b from-transparent to-black/50 p-5">
                                        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400/80">Admin CMS</div>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => {
                                                    router.visit('/admin/restore-center');
                                                    closeMobileMenu();
                                                }}
                                                className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 px-4 py-3 text-sm font-medium text-purple-300"
                                            >
                                                <RotateCcw className="h-5 w-5" />
                                                <span>Restore Center</span>
                                            </button>
                                            <AnimatePresence mode="wait">
                                                {editCtx.dirty ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const confirmed = window.confirm('💾 Save all changes?');
                                                            if (!confirmed) return;
                                                            window.dispatchEvent(new CustomEvent('cms:flush-save'));
                                                            editCtx.clearDirty();
                                                            router.reload({ only: ['sections'] });
                                                            closeMobileMenu();
                                                        }}
                                                        className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-bold text-white animate-pulse"
                                                    >
                                                        <Save className="h-5 w-5" />
                                                        <span>Save Changes</span>
                                                    </button>
                                                ) : editCtx.editMode ? (
                                                    <button
                                                        onClick={() => {
                                                            editCtx.setEditMode(false);
                                                            closeMobileMenu();
                                                        }}
                                                        className="flex w-full items-center gap-3 rounded-xl bg-blue-500/10 border border-blue-500/30 px-4 py-3 text-sm font-medium text-blue-300"
                                                    >
                                                        <Minus className="h-5 w-5" />
                                                        <span>Exit Editing</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            editCtx.setEditMode(true);
                                                            closeMobileMenu();
                                                        }}
                                                        className="flex w-full items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-medium text-white"
                                                    >
                                                        <Plus className="h-5 w-5" />
                                                        <span>Start Editing</span>
                                                    </button>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="border-t border-white/5 p-5">
                                    <button
                                        onClick={() => {
                                            if (user) logout();
                                            else router.visit(variant === 'b2b' ? '/login?mode=b2b&redirect=/b2b' : '/login?mode=b2c&redirect=/home');
                                            closeMobileMenu();
                                        }}
                                        className={`mb-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                                            user
                                                ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                                                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                        }`}
                                    >
                                        {user ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                                        {user ? 'Logout' : 'Login'}
                                    </button>
                                    <p className="text-center text-xs text-white/40">© 2024 Cahaya Anbiya Travel</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GlobalHeader;
