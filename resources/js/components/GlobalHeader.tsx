import { useEditMode } from '@/components/cms';
import { useLogout } from '@/hooks/useLogout';
import { getR2Url } from '@/utils/imageHelper';
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
    Save,
    Search,
    Shield,
    Sparkles,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { B2B_NAVIGATION_ITEMS, B2C_NAVIGATION_ITEMS } from './header/constants';

interface GlobalHeaderProps {
    variant?: 'b2c' | 'b2b';
    forceLightTheme?: boolean;
    className?: string;
}

interface NavigationItem {
    label: string;
    href: string;
    icon?: string;
    hasDropdown?: boolean;
    action?: string;
    external?: boolean;
}

interface User {
    id: number;
    name: string;
    email: string;
    is_admin?: boolean;
}

interface EditContext {
    editMode: boolean;
    setEditMode: (value: boolean) => void;
    dirty?: boolean;
    clearDirty?: () => void;
}

// Mobile Menu Component
const MobileMenuPortal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    variant: 'b2c' | 'b2b';
    navigationItems: NavigationItem[];
    iconMap: { [key: string]: React.ComponentType<{ className?: string; size?: number }> };
    user: User | null | undefined;
    isAdmin: boolean;
    editCtx: EditContext;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    handleSearchSubmit: (e: React.FormEvent) => void;
    handleModeSwitch: () => void;
}> = ({
    isOpen,
    onClose,
    variant,
    navigationItems,
    iconMap,
    user,
    isAdmin,
    editCtx,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    handleModeSwitch,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] lg:hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-md"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />

            {/* Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute top-0 right-0 h-full w-80 overflow-y-auto border-l-2 border-[#d4af37]/40 bg-gradient-to-b from-[#1e3a5f] via-[#2d4a6f] to-[#1e3a5f] shadow-2xl sm:w-96"
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    height: '100vh',
                    maxHeight: '100vh',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}
            >
                <div className="flex min-h-full flex-col" style={{ minHeight: '100vh' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 p-5">
                        <div className="flex items-center gap-3">
                            <img
                                src={getR2Url('/cahayanbiyalogo.png')}
                                alt="Logo"
                                className="h-10 w-auto"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                                        // Try alternative R2 path variations, never fallback to local
                                        const currentUrl = target.src;
                                        let altPath = currentUrl;
                                        if (currentUrl.includes('/public/images/')) {
                                            altPath = currentUrl.replace('/public/images/', '/images/');
                                        } else if (currentUrl.includes('/public/')) {
                                            altPath = currentUrl.replace('/public/', '/');
                                        } else if (currentUrl.includes('/images/')) {
                                            altPath = currentUrl.replace('/images/', '/public/images/');
                                        } else {
                                            altPath = 'https://assets.cahayaanbiya.com/public/images/cahayanbiyalogo.png';
                                        }
                                        console.log('[Logo] Trying alternative R2 path:', altPath);
                                        target.src = altPath;
                                    }
                                }}
                            />
                            <div>
                                <div className="text-base font-bold text-white">CAHAYA ANBIYA</div>
                                <div className="text-xs text-white/60">TRAVEL AGENCY</div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Mode Switch */}
                    <div className="border-b border-white/10 p-5">
                        <button
                            onClick={() => {
                                handleModeSwitch();
                                onClose();
                            }}
                            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold ${
                                variant === 'b2b'
                                    ? 'border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37]'
                                    : 'border border-[#0054ff]/50 bg-[#0054ff]/20 text-white'
                            }`}
                        >
                            {variant === 'b2b' ? 'Switch to B2C' : 'Switch to B2B'}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="border-b border-white/10 p-5">
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                                    <Search className="h-4 w-4 text-[#3fb4ff]" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search destinations, packages, or locations..."
                                    className="w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pr-3 pl-10 text-sm text-white placeholder:text-white/50 focus:border-[#3fb4ff] focus:bg-white/15 focus:ring-1 focus:ring-[#3fb4ff]/30 focus:outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={!searchQuery.trim()}
                                className="rounded-lg bg-[#ff5200] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#ff6b35] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Navigation */}
                    <nav className="p-5" style={{ flex: '1 1 auto', minHeight: 0 }}>
                        <div className="space-y-2">
                            {navigationItems.map((item) => {
                                const IconComponent = item.icon ? iconMap[item.icon] : null;
                                const itemWithAction = item as NavigationItem & { action?: string; external?: boolean };

                                if (itemWithAction.action) {
                                    return (
                                        <button
                                            key={item.label}
                                            onClick={() => {
                                                if (itemWithAction.action === 'open-b2b-packages') {
                                                    window.dispatchEvent(new Event('open-b2b-packages'));
                                                } else if (itemWithAction.action === 'open-consultation') {
                                                    const consultationButton = document.querySelector('[data-consultation-trigger]') as HTMLElement;
                                                    consultationButton?.click();
                                                }
                                                onClose();
                                            }}
                                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-white hover:bg-white/10"
                                        >
                                            {IconComponent && <IconComponent className="h-5 w-5" />}
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                }

                                if (itemWithAction.external) {
                                    return (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={onClose}
                                            className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-white hover:bg-white/10"
                                        >
                                            {IconComponent && <IconComponent className="h-5 w-5" />}
                                            <span>{item.label}</span>
                                        </a>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={onClose}
                                        className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-white hover:bg-white/10"
                                    >
                                        {IconComponent && <IconComponent className="h-5 w-5" />}
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Admin */}
                    {user && isAdmin && (
                        <div className="border-t border-white/10 bg-white/5 p-5">
                            <div className="mb-3 text-xs font-semibold tracking-wider text-[#d4af37] uppercase">Admin CMS</div>
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        router.visit('/admin');
                                        onClose();
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-3 text-sm font-medium text-[#d4af37]"
                                >
                                    <Shield className="h-5 w-5" />
                                    <span>Admin Dashboard</span>
                                </button>
                                <button
                                    onClick={() => {
                                        router.visit('/admin/agent-verifications');
                                        onClose();
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-3 text-sm font-medium text-[#d4af37]"
                                >
                                    <Building2 className="h-5 w-5" />
                                    <span>Agent Verifications</span>
                                </button>
                                {editCtx.dirty ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const confirmed = window.confirm('💾 Save all changes?');
                                            if (!confirmed) return;
                                            window.dispatchEvent(new CustomEvent('cms:flush-save'));
                                            editCtx.clearDirty?.();
                                            router.reload({ only: ['sections'] });
                                            onClose();
                                        }}
                                        className="flex w-full animate-pulse items-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-bold text-white"
                                    >
                                        <Save className="h-5 w-5" />
                                        <span>Save Changes</span>
                                    </button>
                                ) : editCtx.editMode ? (
                                    <button
                                        onClick={() => {
                                            editCtx.setEditMode(false);
                                            onClose();
                                        }}
                                        className="flex w-full items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-300"
                                    >
                                        <Minus className="h-5 w-5" />
                                        <span>Exit Editing</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            editCtx.setEditMode(true);
                                            onClose();
                                        }}
                                        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span>Start Editing</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="border-t border-white/5 p-5">
                        {/* B2B variant: Show Back to Select Mode and Logout buttons */}
                        {variant === 'b2b' && !isAdmin && (
                            <>
                                {/* Back to Select Mode Button */}
                                <a
                                    href="/"
                                    onClick={(e) => {
                                        // Clear session storage to ensure splash screen shows
                                        try {
                                            if (typeof window !== 'undefined') {
                                                window.sessionStorage.removeItem('cahaya-anbiya-session');
                                                window.localStorage.removeItem('cahaya-anbiya-visited');
                                            }
                                        } catch {
                                            // Ignore storage errors
                                        }
                                        onClose();
                                    }}
                                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-300 transition-all hover:bg-blue-500/20"
                                >
                                    <Home className="h-4 w-4" />
                                    Back to Select Mode
                                </a>

                                {/* Logout Button (only if user is logged in) */}
                                {user ? (
                                    <button
                                        onClick={() => {
                                            logout();
                                            onClose();
                                        }}
                                        disabled={isLoggingOut}
                                        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                                    </button>
                                ) : (
                                    <a
                                        href="/login?mode=b2b&redirect=/b2b"
                                        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-amber-600 hover:to-orange-600"
                                        onClick={onClose}
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Login
                                    </a>
                                )}
                            </>
                        )}
                        <p className="text-center text-xs text-white/40">© 2024 Cahaya Anbiya Travel</p>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body,
    );
};

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ variant = 'b2c', className = '' }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { logout, isLoggingOut } = useLogout();

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
        const ctx = useEditMode();
        isAdmin = ctx.isAdmin;
    } catch {
        isAdmin = Boolean(user?.is_admin);
    }

    const editCtx = (() => {
        try {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return useEditMode();
        } catch {
            return { editMode: false, setEditMode: () => {}, clearDirty: () => {} } as EditContext;
        }
    })();

    const navigationItems = variant === 'b2c' ? B2C_NAVIGATION_ITEMS : B2B_NAVIGATION_ITEMS;

    const iconMap: { [key: string]: React.ComponentType<{ className?: string; size?: number }> } = {
        Home: Home,
        Info: Info,
        MapPin: MapPin,
        Box: Package,
        Sparkles: Sparkles,
        Phone: Phone,
        Building2: Building2,
        Briefcase: Briefcase,
        MessageCircle: MessageCircle,
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleModeSwitch = () => {
        if (variant === 'b2c') {
            router.visit(route('b2b.index'));
        } else {
            router.visit(route('b2c.home'));
        }
    };

    return (
        <>
            {/* Desktop Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`sticky top-0 z-[9999] ${className}`}
                style={{
                    background: 'linear-gradient(180deg, #1e3a5f 0%, #2d4a6f 45%, #3d5a80 100%)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: isScrolled ? '2px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: isScrolled ? '0 4px 24px rgba(0, 0, 0, 0.12)' : 'none',
                }}
            >
                <div className="mx-auto h-20 max-w-7xl px-4 lg:px-6">
                    <div className="flex h-full items-center justify-between gap-4">
                        <Link
                            href={variant === 'b2c' ? '/home' : '/b2b'}
                            className="group flex flex-shrink-0 items-center gap-3"
                            aria-label="Cahaya Anbiya Home"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-[#5a7a9e]/25 blur-xl transition-all duration-500 group-hover:bg-[#3d5a80]/30" />
                                    <img
                                        src={getR2Url('/cahayanbiyalogo.png')}
                                        alt="Cahaya Anbiya Logo"
                                        className="relative h-10 w-auto transition-transform duration-300 group-hover:rotate-3 lg:h-11"
                                        onError={(e) => {
                                            const target = e.currentTarget;
                                            if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                                                // Try alternative R2 path variations, never fallback to local
                                                const currentUrl = target.src;
                                                let altPath = currentUrl;
                                                if (currentUrl.includes('/public/images/')) {
                                                    altPath = currentUrl.replace('/public/images/', '/images/');
                                                } else if (currentUrl.includes('/public/')) {
                                                    altPath = currentUrl.replace('/public/', '/');
                                                } else if (currentUrl.includes('/images/')) {
                                                    altPath = currentUrl.replace('/images/', '/public/images/');
                                                } else {
                                                    altPath = 'https://assets.cahayaanbiya.com/public/images/cahayanbiyalogo.png';
                                                }
                                                console.log('[Logo] Trying alternative R2 path:', altPath);
                                                target.src = altPath;
                                            }
                                        }}
                                    />
                                </div>
                                <div className="hidden sm:block">
                                    <div className="text-sm font-bold text-white lg:text-base">CAHAYA ANBIYA</div>
                                    <div className="mt-0.5 text-xs font-medium text-[#d4af37]">WISATA INDONESIA</div>
                                </div>
                            </motion.div>
                        </Link>

                        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
                            {navigationItems.map((item, index) => {
                                const IconComponent = item.icon ? iconMap[item.icon] : null;
                                const itemWithAction = item as NavigationItem & { action?: string; external?: boolean };

                                return (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.4 }}
                                    >
                                        {itemWithAction.action ? (
                                            <button
                                                onClick={() => {
                                                    if (itemWithAction.action === 'open-b2b-packages') {
                                                        window.dispatchEvent(new Event('open-b2b-packages'));
                                                    } else if (itemWithAction.action === 'open-consultation') {
                                                        // Trigger consultation dialog
                                                        const consultationButton = document.querySelector(
                                                            '[data-consultation-trigger]',
                                                        ) as HTMLElement;
                                                        consultationButton?.click();
                                                    }
                                                }}
                                                className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white"
                                            >
                                                {IconComponent && <IconComponent className="h-4 w-4" />}
                                                <span>{item.label}</span>
                                            </button>
                                        ) : itemWithAction.external ? (
                                            <a
                                                href={item.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white"
                                            >
                                                {IconComponent && <IconComponent className="h-4 w-4" />}
                                                <span>{item.label}</span>
                                            </a>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white"
                                            >
                                                {IconComponent && <IconComponent className="h-4 w-4" />}
                                                <span>{item.label}</span>
                                            </Link>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </nav>

                        <div className="flex flex-shrink-0 items-center gap-2">
                            {user && isAdmin && (
                                <>
                                    {/* Admin Indicator Button - Small and Proportional */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.visit('/admin')}
                                        className="hidden items-center justify-center rounded-lg border border-[#d4af37]/40 bg-[#d4af37]/10 p-2 text-[#d4af37] transition-all hover:bg-[#d4af37]/20 md:flex"
                                        title="Admin Dashboard"
                                    >
                                        <Shield className="h-4 w-4" />
                                    </motion.button>
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
                                                    editCtx.clearDirty?.();
                                                    router.reload({ only: ['sections'] });
                                                }}
                                                className="hidden animate-pulse items-center gap-2 rounded-xl bg-[#ff5200] px-3 py-2 text-sm font-bold text-white shadow-lg ring-2 ring-[#d4af37]/30 transition-all hover:bg-[#ff6b35] md:flex"
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
                                                className="hidden items-center gap-2 rounded-xl border border-[#0054ff]/40 bg-[#0054ff]/15 px-3 py-2 text-sm font-semibold text-[#3fb4ff] transition-all hover:bg-[#0054ff]/25 md:flex"
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
                                                className="hidden items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-white/15 md:flex"
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span className="hidden lg:inline">Edit</span>
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleModeSwitch}
                                className={`hidden rounded-xl px-3 py-2 text-sm font-semibold md:flex ${variant === 'b2b' ? 'border border-[#d4af37]/50 bg-[#d4af37]/15 text-[#d4af37] hover:bg-[#d4af37]/25' : 'border border-[#0054ff]/70 bg-[#0054ff]/25 text-white hover:bg-[#0054ff]/35'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="hidden lg:inline">{variant === 'b2b' ? 'B2B' : 'B2C'}</span>
                                    <ArrowRightLeft className="h-4 w-4" />
                                    <span className="hidden lg:inline">{variant === 'b2b' ? 'B2C' : 'B2B'}</span>
                                </span>
                            </motion.button>

                            {/* Only show login button for B2B variant, not for admin */}
                            {variant === 'b2b' &&
                                !isAdmin &&
                                (user ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => logout()}
                                        disabled={isLoggingOut}
                                        className="hidden rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 md:flex"
                                    >
                                        <span className="flex items-center gap-2">
                                            <LogOut className="h-4 w-4" />
                                            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                                        </span>
                                    </motion.button>
                                ) : (
                                    <a
                                        href="/login?mode=b2b&redirect=/b2b"
                                        className="hidden items-center gap-2 rounded-xl border-none bg-[#ff5200] px-3 py-2 text-sm font-semibold text-white hover:bg-[#ff6b35] md:flex"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        <span>Login</span>
                                    </a>
                                ))}

                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-all hover:bg-white/20 lg:hidden"
                                aria-label="Open mobile menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu - Using Portal */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenuPortal
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                        variant={variant}
                        navigationItems={navigationItems}
                        iconMap={iconMap}
                        user={user}
                        isAdmin={isAdmin}
                        editCtx={editCtx}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSearchSubmit={handleSearchSubmit}
                        handleModeSwitch={handleModeSwitch}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default GlobalHeader;
