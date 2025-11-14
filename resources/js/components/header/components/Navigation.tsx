import { Link } from '@inertiajs/react';
import { NavigationItem } from '../types';

interface NavigationProps {
    items: NavigationItem[];
    className?: string;
}

export function Navigation({ items, className = '' }: NavigationProps) {
    return (
        <nav className={`hidden items-center space-x-8 md:flex ${className}`}>
            {items.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    className="group relative font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900"
                >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gray-900 transition-all duration-200 group-hover:w-full"></span>
                </Link>
            ))}
        </nav>
    );
}
