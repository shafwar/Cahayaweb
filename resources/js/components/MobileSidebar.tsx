import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Home, Info, MapPin, Newspaper, Package, Phone, Settings, Sparkles, User, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MenuItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    description?: string;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [gestureStart, setGestureStart] = useState<number | null>(null);
    const [gestureDirection, setGestureDirection] = useState<'left' | 'right' | null>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Menu items with enhanced structure
    const menuItems: MenuItem[] = [
        {
            href: route('b2c.home'),
            label: 'Home',
            icon: Home,
            description: 'Discover our amazing destinations',
        },
        {
            href: route('b2c.about'),
            label: 'About',
            icon: Info,
            description: 'Learn about our story and values',
        },
        {
            href: route('b2c.destinations'),
            label: 'Destinations',
            icon: MapPin,
            badge: 'New',
            description: 'Explore beautiful places around the world',
        },
        {
            href: route('b2c.packages'),
            label: 'Packages',
            icon: Package,
            description: 'Find the perfect travel package',
        },
        {
            href: route('b2c.highlights'),
            label: 'Highlights',
            icon: Sparkles,
            description: 'Featured travel experiences',
        },
        {
            href: route('b2c.blog'),
            label: 'Blog',
            icon: Newspaper,
            description: 'Travel tips and stories',
        },
        {
            href: route('b2c.contact'),
            label: 'Contact',
            icon: Phone,
            description: 'Get in touch with us',
        },
    ];

    // Enhanced gesture handling
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            setGestureStart(e.touches[0].clientX);
            setGestureDirection(null);
        }
    }, []);

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (gestureStart === null || e.touches.length !== 1) return;

            const deltaX = e.touches[0].clientX - gestureStart;
            const threshold = 50;

            if (Math.abs(deltaX) > threshold) {
                const direction = deltaX > 0 ? 'right' : 'left';
                setGestureDirection(direction);
            }
        },
        [gestureStart],
    );

    const handleTouchEnd = useCallback(() => {
        if (gestureDirection === 'left' && isOpen) {
            onClose();
        }
        setGestureStart(null);
        setGestureDirection(null);
    }, [gestureDirection, isOpen, onClose]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    // Enhanced body scroll lock - only lock when sidebar is fully open
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            const originalOverflow = document.body.style.overflow;
            const originalPosition = document.body.style.position;
            
            // Only lock scroll when sidebar is completely open
            setTimeout(() => {
                document.body.style.position = 'fixed';
                document.body.style.top = `-${scrollY}px`;
                document.body.style.width = '100%';
                document.body.style.overflow = 'hidden';
                document.body.classList.add('mobile-sidebar-open');
            }, 100); // Small delay to allow sidebar animation to start

            return () => {
                // Restore original styles immediately
                document.body.style.position = originalPosition;
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = originalOverflow;
                document.body.classList.remove('mobile-sidebar-open');
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Enhanced Backdrop with Better Z-Index */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        style={{
                            touchAction: 'none',
                            WebkitTouchCallout: 'none',
                            WebkitUserSelect: 'none',
                            userSelect: 'none',
                        }}
                    />

                    {/* Enhanced Sidebar with Maximum Z-Index */}
                    <motion.div
                        ref={sidebarRef}
                        initial={{ x: '-100%' }}
                        animate={{
                            x: 0,
                            ...(gestureDirection === 'left' && { x: -20 }),
                            ...(gestureDirection === 'right' && { x: 10 }),
                        }}
                        exit={{ x: '-100%' }}
                        transition={{
                            duration: 0.4,
                            ease: [0.25, 0.25, 0, 1],
                        }}
                        className="fixed top-0 left-0 z-[9999] h-full w-80 max-w-[85vw] bg-gradient-to-b from-black/95 to-black/90 shadow-2xl backdrop-blur-xl"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            overscrollBehavior: 'contain',
                            isolation: 'isolate',
                            pointerEvents: 'auto',
                            touchAction: 'pan-y',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 p-6">
                            <div className="flex items-center gap-3">
                                <img src="/cahayanbiyalogo.png" alt="Cahaya Anbiya Logo" className="h-10 w-auto" />
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Navigation</h2>
                                    <p className="text-xs text-gray-400">Choose your destination</p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                                aria-label="Close sidebar"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Enhanced Navigation Menu with Better Scrolling */}
                        <div 
                            className="flex-1 overflow-y-auto px-4 py-6"
                            style={{
                                WebkitOverflowScrolling: 'touch',
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(212, 175, 55, 0.3) transparent',
                                overscrollBehavior: 'contain',
                            }}
                        >
                            <nav className="space-y-2">
                                {menuItems.map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.05,
                                        }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className="group relative flex items-center gap-4 rounded-xl p-4 text-white transition-all duration-200 hover:bg-white/10 hover:shadow-lg"
                                            onMouseEnter={() => setActiveSection(item.label)}
                                            onMouseLeave={() => setActiveSection(null)}
                                        >
                                            {/* Icon */}
                                            <div className="flex-shrink-0 rounded-lg bg-secondary/20 p-2 transition-colors group-hover:bg-secondary/30">
                                                <item.icon className="h-5 w-5 text-secondary transition-colors group-hover:text-secondary" />
                                            </div>

                                            {/* Content */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{item.label}</span>
                                                    {item.badge && (
                                                        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-400 group-hover:text-gray-300">{item.description}</p>
                                            </div>

                                            {/* Arrow */}
                                            <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />

                                            {/* Active indicator */}
                                            {activeSection === item.label && (
                                                <motion.div
                                                    layoutId="active-indicator"
                                                    className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-secondary"
                                                    initial={{ scaleY: 0 }}
                                                    animate={{ scaleY: 1 }}
                                                    exit={{ scaleY: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            {/* Divider */}
                            <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
                                    <Link
                                        href={route('home')}
                                        onClick={onClose}
                                        className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 p-4 text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10"
                                    >
                                        <div className="flex-shrink-0 rounded-lg bg-primary/20 p-2">
                                            <Settings className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <span className="font-medium">Switch to B2B/B2C</span>
                                            <p className="text-sm text-gray-400">Change platform mode</p>
                                        </div>
                                    </Link>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
                                    <Link
                                        href={route('login')}
                                        onClick={onClose}
                                        className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-accent to-accent/90 p-4 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-accent/90 hover:to-accent hover:shadow-xl"
                                    >
                                        <div className="flex-shrink-0 rounded-lg bg-white/20 p-2">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <span className="font-semibold">Login to Account</span>
                                            <p className="text-sm text-white/80">Access your dashboard</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-white/10 p-4">
                            <div className="text-center text-xs text-gray-400">
                                <p>Cahaya Anbiya Travel</p>
                                <p className="mt-1">Inspiring Halal Journeys</p>
                            </div>
                        </div>

                        {/* Gesture Indicator */}
                        {gestureDirection && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className={`absolute top-1/2 right-4 -translate-y-1/2 rounded-full px-3 py-1 text-sm font-medium ${
                                    gestureDirection === 'left' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}
                            >
                                {gestureDirection === 'left' ? '← Swipe to close' : '→ Swipe detected'}
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
