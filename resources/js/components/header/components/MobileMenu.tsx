import { Link } from '@inertiajs/react';
import { ChevronDown, Home, Info, MapPin, Package, Star, Phone, Search, X, User, ArrowLeftRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { MobileMenuProps } from '../types';
import { HEADER_COLORS } from '../constants';

const iconMap: Record<string, React.ElementType> = {
    home: Home,
    info: Info,
    'map-pin': MapPin,
    package: Package,
    star: Star,
    phone: Phone,
};

export function MobileMenu({ isOpen, onClose, navigationItems }: MobileMenuProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const toggleItem = (label: string) => {
        setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />

            {/* Mobile Menu */}
            <div
                ref={menuRef}
                className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-black lg:hidden"
                style={{ backgroundColor: HEADER_COLORS.mainNavBg }}
            >
                <div className="flex min-h-full flex-col">
                    {/* Header dengan Logo dan Close Button */}
                    <div className="flex items-center justify-between border-b border-gray-800 p-4">
                        <div className="flex items-center gap-3">
                            {/* Logo kecil */}
                            <div className="flex-shrink-0">
                                <svg width="40" height="40" viewBox="0 0 60 60">
                                    <circle cx="30" cy="30" r="28" fill="none" stroke="#FF8C00" strokeWidth="2" />
                                    <circle cx="30" cy="30" r="24" fill="none" stroke="#FFD700" strokeWidth="1.5" />
                                    <path d="M20 30 Q30 20 40 30 Q30 40 20 30 Z" fill="#1E40AF" opacity="0.9" />
                                    <text x="30" y="35" fontSize="12" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                                        CA
                                    </text>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">CAHAYA ANBIYA</span>
                                <span className="text-xs font-medium text-white opacity-90">WISATA INDONESIA</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="rounded-md p-2 text-white transition-colors hover:bg-gray-900">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Toggle B2C → B2B */}
                    <div className="border-b border-gray-800 px-4 py-3">
                        <Link
                            href="/home"
                            className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-colors"
                            style={{ backgroundColor: HEADER_COLORS.darkGray }}
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                            B2C → B2B
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="border-b border-gray-800 px-4 py-4">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery.trim()) {
                                    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                                }
                            }}
                            className="flex items-center gap-2"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search destinations.."
                                    className="w-full rounded-lg border px-10 py-2.5 text-sm text-white placeholder-gray-400"
                                    style={{
                                        backgroundColor: HEADER_COLORS.mainNavBg,
                                        borderColor: HEADER_COLORS.gold,
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-lg px-4 py-2.5 text-sm font-medium text-white"
                                style={{ backgroundColor: HEADER_COLORS.gold }}
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-4 py-4">
                        <ul className="space-y-1">
                            {navigationItems.map((item) => {
                                const Icon = item.icon ? iconMap[item.icon] : null;
                                const isExpanded = expandedItems.includes(item.label);
                                const hasChildren = item.hasDropdown && item.children && item.children.length > 0;

                                return (
                                    <li key={item.label}>
                                        {hasChildren ? (
                                            <>
                                                <button
                                                    onClick={() => toggleItem(item.label)}
                                                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-medium text-white transition-colors hover:bg-gray-900"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {Icon && <Icon className="h-5 w-5" />}
                                                        <span>{item.label}</span>
                                                    </div>
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isExpanded && item.children && (
                                                    <ul className="ml-4 mt-1 space-y-1 border-l border-gray-800 pl-4">
                                                        {item.children.map((child) => (
                                                            <li key={child.label}>
                                                                <Link
                                                                    href={child.href}
                                                                    onClick={onClose}
                                                                    className="block rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-900 hover:text-white"
                                                                >
                                                                    {child.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                onClick={onClose}
                                                className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-white transition-colors hover:bg-gray-900"
                                            >
                                                {Icon && <Icon className="h-5 w-5" />}
                                                <span>{item.label}</span>
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Login Button */}
                    <div className="border-t border-gray-800 px-4 py-4">
                        <Link
                            href="/auth/login"
                            className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition-opacity"
                            style={{ backgroundColor: HEADER_COLORS.gold }}
                            onClick={onClose}
                        >
                            <User className="h-5 w-5" />
                            <span>Login</span>
                        </Link>
                    </div>

                    {/* Footer Copyright */}
                    <div className="border-t border-gray-800 px-4 py-4">
                        <p className="text-center text-xs" style={{ color: HEADER_COLORS.lightGray }}>
                            Cahaya Anbiya Travel © 2024 All Rights Reserved
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
