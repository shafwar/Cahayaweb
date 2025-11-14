import { Link } from '@inertiajs/react';
import { LogoProps } from '../types';

export function Logo({ className = '', variant = 'b2c' }: LogoProps) {
    const logoText = variant === 'b2c' ? 'CAHAYA ANBIYA' : 'CAHAYA ANBIYA B2B';
    const logoSubtext = variant === 'b2c' ? 'WISATA INDONESIA' : 'BUSINESS PORTAL';

    return (
        <Link href={variant === 'b2c' ? '/' : '/b2b/dashboard'} className={`flex items-center space-x-3 ${className}`}>
            <div className="flex flex-col">
                <span className="font-playfair text-xl font-bold text-gray-900">{logoText}</span>
                <span className="text-xs font-medium tracking-wider text-gray-600">{logoSubtext}</span>
            </div>
        </Link>
    );
}
