import { Link } from '@inertiajs/react';
import { ChevronDown, Home, Info, MapPin, Package, Star, Phone } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { NavigationItem } from '../types';

interface NavigationProps {
    items: NavigationItem[];
    className?: string;
}

const iconMap: Record<string, React.ElementType> = {
    home: Home,
    info: Info,
    'map-pin': MapPin,
    package: Package,
    star: Star,
    phone: Phone,
};

export function Navigation({ items, className = '' }: NavigationProps) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            Object.keys(dropdownRefs.current).forEach((key) => {
                if (dropdownRefs.current[key] && !dropdownRefs.current[key]?.contains(event.target as Node)) {
                    setActiveDropdown(null);
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className={`hidden items-center space-x-6 lg:flex ${className}`}>
            {items.map((item) => {
                const Icon = item.icon ? iconMap[item.icon] : null;

                if (item.hasDropdown && item.children) {
                    return (
                        <div key={item.label} className="relative" ref={(el) => (dropdownRefs.current[item.label] = el)}>
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                                className="group flex items-center gap-1.5 font-medium text-white transition-colors hover:text-gray-200"
                            >
                                {Icon && <Icon className="h-[18px] w-[18px] opacity-80" />}
                                {item.label}
                                <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                            </button>

                            {activeDropdown === item.label && (
                                <div className="absolute left-0 top-full mt-2 w-48 rounded-lg bg-gray-900 shadow-xl">
                                    <div className="py-2">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                className="block px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800"
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="group flex items-center gap-1.5 font-medium text-white transition-colors hover:text-gray-200"
                    >
                        {Icon && <Icon className="h-[18px] w-[18px] opacity-80" />}
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
