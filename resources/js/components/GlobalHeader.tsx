import { useEditMode } from '@/components/cms';
import { logout } from '@/utils/logout';
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
    RotateCcw,
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
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />

            {/* Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute top-0 right-0 h-full w-80 overflow-y-auto bg-gradient-to-b from-black to-slate-950 shadow-2xl sm:w-96"
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
                    <div className="flex items-center justify-between border-b border-white/5 p-5">
                        <div className="flex items-center gap-3">
                            <img src={getR2Url('/cahayanbiyalogo.png')} alt="Logo" className="h-10 w-auto" onError={(e) => {
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
                            }} />
                            <div>
                                <div className="bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-base font-bold text-transparent">
                                    CAHAYA ANBIYA
                                </div>
                                <div className="text-xs text-white/60">TRAVEL AGENCY</div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
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
                                onClose();
                            }}
                            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold ${
                                variant === 'b2b'
                                    ? 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                                    : 'border border-white/10 bg-white/5 text-white'
                            }`}
                        >
                            {variant === 'b2b' ? 'Switch to B2C' : 'Switch to B2B'}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="border-b border-white/5 p-5">
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                                    <Search className="h-4 w-4 text-amber-500/60" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search destinations, packages, or locations..."
                                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pr-3 pl-10 text-sm text-white placeholder:text-white/40 focus:border-amber-500/50 focus:bg-white/10 focus:ring-1 focus:ring-amber-500/30 focus:outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={!searchQuery.trim()}
                                className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
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
                                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-white hover:bg-white/5"
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
                                            className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-white hover:bg-white/5"
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
                                        className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-white hover:bg-white/5"
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
                        <div className="border-t border-white/5 bg-gradient-to-b from-transparent to-black/50 p-5">
                            <div className="mb-3 text-xs font-semibold tracking-wider text-amber-400/80 uppercase">Admin CMS</div>
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        router.visit('/admin');
                                        onClose();
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-3 text-sm font-medium text-amber-300"
                                >
                                    <Shield className="h-5 w-5" />
                                    <span>Admin Dashboard</span>
                                </button>
                                <button
                                    onClick={() => {
                                        router.visit('/admin/restore-center');
                                        onClose();
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-3 text-sm font-medium text-purple-300"
                                >
                                    <RotateCcw className="h-5 w-5" />
                                    <span>Restore Center</span>
                                </button>
                                <button
                                    onClick={() => {
                                        router.visit('/admin/agent-verifications');
                                        onClose();
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-3 text-sm font-medium text-amber-300"
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
                        {/* Only show login button for B2B variant, not for admin */}
                        {variant === 'b2b' && !isAdmin && (
                            <button
                                onClick={() => {
                                    if (user) logout();
                                    else router.visit('/login?mode=b2b&redirect=/b2b');
                                    onClose();
                                }}
                                className={`mb-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                                    user
                                        ? 'border border-red-500/30 bg-red-500/10 text-red-300'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                }`}
                            >
                                {user ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                                {user ? 'Logout' : 'Login'}
                            </button>
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
        const target = variant === 'b2b' ? '/home' : '/b2b';
        router.visit(target);
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
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.95) 100%)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: isScrolled ? '1px solid rgba(254, 201, 1, 0.1)' : '1px solid transparent',
                    transition: 'border-color 0.3s ease',
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
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl transition-all duration-500 group-hover:from-amber-500/30 group-hover:to-orange-500/30" />
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
                                    <div className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-sm leading-tight font-bold text-transparent lg:text-base">
                                        CAHAYA ANBIYA
                                    </div>
                                    <div className="mt-0.5 text-xs leading-tight font-medium text-white/70">WISATA INDONESIA</div>
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
                                                className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/5 hover:text-white"
                                            >
                                                {IconComponent && <IconComponent className="h-4 w-4" />}
                                                <span>{item.label}</span>
                                            </button>
                                        ) : itemWithAction.external ? (
                                            <a
                                                href={item.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/5 hover:text-white"
                                            >
                                                {IconComponent && <IconComponent className="h-4 w-4" />}
                                                <span>{item.label}</span>
                                            </a>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/5 hover:text-white"
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
                                        className="hidden items-center justify-center rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-2 text-amber-300 transition-all hover:from-amber-500/20 hover:to-orange-500/20 md:flex"
                                        title="Admin Dashboard"
                                    >
                                        <Shield className="h-4 w-4" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.visit('/admin/restore-center')}
                                        className="hidden items-center gap-2 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-3 py-2 text-sm font-semibold text-purple-300 transition-all hover:from-purple-500/20 hover:to-pink-500/20 md:flex"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        <span className="hidden lg:inline">Restore</span>
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
                                                className="hidden animate-pulse items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-sm font-bold text-white shadow-lg ring-2 ring-amber-400/50 transition-all hover:from-amber-400 hover:to-orange-400 md:flex"
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
                                                className="hidden items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-300 transition-all hover:bg-blue-500/20 md:flex"
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
                                                className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10 md:flex"
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
                                className={`hidden rounded-xl px-3 py-2 text-sm font-semibold md:flex ${variant === 'b2b' ? 'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20' : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="hidden lg:inline">{variant === 'b2b' ? 'B2B' : 'B2C'}</span>
                                    <ArrowRightLeft className="h-4 w-4" />
                                    <span className="hidden lg:inline">{variant === 'b2b' ? 'B2C' : 'B2B'}</span>
                                </span>
                            </motion.button>

                            {/* Only show login button for B2B variant, not for admin */}
                            {variant === 'b2b' && !isAdmin && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        if (user) {
                                            logout();
                                        } else {
                                            router.visit('/login?mode=b2b&redirect=/b2b');
                                        }
                                    }}
                                    className={`hidden rounded-xl px-3 py-2 text-sm font-semibold md:flex ${user ? 'border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20' : 'border-none bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400'}`}
                                >
                                    <span className="flex items-center gap-2">
                                        {user ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                                        <span>{user ? 'Logout' : 'Login'}</span>
                                    </span>
                                </motion.button>
                            )}

                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition-all hover:bg-white/10 lg:hidden"
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
