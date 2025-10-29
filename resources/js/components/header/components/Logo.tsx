import { Link } from '@inertiajs/react';
import { LogoProps } from '../types';

export function Logo({ className = '', variant = 'b2c' }: LogoProps) {
    return (
        <Link href={variant === 'b2c' ? '/' : '/b2b'} className={`flex items-center space-x-4 ${className}`}>
            {/* Logo Circular dengan desain geometris */}
            <div className="relative flex-shrink-0">
                <svg width="60" height="60" viewBox="0 0 60 60" className="relative z-10">
                    {/* Background circle dengan pattern oranye/emas */}
                    <circle cx="30" cy="30" r="28" fill="none" stroke="#FF8C00" strokeWidth="2" />
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#FFD700" strokeWidth="1.5" />
                    
                    {/* Pattern luar oranye/emas */}
                    <g stroke="#FF8C00" strokeWidth="1" fill="none">
                        <circle cx="30" cy="30" r="26" />
                        <path d="M30 4 A26 26 0 0 1 30 56" />
                        <path d="M30 4 A26 26 0 0 0 30 56" />
                    </g>
                    
                    {/* Desain masjid/geometris biru di tengah */}
                    <g fill="#1E40AF" opacity="0.9">
                        {/* Bentuk lengkungan seperti masjid */}
                        <path d="M20 30 Q30 20 40 30 Q30 40 20 30 Z" />
                        <path d="M22 32 Q30 24 38 32" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
                    </g>
                    
                    {/* Inisial CA */}
                    <text
                        x="30"
                        y="35"
                        fontSize="14"
                        fontWeight="bold"
                        fill="#FFFFFF"
                        textAnchor="middle"
                        fontFamily="Arial, sans-serif"
                    >
                        CA
                    </text>
                    
                    {/* Text melingkar "WORLD WIDE DESTINATION" */}
                    <path id="curve" d="M 10 30 A 20 20 0 0 1 50 30" fill="none" />
                    <text fill="#FFFFFF" fontSize="6" opacity="0.7">
                        <textPath href="#curve" startOffset="50%" textAnchor="middle">
                            WORLD WIDE DESTINATION
                        </textPath>
                    </text>
                </svg>
            </div>

            {/* Text Logo */}
            <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-tight">CAHAYA ANBIYA</span>
                <span className="text-xs font-medium text-white opacity-90 tracking-wide">WISATA INDONESIA</span>
            </div>
        </Link>
    );
}
